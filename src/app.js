const express = require('express')
const config = require('./config')
const cors = require('cors')
const db = require('./db')
const tokenGenerator = require('./token_generator')
const path = require('path')
const { Server } = require('socket.io')
const { createServer } = require('http')

const app = express()
const server = createServer(app)
const io = new Server(server)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.use((req, res, next) => {
	console.log('Body', req.body)
	console.log('Headers', req.headers)

	next()
})

app.get('/appointments', (req, res) => {
	db.all('SELECT * FROM appointments', (err, rows) => {
		if (err) {
			res.status(500).send({ error: err.message })
			return
		}
		res.send(rows)
	})
})

app.get('/appointments/:id', (req, res) => {
	const { id } = req.params

	if (!id) {
		return res.status(400).send({ message: 'data missing' })
	}

	db.get('SELECT * FROM appointments WHERE id = ?', [id], (err, row) => {
		if (err) {
			res.status(500).send({ error: err.message })
			return
		}
		if (!row) {
			res.status(404).send({ message: 'Appointment not found' })
			return
		}
		res.send(row)
	})
})

app.post('/appointments', (req, res) => {
	const { date, time, doctorId, patientId, nurseId } = req.body

	if (!date || !time || !doctorId || !patientId || !nurseId) {
		return res.status(400).send({ message: 'data missing' })
	}

	db.run(
		'INSERT INTO appointments (date, time, doctorId, patientId, nurseId) VALUES (?, ?, ?, ?, ?)',
		[date, time, doctorId, patientId, nurseId],
		function (err) {
			if (err) {
				res.status(500).send({ error: err.message })
				return
			}
			res.send({ id: this.lastID })
		}
	)
})

app.put('/appointments/:id', (req, res) => {
	const { id } = req.params
	const { date, time, doctorId, patientId, nurseId } = req.body

	if (!date || !time || !doctorId || !patientId || !nurseId || !id) {
		return res.status(400).send({ message: 'data missing' })
	}

	db.run(
		'UPDATE appointments SET date = ?, time = ?, doctorId = ?, patientId = ?, nurseId = ? WHERE id = ?',
		[date, time, doctorId, patientId, nurseId, id],
		function (err) {
			if (err) {
				res.status(500).send({ error: err.message })
				return
			}
			if (this.changes === 0) {
				res.status(404).send({ message: 'Appointment not found' })
				return
			}
			res.send({ message: 'Appointment updated successfully' })
		}
	)
})

app.delete('/appointments/:id', (req, res) => {
	const { id } = req.params

	if (!id) {
		return res.status(400).send({ message: 'data missing' })
	}

	db.run('DELETE FROM appointments WHERE id = ?', id, function (err) {
		if (err) {
			res.status(500).send({ error: err.message })
			return
		}
		if (this.changes === 0) {
			res.status(404).send({ message: 'Appointment not found' })
			return
		}
		res.send({ message: 'Appointment deleted successfully' })
	})
})

app.post('/doctors', (req, res) => {
	const { name, department, bio, email, username, password } = req.body

	console.log(req.body)

	if (!name || !department || !bio || !email || !username || !password) {
		return res.status(400).send({ message: 'data missing' })
	}

	db.run(
		'INSERT INTO doctors (name, department, bio, email, username, password) VALUES (?, ?, ?, ?, ?, ?)',
		[name, department, bio, email, username, password],
		function (err) {
			if (err) {
				res.status(500).send({ error: err.message })
				return
			}
			res.send({ id: this.lastID })
		}
	)
})

app.get('/doctors', (req, res) => {
	db.all('SELECT * FROM doctors', (err, rows) => {
		if (err) {
			res.status(500).send({ error: err.message })
			return
		}
		res.send(rows)
	})
})

app.get('/doctors/:id', (req, res) => {
	const { id } = req.params

	if (!id) {
		return res.status(400).send({ message: 'data missing' })
	}

	db.get('SELECT * FROM doctors WHERE id = ?', [id], (err, row) => {
		if (err) {
			res.status(500).send({ error: err.message })
			return
		}
		if (!row) {
			res.status(404).send({ message: 'Doctor not found' })
			return
		}
		res.send(row)
	})
})

app.put('/doctors/:id', (req, res) => {
	const { id } = req.params
	const { name, department, bio, email, username, password } = req.body

	if (!name || !department || !bio || !email || !username || !password || !id) {
		return res.status(400).send({ message: 'data missing' })
	}

	db.run(
		'UPDATE doctors SET name = ?, department = ?, bio = ?, email = ?, username = ?, password = ? WHERE id = ?',
		[name, department, bio, email, username, password, id],
		function (err) {
			if (err) {
				res.status(500).send({ error: err.message })
				return
			}
			if (this.changes === 0) {
				res.status(404).send({ message: 'Doctor not found' })
				return
			}
			res.send({ message: 'Doctor updated successfully' })
		}
	)
})

app.delete('/doctors/:id', (req, res) => {
	const { id } = req.params

	if (!id) {
		return res.status(400).send({ message: 'data missing' })
	}

	db.run('DELETE FROM doctors WHERE id = ?', id, function (err) {
		if (err) {
			res.status(500).send({ error: err.message })
			return
		}
		if (this.changes === 0) {
			res.status(404).send({ message: 'Doctor not found' })
			return
		}
		res.send({ message: 'Doctor deleted successfully' })
	})
})

app.post('/patients', (req, res) => {
	const { name, age, gender, email, password } = req.body

	if (!name || !age || !gender || !email || !password) {
		return res.status(400).send({ message: 'data missing' })
	}

	db.run(
		'INSERT INTO patients (name, age, gender, email, password) VALUES (?, ?, ?, ?, ?)',
		[name, age, gender, email, password],
		function (err) {
			if (err) {
				res.status(500).send({ error: err.message })
				return
			}
			res.send({ id: this.lastID })
		}
	)
})

app.get('/patients', (req, res) => {
	db.all('SELECT * FROM patients', (err, rows) => {
		if (err) {
			res.status(500).send({ error: err.message })
			return
		}
		res.send(rows)
	})
})

app.get('/patients/:id', (req, res) => {
	const { id } = req.params

	if (!id) {
		return res.status(400).send({ message: 'data missing' })
	}

	db.get('SELECT * FROM patients WHERE id = ?', [id], (err, row) => {
		if (err) {
			res.status(500).send({ error: err.message })
			return
		}
		if (!row) {
			res.status(404).send({ message: 'Patient not found' })
			return
		}
		res.send(row)
	})
})

app.put('/patients/:id', (req, res) => {
	const { id } = req.params
	const { name, age, gender, email, password } = req.body

	if (!name || !age || !gender || !email || !password || !id) {
		return res.status(400).send({ message: 'data missing' })
	}

	db.run(
		'UPDATE patients SET name = ?, age = ?, gender = ?, email = ?, password = ? WHERE id = ?',
		[name, age, gender, email, password, id],
		function (err) {
			if (err) {
				res.status(500).send({ error: err.message })
				return
			}
			if (this.changes === 0) {
				res.status(404).send({ message: 'Patient not found' })
				return
			}
			res.send({ message: 'Patient updated successfully' })
		}
	)
})

app.delete('/patients/:id', (req, res) => {
	const { id } = req.params

	if (!id) {
		return res.status(400).send({ message: 'data missing' })
	}

	db.run('DELETE FROM patients WHERE id = ?', id, function (err) {
		if (err) {
			res.status(500).send({ error: err.message })
			return
		}
		if (this.changes === 0) {
			res.status(404).send({ message: 'Patient not found' })
			return
		}
		res.send({ message: 'Patient deleted successfully' })
	})
})

app.post('/nurses', (req, res) => {
	const { name, age, gender, email, password } = req.body

	if (!name || !age || !gender || !email || !password) {
		return res.status(400).send({ message: 'data missing' })
	}

	db.run(
		'INSERT INTO nurses (name, age, gender, email, password) VALUES (?, ?, ?, ?, ?)',
		[name, age, gender, email, password],
		function (err) {
			if (err) {
				res.status(500).send({ error: err.message })
				return
			}
			res.send({ id: this.lastID })
		}
	)
})

app.get('/nurses', (req, res) => {
	db.all('SELECT * FROM nurses', (err, rows) => {
		if (err) {
			res.status(500).send({ error: err.message })
			return
		}
		res.send(rows)
	})
})

app.get('/nurses/:id', (req, res) => {
	const { id } = req.params

	if (!id) {
		return res.status(400).send({ message: 'data missing' })
	}

	db.get('SELECT * FROM nurses WHERE id = ?', [id], (err, row) => {
		if (err) {
			res.status(500).send({ error: err.message })
			return
		}
		if (!row) {
			res.status(404).send({ message: 'Nurse not found' })
			return
		}
		res.send(row)
	})
})

app.put('/nurses/:id', (req, res) => {
	const { id } = req.params
	const { name, age, gender, email, password } = req.body

	if (!name || !age || !gender || !email || !password || !id) {
		return res.status(400).send({ message: 'data missing' })
	}

	db.run(
		'UPDATE nurses SET name = ?, age = ?, gender = ?, email = ?, password = ? WHERE id = ?',
		[name, age, gender, email, password, id],
		function (err) {
			if (err) {
				res.status(500).send({ error: err.message })
				return
			}
			if (this.changes === 0) {
				res.status(404).send({ message: 'Nurse not found' })
				return
			}
			res.send({ message: 'Nurse updated successfully' })
		}
	)
})

app.delete('/nurses/:id', (req, res) => {
	const { id } = req.params

	if (!id) {
		return res.status(400).send({ message: 'data missing' })
	}

	db.run('DELETE FROM nurses WHERE id = ?', id, function (err) {
		if (err) {
			res.status(500).send({ error: err.message })
			return
		}
		if (this.changes === 0) {
			res.status(404).send({ message: 'Nurse not found' })
			return
		}
		res.send({ message: 'Nurse deleted successfully' })
	})
})

app.get('/socket_id', (req, res) => {
	db.all('SELECT * FROM socket_ids', (err, rows) => {
		if (err) {
			res.status(500).send({ error: err.message })
			return
		}
		res.send(rows)
	})
})

app.post('/token', (req, res) => {
	console.log(req.body)
	const id = req.body.id
	if (!id) {
		return res.status(400).send({ message: 'id required' })
	}

	res.send(tokenGenerator(id))
})

app.get('/', function (req, res) {
	res.sendFile(path.resolve(__dirname, 'index.html'))
})

io.on('connection', (socket) => {
	console.log('a user connected', socket.id)

	const userId = socket.handshake.query.userId
	const userType = socket.handshake.query.userType

	db.get('SELECT * FROM socket_ids WHERE userId = ? AND userType = ?', [userId, userType], (err, row) => {
		if (err) {
			return
		}

		if (!row) {
			db.run('INSERT INTO socket_ids (userId, userType, socketId) VALUES (?, ?, ?)', [
				userId,
				userType,
				socket.id
			])
			return
		}

		db.run('UPDATE socket_ids SET userId = ?, userType = ?, socketId = ? WHERE id = ?', [
			userId,
			userType,
			socket.id,
			row.id
		])
	})

	socket.on('notify', (data) => {
		console.log({ data })

		const { appointmentId } = data

		console.log('notify', { appointmentId })

		if (!appointmentId) {
			return
		}

		db.get('SELECT * FROM appointments WHERE id = ?', [appointmentId], async (err, row) => {
			if (err) {
				return
			}

			if (!row) {
				return
			}

			console.log('nurse', row.nurseId)

			db.get(
				'SELECT * FROM socket_ids WHERE userId = ? AND userType = ?',
				[row.nurseId, 'nurse'],
				async (err, row) => {
					if (err) {
						return
					}

					if (!row) {
						return
					}

					console.log({ token: row.socketId })

					socket.to(row.socketId).emit('notify', data)

					console.log('Sent')
				}
			)
		})
	})

	socket.on('approve', (data) => {
		const { appointmentId } = data

		if (!appointmentId) {
			return
		}

		db.get('SELECT * FROM appointments WHERE id = ?', [appointmentId], async (err, row) => {
			if (err) {
				return
			}

			if (!row) {
				return
			}

			db.get(
				'SELECT * FROM socket_ids WHERE userId = ? AND userType = ?',
				[row.patientId, 'patient'],
				async (err, row) => {
					if (err) {
						return
					}

					if (!row) {
						return
					}

					console.log({ token: row.socketId })

					socket.to(row.socketId).emit('approve', data)

					console.log('Sent')
				}
			)
		})
	})

	socket.on('disconnect', () => {
		console.log('user disconnected', socket.id)
	})
})

const PORT = config.port || 3001

server.listen(PORT, () => {
	console.log(`App running on http://localhost:${PORT}`)
})
