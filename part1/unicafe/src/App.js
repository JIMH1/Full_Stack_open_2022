import { useState } from 'react'

const Header = (props) => {
  console.log()
  return (
    <div>
      <h1>
        Give Feedback
      </h1>
    </div>
  )
}
const Button = (props) => {
  console.log()
  return (
    <button onClick={props.handleClick}>
    {props.text}
  </button>
  )
}
const StatisticLine = (props) => {
  return (
    <div>
      <table>
        <tr>
        <td width="60px">{props.text}</td>
        <td>{props.value}</td>
      </tr>
      </table>
    </div>
  )
}
const Statistics = (props) => {
  if (props.total == 0) {
    return (
      <div>
        <h1>Statistics</h1>
        <p>No Feedback Given</p>
      </div>
        )
      }
    return (
      <div>
      <h1>Statistics</h1>
      <StatisticLine text="Good" value={props.good}/>
      <StatisticLine text="Neutral" value={props.neutral}/>
      <StatisticLine text="Bad" value={props.bad}/>
      <StatisticLine text="All" value={props.total}/>
      <StatisticLine text="Average" value={(props.good - props.bad)/(props.total)}/>
      <StatisticLine text="Positive" value={(props.good/props.total * 100) + ' %'}/>
    </div>
  )
}
const App = () => {
  const [Good, setGood] = useState(0)
  const [Neutral, setNeutral] = useState(0)
  const [Bad, setBad] = useState(0)
  const Total = Good + Neutral + Bad

  return (
    <div>
      <Header/>
      <Button handleClick={() => setGood(Good + 1)} text="Good"/>
      <Button handleClick={() => setNeutral(Neutral + 1)} text="Neutral"/>
      <Button handleClick={() => setBad(Bad + 1)} text="Bad"/>
      <Statistics Good={Good} Neutral={Neutral} Bad={Bad} Total={Total}/>
    </div>
  )
}

export default App