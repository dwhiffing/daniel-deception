import React, { useState, useEffect } from 'react'
import { Room } from './components/Room'
import { Lobby } from './components/Lobby'
import { Flex } from './components'

function App() {
  const [room, setRoom] = useState()
  const [players, setPlayers] = useState([])
  const [phaseIndex, setPhaseIndex] = useState(-1)
  const [scene, setScene] = useState([])

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
        } else if (field === 'activeScene') {
          setScene(value.toJSON())
        } else if (field === 'phaseIndex') {
          setPhaseIndex(value)
        }
      })
  }, [room])

  console.log({ players, scene, phaseIndex })

  return (
    <Flex variant="column">
      {room ? (
        <Room room={room} players={players} scene={scene} />
      ) : (
        <Lobby setRoom={setRoom} />
      )}
    </Flex>
  )
}

export default App
