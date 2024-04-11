package data

import (
	"errors"

	"gorm.io/gorm"
)

var (
	ErrRecordNotFound = errors.New("record not found")
	ErrEditConflict   = errors.New("edit conflict")
)

type Models struct {
	Users      UserModel
	Tokens     TokenModel
	Favourites FavouriteModel
}

func NewModels(db *gorm.DB) Models {
	return Models{
		Users: UserModel{
			DB: db,
		},
		Tokens: TokenModel{
			DB: db,
		},
		Favourites: FavouriteModel{
			DB: db,
		},
	}
}
