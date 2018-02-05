const mongoose = require('mongoose')

const url = 'mongodb://masavain:puhlu123@ds125388.mlab.com:25388/fullstack-puhelinluettelo'

mongoose.connect(url)
mongoose.Promise = global.Promise;

const Person = mongoose.model('Person', {
  name: String,
  number: String,
})



  if (process.argv.length <= 2) {
    Person
    .find({})
    .then(result => {
        console.log('puhelinluettelo:')
      result.forEach(person => {
          console.log(person)
      })
      mongoose.connection.close()
    })
  } else {
    const person = new Person({
        name: process.argv[2],
        number: process.argv[3]
      })
      
      person
        .save()
        .then(response => {
          console.log(`lisätään henkilö ${person.name} numero ${person.number} luetteloon`)
          mongoose.connection.close()
        })
  }
