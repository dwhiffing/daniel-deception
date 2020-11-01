import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Client } from 'colyseus.js'

// TODO: show guess made on each player
// TODO: show if guess had at least one component correct
// TODO: Ensure players don't leave if their phone sleeps
// TODO: Ensure players joining/leaving don't shift player state
// TODO: Allow players to leave game in progress
// TODO: ensure that reporting player always works

window.colyseus = new Client(
  process.env.NODE_ENV === 'production'
    ? 'wss://daniel-deception.herokuapp.com'
    : 'ws://localhost:3553',
)

ReactDOM.render(<App />, document.getElementById('root'))
