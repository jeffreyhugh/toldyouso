package db

import (
	"time"
)

type Row struct {
	ID          int64     `json:"-" gorm:"column:id"`
	Email       string    `json:"email" gorm:"column:email"`
	Message     string    `json:"message" gorm:"column:message"`
	AvailableAt time.Time `json:"availableAt" gorm:"column:available_at"`
	SubmittedAt time.Time `json:"submittedAt" gorm:"column:submitted_at"`
	Encrypted   bool      `json:"encrypted" gorm:"column:encrypted"`
}

type UnsubscribeRow struct {
	ID    int    `json:"-" gorm:"column:id"`
	Token string `json:"token" gorm:"column:token"`
	Email string `json:"email" gorm:"column:email"`
	Valid bool   `json:"valid" gorm:"column:valid"`
}
