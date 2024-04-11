package data

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgconn"
	"gorm.io/gorm"
)

var (
	ErrDuplicateFavourite = errors.New("user already liked this movie")
)

type Favourite struct {
	UserID    int64     `json:"user_id" gorm:"column:user_id"`
	MovieID   int64     `json:"movie_id" gorm:"column:movie_id"`
	CreatedAt time.Time `json:"created_at" gorm:"column:created_at"`
}

func (Favourite) TableName() string { return "favourites" }

type FavouriteModel struct {
	DB *gorm.DB
}

func (f FavouriteModel) InsertFavMovie(fav_movie *Favourite) error {
	// context 3-second timeout deadline
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	if err := f.DB.WithContext(ctx).Create(fav_movie).Error; err != nil {
		var perr *pgconn.PgError
		if errors.As(err, &perr) {
			if perr.Code == "23505" && strings.Contains(perr.Message, "favourites_pkey") {
				return ErrDuplicateFavourite
			}
		}
		return err
	}

	return nil
}

func (f FavouriteModel) GetAllUserFavMovie(UserID int64) ([]*Favourite, error) {
	// context 3-second timeout deadline
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	favs := []*Favourite{}

	if err := f.DB.Table("favourites").WithContext(ctx).Where("user_id = ?", UserID).Find(&favs).Error; err != nil {
		return nil, err
	}

	return favs, nil
}

func (f FavouriteModel) DeleteUserFavMovie(UserID int64, movie_id []int64) error {
	// context 3-second timeout deadline
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	if err := f.DB.WithContext(ctx).
		Where("user_id = ?", UserID).
		Delete(&Favourite{}, "movie_id", movie_id).
		Error; err != nil {
		return err
	}

	return nil
}
