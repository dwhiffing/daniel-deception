import React, { useState } from 'react'
import { Room } from './screens/Room'
import { Lobby } from './screens/Lobby'

function App() {
  const [room, setRoom] = useState()

  return room ? (
    <Room room={room} setRoom={setRoom} />
  ) : (
    <Lobby setRoom={setRoom} />
  )
}

export default App
