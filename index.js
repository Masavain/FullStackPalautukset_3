const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

morgan.token('data', function (req, res) {
  return (JSON.stringify({ "name": req.body.name, "number": req.body.number }))
})

app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))

const Person = require('./models/person')

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(Person.format))
    })
})

app.get('/info', (req, res) => {
  const date = new Date()
  Person.count({}, function (err, count) {
    res.send(`<p>Puhelinluettelossa on ${count} henkilön tiedot</p>
    <p>${date}</p>`)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(Person.format(person))
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/persons/', (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  var nameToBeAdded = body.name
  Person
    .find({ name: nameToBeAdded })
    .then(result => {
      if (result.map(Person.format).length == 0) {
        person
          .save()
          .then(Person.format)
          .then(savedPerson => {
            response.json(Person.format(savedPerson))
          })
            
      } else {
        response.status(400).send({ error: 'Henkilö on jo olemassa' })
      }
    })

})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(Person.format(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})