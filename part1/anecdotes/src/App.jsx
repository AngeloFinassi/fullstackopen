import { useState } from 'react'

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>{text}</button>
)

const Status = ({ index, pointsArr }) => (
  <p>This sentence has {pointsArr[index]} votes</p>
)

const App = () => {
  const anecdotes = [
    'Se fazer algo dói, faça isso com mais frequência.',
    'Contratar mão de obra para um projeto de software que já está atrasado, faz com que se atrase mais ainda!',
    'Os primeiros 90% do código correspondem aos primeiros 10% do tempo...',
    'Qualquer tolo escreve código que um computador consegue entender.',
    'Otimização prematura é a raiz de todo o mal.',
    'Antes de mais nada, depurar é duas vezes mais difícil...',
    'Programar sem o uso extremamente intenso do console.log...',
    'A única maneira de ir rápido é ir bem.'
  ]

  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(
    Array(anecdotes.length).fill(0)
  )

  const nextAnecdote = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length))
  }

  const vote = () => {
    const copy = [...points]
    copy[selected] += 1
    setPoints(copy)
  }

  const maxValue = Math.max(...points)

  return (
    <div>
      <h1>Anecdotes</h1>
      <p>{anecdotes[selected]}</p>

      <Status index={selected} pointsArr={points} />

      <Button text="vote" onClick={vote} />
      <Button text="next anecdote" onClick={nextAnecdote} />

      <h1>Anecdotes with the most votes</h1>
      <p>{anecdotes[points.indexOf(maxValue)]}</p>
      <Status index={points.indexOf(maxValue)} pointsArr={points} />
    </div>
  )
}

export default App
