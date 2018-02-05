const mongoose = require('mongoose')
const url = 'mongodb://masavain:puhlu123@ds125388.mlab.com:25388/fullstack-puhelinluettelo'

mongoose.connect(url)
mongoose.Promise = global.Promise;

const personSchema = new mongoose.Schema ({
    name: String,
    number: String,
})

personSchema.statics.format = (person) => {
    return ({name: person.name, 
        number: person.number,
        id: person.id
    })
    
  }
    

const Person = mongoose.model('Person', personSchema)

module.exports = Person