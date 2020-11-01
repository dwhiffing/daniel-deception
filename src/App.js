import React, { useState, useEffect } from 'react'
import { Room } from './components/Room'
import { Lobby } from './components/Lobby'
import { Flex } from './components'

function App() {
  const [room, setRoom] = useState()
  const [players, setPlayers] = useState([])
  const [phaseIndex, setPhaseIndex] = useState(-1)
  const [roundsLeft, setRoundsLeft] = useState(2)
  const [phaseTimer, setPhaseTimer] = useState(-1)
  const [scene, setScene] = useState([])
  const [crime, setCrime] = useState([])

  useEffect(() => {
    if (!room) return

    room.onLeave(() => {
      setRoom(null)
      setPlayers([])
      setPhaseIndex(-1)
      setRoundsLeft(2)
      setScene([])
    })

    room.state.onChange = (changes) =>
      changes.forEach(({ field, value }) => {
        if (field === 'players') {
          setPlayers(value.toJSON())
        } else if (field === 'activeScene') {
          setScene(value.toJSON())
        } else if (field === 'activeCrime') {
          setCrime(value.toJSON())
        } else if (field === 'phaseIndex') {
          setPhaseIndex(value)
        } else if (field === 'roundsLeft') {
          setRoundsLeft(value)
        } else if (field === 'phaseTimer') {
          setPhaseTimer(value)
        } else if (field === 'message') {
          value && alert(value)
        }
      })
  }, [room])

  console.log({ players, scene, phaseIndex, phaseTimer, crime })

  return (
    <Flex variant="column">
      {room ? (
        <Room
          room={room}
          players={players}
          scene={scene.slice(0, scene.length - roundsLeft)}
          phaseTimer={phaseTimer}
          phaseIndex={phaseIndex}
          crime={crime}
        />
      ) : (
        <Lobby setRoom={setRoom} />
      )}
    </Flex>
  )
}

export default App
