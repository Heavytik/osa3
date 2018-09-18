
const express = require("express");
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('content', function getContent (req) {
  return JSON.stringify(req.body)
})

const app = express();

app.use(cors())
app.use(bodyParser.json())

// part to handle logging
app.use(morgan(':method :url :content :response-time'))

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Martti Tienari",
    number: "040-123456",
    id: 2
  },
  {
    name: "Arto Järvinen",
    number: "040-123456",
    id: 3
  },
  {
    name: "Lea Kutvonen",
    number: "040-123456",
    id: 4
  }
]

app.get("/", (req, res) => {

});

app.get("/api/persons", (req, res) => {
  // automaattinen content-type application/json sekä automaattinen stringify()
  res.json(persons);
});

app.get("/info", (req, res) => {
  const personsAmount = persons.length
  res.send(
    "<p>Puhelinluettelossa on " + personsAmount + " henkilön tiedot.</p><p>" + Date() +"</p>"
  )
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if( person ) { // jokainen javascript olio on tosi
    res.json(person)
  } else {
    res.status(404).end() // ilman dataa => end()-metodi.
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({error: 'content missing'})
  }
  if (!persons.every(person => person.name !== body.name )) {
    return res.status(400).json({error: 'name must be unique'})
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 1000000)
  }

  persons = persons.concat(person)

  res.json(persons)
})

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});