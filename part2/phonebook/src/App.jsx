import { useState, useEffect } from 'react'

import personService from './services/persons'
import Notification from './components/Notifications'
import './index.css'


const Filter = ({ value, onChange }) => {
  return (
    <div>
      filter: <input value={value} onChange={onChange} />
    </div>
  )
}


const PersonForm = ({
  onSubmit,
  name,
  number,
  onNameChange,
  onNumberChange
}) => {

  return (
    <form onSubmit={onSubmit}>

      <div>
        name: <input value={name} onChange={onNameChange} />
      </div>

      <div>
        number: <input value={number} onChange={onNumberChange} />
      </div>

      <button type="submit">add</button>

    </form>
  )
}


const Persons = ({ persons, onDelete }) => {
  return (
    <div>

      {persons.map(person =>

        <div key={person.id} className="person">

          {person.name} {person.number}

          <button
            onClick={() => onDelete(person.id)}
            style={{ marginLeft: 10 }}
          >
            delete
          </button>

        </div>

      )}

    </div>
  )
}



const App = () => {

  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')


  // ===========================
  // Notification helper
  // ===========================

  const showMessage = (text, type = 'success') => {
    setMessage(text)
    setMessageType(type)

    setTimeout(() => {
      setMessage(null)
    }, 4000)
  }


  // ===========================
  // Load data
  // ===========================

  useEffect(() => {
    personService.getall()
      .then(data => {
        setPersons(data)
      })
  }, [])


  // ===========================
  // Add / Update
  // ===========================

  const addPerson = (event) => {

    event.preventDefault()

    if (newName === '' || newNumber === '') {
      showMessage('Name or number is empty', 'error')
      return
    }


    const existing = persons.find(p => p.name === newName)


    // UPDATE
    if (existing) {

      if (!window.confirm(
        `${newName} already exists. Replace number?`
      )) {
        return
      }

      const updatedPerson = {
        ...existing,
        number: newNumber
      }


      personService
        .update(existing.id, updatedPerson)

        .then(returned => {

          setPersons(
            persons.map(p =>
              p.id !== existing.id ? p : returned
            )
          )

          showMessage(`Updated ${newName}`)

          setNewName('')
          setNewNumber('')

        })

        .catch(error => {

          showMessage(
            `${newName} was already removed from server`,
            'error'
          )

          setPersons(
            persons.filter(p => p.id !== existing.id)
          )
        })

      return
    }


    // CREATE
    const newPerson = {
      name: newName,
      number: newNumber
    }


    personService
      .create(newPerson)

      .then(returned => {

        setPersons(persons.concat(returned))

        showMessage(`Added ${newName}`)

        setNewName('')
        setNewNumber('')
      })
  }


  // ===========================
  // Delete
  // ===========================

  const deletePerson = (id) => {

    const person = persons.find(p => p.id === id)

    if (!window.confirm(`Delete ${person.name}?`)) {
      return
    }


    personService
      .deletePerson(id)

      .then(() => {

        setPersons(persons.filter(p => p.id !== id))

        showMessage(`Deleted ${person.name}`)
      })

      .catch(() => {

        showMessage(
          `${person.name} was already removed`,
          'error'
        )

        setPersons(
          persons.filter(p => p.id !== id)
        )
      })
  }


  // ===========================
  // Filter
  // ===========================

  const personsToShow = persons.filter(p =>
    p.name.toLowerCase().includes(
      filter.toLowerCase()
    )
  )


  // ===========================
  // Render
  // ===========================

  return (
    <div>

      <h2>Phonebook</h2>


      <Notification
        message={message}
        type={messageType}
      />


      <Filter
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />


      <h3>Add new</h3>


      <PersonForm
        onSubmit={addPerson}
        name={newName}
        number={newNumber}
        onNameChange={e => setNewName(e.target.value)}
        onNumberChange={e => setNewNumber(e.target.value)}
      />


      <h3>Numbers</h3>


      <Persons
        persons={personsToShow}
        onDelete={deletePerson}
      />

    </div>
  )
}

export default App
