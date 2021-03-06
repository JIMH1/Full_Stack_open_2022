import { useState } from 'react'

const Button = ({handleClick, text}) => {
  console.log()
  return (
    <button onClick={handleClick}>
    {text}
  </button>
  )
}
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length+1).fill(0))
  const vote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }
  const randomizer = () => setSelected(Math.floor(Math.random() * anecdotes.length))

  return (
    <div>
      <h1>Anecdote of the Day</h1>
      <h4>{anecdotes[selected]}</h4>
      <p>has {votes[selected]} votes!!</p>
      <Button handleClick={vote} text="vote"/>
      <Button handleClick={randomizer} text="next anecdote"/>
      <h2>Anecdotes with most votes is....</h2>
      <h4>{anecdotes[votes.indexOf(Math.max(...votes))]}</h4>
      <p>has {Math.max(...votes)} votes!!</p>
    </div>
  )
}

export default App