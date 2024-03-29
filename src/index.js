import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Room } from './screens/Room'
import { Lobby } from './screens/Lobby'
import { Client } from 'colyseus.js'
import './index.css'

window.colyseus = new Client(
  process.env.NODE_ENV === 'production'
    ? 'wss://web-production-b05a.up.railway.app'
    : 'ws://localhost:3553',
)

function App() {
  const [room, setRoom] = useState()
  return room ? (
    <Room room={room} setRoom={setRoom} />
  ) : (
    <Lobby setRoom={setRoom} />
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
