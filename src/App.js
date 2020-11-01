import React, { useState, useEffect } from 'react'
import { Room } from './components/Room'
import { Lobby } from './components/Lobby'
import { Flex } from './components'

function App() {
  const [room, setRoom] = useState()
  const [state, setState] = useState({})

  useEffect(() => {
    if (!room) return

    room.onLeave(() => {
      setRoom()
      setState({})
    })

    room.onStateChange((state) => setState({ ...state }))
  }, [room])

  console.log(state)

  return (
    <Flex variant="column">
      {room ? <Room room={room} {...state} /> : <Lobby setRoom={setRoom} />}
    </Flex>
  )
}

export default App
