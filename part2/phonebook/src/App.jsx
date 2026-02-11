import { useState } from 'react'

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

const Persons = ({ persons }) => {
  return (
    <div>
      {persons.map(person => (
        <p key={person.name}>
          {person.name} {person.number}
        </p>
      ))}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '1234' }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')

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

    setPersons(persons.concat({
      name: newName,
      number: newNumber
    }))

    setNewName('')
    setNewNumber('')
  }

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

  const personsToShow =
    filterName === ''
      ? persons
      : persons.filter(person =>
          person.name
            .toLowerCase()
            .includes(filterName.toLowerCase())
        )

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

      <Persons persons={personsToShow} />
    </div>
  )
}

export default App
