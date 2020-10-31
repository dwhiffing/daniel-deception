import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Client } from 'colyseus.js'

window.colyseus = new Client(
  process.env.NODE_ENV === 'production'
    ? 'wss://daniel-deception.herokuapp.com'
    : 'ws://localhost:3553',
)

ReactDOM.render(<App />, document.getElementById('root'))
