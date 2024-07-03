const express = require('express')
const tokenGenerator = require('./token_generator')
const cors = require('cors')
const config = require('./config')

const app = express()

app.use(express.json())
app.use(cors())

app.post('/token', (req, res) => {
	const id = req.body.id
	res.send(tokenGenerator(id))
})

app.get('/', (req, res) => {
	res.send('Server running...')
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
	console.log('Server running...', 'PORT', PORT)
})
