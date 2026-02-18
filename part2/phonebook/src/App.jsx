import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({
  filterName,
  handleFilterChange,
  handleFind
}) => {
  return (
    <form onSubmit={handleFind}>
      <div>
        filter shown with:{' '}
        <input
          value={filterName}
          onChange={handleFilterChange}
        />
        <button type="submit">find</button>
      </div>
    </form>
  )
}

const PersonForm = ({
  addContact,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange
}) => {
  return (
    <form onSubmit={addContact}>
      <div>
        name:{' '}
        <input
          value={newName}
          onChange={handleNameChange}
        />
      </div>

      <div>
        number:{' '}
        <input
          value={newNumber}
          onChange={handleNumberChange}
        />
      </div>

      <button type="submit">add</button>
    </form>
  )
}

const Persons = ({ persons, onClick }) => {
  return (
    <div>
      {persons.map(person => (
        <><p key={person.name}>
          {person.name} {person.number}
        </p><button onClick={() => onClick(person.id)}>delete</button></>
      ))}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')

  const deletePerson = (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      personService.deletePerson(id)
        .then(() => {
          //create a new arr where the deleted person is filtered out and set it as the new state
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const addContact = (event) => {
    event.preventDefault()

    if (newName === '' || newNumber === '') {
      alert('Name and number cannot be empty')
      return
    }

    if (persons.some(p => p.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService.create(personObject)
      .then(response => {
        setPersons(persons.concat(response))
        setNewName('')
        setNewNumber('')
      })
  }

  useEffect(() => {
    personService.getall().then(data => {
      setPersons(data)
    })
  }, [])

  const handleFind = (event) => {
    event.preventDefault()

    if (filterName === '') {
      alert('Type a name to search')
      return
    }

    const found = persons.find(
      person =>
        person.name.toLowerCase() ===
        filterName.toLowerCase()
    )

    if (found) {
      alert(`${found.name} ${found.number}`)
    } else {
      alert(`${filterName} not found`)
    }

    setFilterName('')
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter
        filterName={filterName}
        handleFilterChange={(e) =>
          setFilterName(e.target.value)
        }
        handleFind={handleFind}
      />

      <h3>Add a new</h3>

      <PersonForm
        addContact={addContact}
        newName={newName}
        handleNameChange={(e) =>
          setNewName(e.target.value)
        }
        newNumber={newNumber}
        handleNumberChange={(e) =>
          setNewNumber(e.target.value)
        }
      />

      <h3>Numbers</h3>

      <Persons persons={persons} onClick={deletePerson}/>
    </div>
  )
}

export default App