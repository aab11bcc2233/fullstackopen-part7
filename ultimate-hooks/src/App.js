import { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    console.log('get all from', baseUrl)
    axios.get(baseUrl)
      .then((response) => {
        console.log('get all response:', response)
        const data = response.data
        setResources(data)
      })
      .catch((error) => {
        console.log('get all error:', error)
        setResources([])
      })
  }, [])

  const create = (resource) => {
    console.log('create', resource, 'to', baseUrl)
    axios.post(baseUrl, resource)
      .then((response) => {
        console.log('create', resource, 'to', baseUrl, 'response:', response)
        const data = response.data
        setResources(resources.concat(data))
      })
      .catch((error) => {
        console.log('create', resource, 'to', baseUrl, 'error:', error)
      })
  }

  const service = {
    create
  }

  return [
    resources, service
  ]
}

const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
  }

  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value })
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br />
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App