const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

const generateId = () => {
    const maxId = persons.length > 0 ? persons.map(p => p.id).sort().reverse()[0] : 1
    return maxId + 1
  }

let persons = [
    {
      name: 'Arto Hellas',
      number: '040-123456',
      id: 1
    },
    {
      name: 'Martti Tienari',
      number: '040-123456',
      id: 2
    },
    {
      name: 'Arto Järvinen',
      number: '040-123456',
      id: 3
    },
    {
      name: 'Lea Kutvonen',
      number: '040-123456',
      id: 4
    }
  ]

  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/info', (req, res) => {
    const date = new Date()

    res.send(`<p>Puhelinluettelossa on ${persons.length} henkilön tiedot</p>
    <p>${date}</p>`)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id )

    if ( person ) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
  
    response.status(204).end()
  })

  app.post('/api/persons/', (request, response) => {
    const body = request.body

    if (body.name === undefined || body.number === undefined) {
      return response.status(400).json({error: 'content missing'})
    }

    if (persons.find(p => p.name !== body.name)) {
        return response.status(400).json({error: 'name must be unique'})
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: Math.floor(Math.random()* 1000000)
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })