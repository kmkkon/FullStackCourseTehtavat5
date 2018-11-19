import React from 'react'
import ReactDOM from 'react-dom'
import reducer from './reducer'
import {createStore} from 'redux'

const store = createStore(reducer)

const Statistiikka = (props) => {
  const currentState = store.getState()
  const palautteita = currentState.good + currentState.bad + currentState.ok
  const keskiarvo = (currentState.good - currentState.bad)/ (currentState.good + currentState.bad + currentState.ok)
  const positiivisia = currentState.good + currentState.ok
  console.log(currentState)
  console.log(palautteita)

  if (palautteita === 0) {
    return (
      <div>
        <h2>Statistiikka</h2>
        <div>ei yhtään palautetta annettu</div>
      </div>
    )
  }

  return (
    <div>
      <h2>statistiikka</h2>
      <table>
        <tbody>
          <tr>
            <td>hyvä</td>
            <td>{currentState.good}</td>
          </tr>
          <tr>
            <td>neutraali</td>
            <td>{currentState.ok}</td>
          </tr>
          <tr>
            <td>huono</td>
            <td>{currentState.bad}</td>
          </tr>
          <tr>
            <td>keskiarvo</td>
            <td>{keskiarvo}</td>
          </tr>
          <tr>
            <td>positiivisia</td>
            <td>{positiivisia}</td>
          </tr>
        </tbody>
      </table>

      <button onClick={props.onClick}>nollaa tilasto</button>
    </div >
  )
}

class App extends React.Component {
  klik = (nappi) => () => {
    console.log(nappi + ' painettu')
    store.dispatch({
      type: nappi
    })

  }
  render() {
    return (
      <div>
        <h2>Anna palautetta</h2>
        <button onClick={this.klik('GOOD')}>hyvä</button>
        <button onClick={this.klik('OK')}>neutraali</button>
        <button onClick={this.klik('BAD')}>huono</button>
        <Statistiikka onClick = {this.klik('ZERO')}/>
      </div>
    )
  }
}

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
}

renderApp()
store.subscribe(renderApp)
