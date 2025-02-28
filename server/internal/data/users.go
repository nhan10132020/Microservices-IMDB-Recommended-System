package data

import (
	"context"
	"crypto/sha256"
	"errors"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgconn"
	"github.com/nhan10132020/imdb/server/internal/validator"
	"gorm.io/gorm"
)

var (
	ErrDuplicateEmail = errors.New("duplicate email")
)

var AnonymousUser = &User{}

type User struct {
	ID        int64     `json:"id" gorm:"column:id"`
	CreatedAt time.Time `json:"created_at" gorm:"column:created_at"`
	Name      string    `json:"name" gorm:"column:name"`
	Email     string    `json:"email" gorm:"column:email"`
	Password  password  `json:"-" gorm:"column:password_hash"`
	Activated bool      `json:"activated" gorm:"column:activated"`
	Version   *int      `json:"-" gorm:"column:version;default:1"`
}

func (u *User) IsAnonymous() bool {
	return u == AnonymousUser
}

func (User) TableName() string { return "users" }

func ValidateEmail(v *validator.Validator, email string) {
	v.Check(email != "", "email", "must be provided")
	v.Check(validator.Matches(email, validator.EmailRX), "email", "must be a valid email address")
}

func ValidatePasswordPlaintext(v *validator.Validator, password string) {
	v.Check(password != "", "password", "must be provided")
	v.Check(len(password) >= 8, "password", "must be at least 8 bytes long")
	v.Check(len(password) <= 72, "password", "must not be more than 72 bytes long")
}

func ValidateUser(v *validator.Validator, user *User, rePassword string) {
	v.Check(user.Name != "", "name", "must be provided")
	v.Check(len(user.Name) <= 500, "name", "must not be more than 500 bytes long")

	ValidateEmail(v, user.Email)
	if user.Password.plaintext != nil {
		ValidatePasswordPlaintext(v, *user.Password.plaintext)
		v.Check(*user.Password.plaintext == rePassword, "password", "do not match")
	}

	if user.Password.hash == nil {
		panic("missing password hash for user")
	}
}

type UserModel struct {
	DB *gorm.DB
}

func (m UserModel) Insert(user *User) error {
	// context 3-second timeout deadline
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	if err := m.DB.WithContext(ctx).Create(user).Error; err != nil {
		var perr *pgconn.PgError
		if errors.As(err, &perr) {
			if perr.Code == "23505" && strings.Contains(perr.Message, "users_email_key") {
				return ErrDuplicateEmail
			}
		}
		return err
	}

	return nil
}

func (m UserModel) GetByEmail(email string) (*User, error) {
	var user User

	// context 3-second timeout deadline
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	if err := m.DB.WithContext(ctx).Where("email = ?", email).First(&user).Error; err != nil {
		switch {
		case errors.Is(err, gorm.ErrRecordNotFound):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}
	return &user, nil
}

func (m UserModel) Update(user *User) error {
	*user.Version += 1

	// context 3-second timeout deadline
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	// at condition on "version" field to avoid data race existing
	result := m.DB.
		WithContext(ctx).
		Where("version = ?", *user.Version-1).
		Updates(user)

	if err := result.Error; err != nil {
		var perr *pgconn.PgError
		switch {
		case errors.As(err, &perr):
			if perr.Code == "23505" && strings.Contains(perr.Message, "users_email_key") {
				return ErrDuplicateEmail
			}
		default:
			return err
		}
	}

	if result.RowsAffected == 0 {
		return ErrEditConflict
	}

	return nil
}

func (m UserModel) GetForToken(tokenScope, tokenPlaintext string) (*User, error) {
	// calculate the SHA-256 hash of the plaintext token provided by the client
	tokenHash := sha256.Sum256([]byte(tokenPlaintext))

	var user User

	// context 3-second timeout deadline
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	if err := m.DB.
		WithContext(ctx).
		Joins("inner join tokens on users.id = tokens.user_id").
		Where("tokens.hash = ? AND tokens.scope = ? AND tokens.expiry > ?", tokenHash[:], tokenScope, time.Now()).
		First(&user).
		Error; err != nil {
		switch {
		case errors.Is(err, gorm.ErrRecordNotFound):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &user, nil
}
