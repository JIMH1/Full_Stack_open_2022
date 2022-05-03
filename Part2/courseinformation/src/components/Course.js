import React from 'react'

const Course = ({course}) =>{

    const content = course.parts.map(part => (<Part key={part.id}name ={part.name} exercises ={part.exercises}/> ))
    
    const total = course.parts.reduce((s, p) => s= s+p.exercises,0)
  
        return(
        <div>
          <h2>{course.name}</h2>
          {content}
          <b>Total of {total} exercises</b>
        </div>
      )
    }
    const Part = (props) =>
    {
      return(
        <p>
          {props.name} {props.exercises}
        </p>
      )
    }
  
    export default Course