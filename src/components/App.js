import React, { useState, useEffect } from 'react'
import { Actions } from './Actions'
import { Room } from './Room'
import { Lobby } from './Lobby'
import { Flex } from './index'

function App() {
  const [room, setRoom] = useState()
  const [players, setPlayers] = useState([])

  useEffect(() => {
    if (!room) return

    room.onLeave(() => {
      setRoom(null)
      setPlayers([])
    })

    room.state.onChange = (changes) =>
      changes.forEach(({ field, value }) => {
        if (field === 'players') {
          setPlayers(value.toJSON())
        }
      })
  }, [room])

  if (!room) {
    return <Lobby setRoom={setRoom} />
  }

  return (
    <Flex
      variant="column center"
      overflow="hidden"
      style={{
        width:
          document.documentElement.clientWidth > 500
            ? 'calc(100vw - 20px)'
            : '100vw',
        height: 'calc(100vh - 60px)',
        padding:
          document.documentElement.clientWidth > 500 ? '30px 10px' : '30px 0',
      }}
    >
      <Room room={room} players={players} />
      <Actions room={room} players={players} />
    </Flex>
  )
}

export default App
