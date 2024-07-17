const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./db.sqlite')

db.serialize(() => {
	db.run(
		`CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            doctorId INTEGER NOT NULL,
            patientId INTEGER NOT NULL,
            nurseId INTEGER NOT NULL
        )`
	)

	db.run(
		`CREATE TABLE IF NOT EXISTS doctors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            department TEXT,
            bio TEXT,
            email TEXT NOT NULL UNIQUE,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )`
	)

	db.run(
		`CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER,
            gender TEXT,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )`
	)

	db.run(
		`CREATE TABLE IF NOT EXISTS nurses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            department TEXT,
            age INTEGER,
            gender TEXT,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )`
	)

	db.run(
		`CREATE TABLE IF NOT EXISTS socket_ids (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            userType TEXT NOT NULL CHECK(userType IN ('doctor', 'patient', 'nurse')),
            socketId TEXT NOT NULL
        )`
	)
})

module.exports = db
