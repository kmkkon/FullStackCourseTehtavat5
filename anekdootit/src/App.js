import React from 'react';


class App extends React.Component {

  voteforAnecdote = (id) => () =>{
    this.props.store.dispatch({
      type: 'VOTE',
      data: {id}
    })
  }
  
  addAnecdote = (event) => {
    event.preventDefault()
    console.log("addAnecdote")
    console.log(event.target.anecdote.value)
    this.props.store.dispatch({
      type: 'ADD',
      data: event.target.anecdote.value
    })
  }

  render() {
    const anecdotes = this.props.store.getState()
    return (
      <div>
        <h2>Anecdotes</h2>
        {anecdotes.map(anecdote=>
          <div key={anecdote.id}>
            <div>
              {anecdote.content} 
            </div>
            <div>
              has {anecdote.votes} votes
              <button onClick={this.voteforAnecdote(anecdote.id)}>vote</button>
            </div>
          </div>
        )}
        <h2>create new</h2>
        <form onSubmit={this.addAnecdote}>
          <div><input name="anecdote"/></div>
          <button>create</button> 
        </form>
      </div>
    )
  }
}

export default App