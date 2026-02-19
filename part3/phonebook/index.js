const express =  require('express')
const morgan = require('morgan')
const app = express()
const { requestLogger } = require('./middleware.js')

app.use(express.json())
app.use(morgan('tiny'))
app.use(requestLogger)

const PORT = 3001

const persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "045-123456"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "050-123456"
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "050-123456"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const date = new Date()
    res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
    `)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.post('/create/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'name or number is missing' })
    }

    const existingPerson = persons.find(p => p.name === body.name)
    if (existingPerson) {
        return res.status(400).json({ error: 'name must be unique' })
    }

    const newPerson = {
        id: Math.floor(Math.random() * 1000000),
        name: body.name,
        number: body.number
    }

    persons.push(newPerson)
    res.json(newPerson)
})

app.put('/update/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'name or number is not defined' })
    }

    const personIndex = persons.findIndex(p => p.id === id)

    if (personIndex === -1) {
        return res.status(404).json({ error: 'the person not exist' })
    }

    const updatedPerson = { ...persons[personIndex], name: body.name, number: body.number }

    persons[personIndex] = updatedPerson

    res.json(persons[personIndex])
})

app.delete('/delete/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        persons = persons.filter(p => p.id !== id)
        res.status(204).end()
    } else {
        res.status(404).end()
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})