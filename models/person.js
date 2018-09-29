//import { mongo } from 'mongoose';

const mongoose = require('mongoose')
const Schema = mongoose.Schema

if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongoose.connect(url)

const personSchema = new Schema({
  name: String,
  number: String
})

personSchema.statics.format = person => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

const Person = mongoose.model('{Person}', personSchema)

/*
if(process.argv.length > 2) {
    const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
    })

    person
    .save()
    .then(response => {
        console.log('lisätään henkilö ' + process.argv[2] + ' numero ' + process.argv[3] + ' luetteloon')
        mongoose.connection.close()
    })
} else {
    Person
    .find({})
    .then(result => {
        console.log('puhelinluettelo:')
        result.forEach(person => {
        console.log(person)
        })
        mongoose.connection.close()
    })

}
*/

module.exports = Person
