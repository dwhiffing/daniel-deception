import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Client } from 'colyseus.js'

// TODO: show guess made on each player
// TODO: show if guess had at least one component correct
// TODO: Ensure players don't leave if their phone sleeps
// TODO: Allow configuration of reconnect time, phaseTimer, number of cards dealt
// TODO: Send evidence marking over server with player color?
// TODO: Ensure all secrets are removed?

window.colyseus = new Client(
  process.env.NODE_ENV === 'production'
    ? 'wss://daniel-deception.herokuapp.com'
    : 'ws://localhost:3553',
)

ReactDOM.render(<App />, document.getElementById('root'))
