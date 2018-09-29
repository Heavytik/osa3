const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

morgan.token("content", function getContent(req) {
  return JSON.stringify(req.body);
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(express.static("build"));

// part to handle logging
app.use(morgan(":method :url :content :response-time"));

// database acsess
const getPersons = () => {};

app.get("/api/persons", (req, res) => {
  Person.find({})
    .then(persons => {
      return res.json(persons.map(Person.format));
    })
    .catch(error => {
      res.status(404).end();
    });
});

app.get("/info", (req, res) => {
  Person.find({}).then(persons => {
    const personsAmount = persons.length;
    res.send(
      "<p>Puhelinluettelossa on " +
        personsAmount +
        " henkilön tiedot.</p><p>" +
        Date() +
        "</p>"
    );
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.param.id)
    .then(person => {
      return res.json(Person.format(person));
    })
    .catch(error => {
      res.status(404).end();
    });
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => {
      res.status(400).send({ error: "malformatted id" });
    });
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({ error: "content missing" });
  }
  /*if (!persons.every(person => person.name !== body.name)) {
    return res.status(400).json({ error: "name must be unique" });
  }*/

  const person = new Person({
    name: body.name,
    number: body.number
  });

  Person.find({ name: body.name }).then(result => {
    if (result.length > 0) {
      return res.status(403).json({ error: "name already exist" });
    } else {
      person
        .save()
        .then(response => {
          res.json(Person.format(response));
        })
        .catch(error => {
          console.log(error);
        });
    }
  });
});

app.put("/api/persons/:id", (request, response) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(Person.format(updatedPerson));
    })
    .catch(error => {
      response.status(400).send({ error: "malformatted id" });
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
