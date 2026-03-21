// TEMPLATE_META:START
/*
@template-id: go-gorm-models
@version: 1.0.0
@description: GORM Models for User and Base Structs
@dependencies: gorm.io/gorm
@customization-points: TABLE_PREFIX
@language: go
@framework: Gin
*/
// TEMPLATE_META:END

package main

import (
	"time"
	"gorm.io/gorm"
)

type Base struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type User struct {
	Base
	Username string `gorm:"uniqueIndex;not null" json:"username"`
	Password string `gorm:"not null" json:"-"`
	Email    string `gorm:"uniqueIndex" json:"email"`
	Active   bool   `gorm:"default:true" json:"active"`
}

// TableName overrides the table name used by User to `profiles`
func (User) TableName() string {
	return "{{TABLE_PREFIX}}users"
}
