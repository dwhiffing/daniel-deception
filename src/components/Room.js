import { Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Flex } from '.'
import { Actions } from './Actions'
import { Card } from './Card'
import { Seat } from './Seat'

// TODO: handle win conditions
// TODO: add timer
// TODO: put phase details in header

export function Room({ players, scene, room, phaseIndex }) {
  const [selectedMeans, setSelectedMeans] = useState()
  const [selectedClue, setSelectedClue] = useState()
  const currentPlayer = players.find((p) => p.id === room.sessionId) || {}
  let scientist = players.find((p) => p.role === 1)
  let scientistLabel = scientist ? scientist.name : 'none'
  let murderer = players.find((p) => p.role === 2)
  let murdererLabel = murderer ? murderer.name : 'none'

  useEffect(() => {
    setSelectedMeans()
    setSelectedClue()
  }, [phaseIndex])

  if (scientist === currentPlayer) scientistLabel = `You (${scientist.name})`
  if (murderer === currentPlayer) murdererLabel = `You (${murderer.name})`
  const sendAction = (action, rest = {}) => room.send({ action, ...rest })
  return (
    <Flex variant="column" style={{ paddingTop: 50, paddingBottom: 200 }}>
      <Header />

      <Flex variant="column">
        <Typography align="center" variant="h5">
          Forensic Scientist: {scientistLabel}
        </Typography>
        <Typography align="center" variant="h5">
          Murderer: {murdererLabel}
        </Typography>
        <Typography align="center" variant="h5">
          Phase Index: {phaseIndex}
        </Typography>

        <Scene scene={scene} sendAction={sendAction} />

        <Seats
          showSetScientistButton={currentPlayer.isAdmin && phaseIndex === -1}
          sendAction={sendAction}
          currentPlayer={currentPlayer}
          selectedMeans={selectedMeans}
          selectedClue={selectedClue}
          phaseIndex={phaseIndex}
          setSelectedMeans={setSelectedMeans}
          setSelectedClue={setSelectedClue}
          players={players
            .map((p, index) => ({
              ...p,
              index,
              isClient: p.id === room.sessionId,
            }))
            .filter((p) => p.role !== 1)}
        />
      </Flex>

      <Actions
        room={room}
        players={players}
        phaseIndex={phaseIndex}
        selectedMeans={selectedMeans}
        selectedClue={selectedClue}
      />
    </Flex>
  )
}

const Header = () => (
  <Flex
    flex={0}
    variant="row justify-between"
    style={{
      padding: 10,
      borderBottom: '1px solid gray',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
    }}
  >
    <span>Deception</span>
    <span>1:23</span>
    <span>?</span>
  </Flex>
)

const Scene = (props) => (
  <Flex variant="column justify-between" style={{ flexWrap: 'wrap' }}>
    {props.scene.map((item, n) => (
      <Flex
        variant="column align-center"
        key={`scene-${n}`}
        style={{ margin: 8 }}
      >
        <Typography variant="h5" align="center">
          {item.type}
        </Typography>
        <Flex style={{ width: '100%', flexWrap: 'wrap' }}>
          {item.values.map((value, n) => (
            <Flex variant="center" key={`scene-${n}`}>
              <Card
                backgroundColor="gray"
                selected={item.markedValueIndex === n}
                style={{ minWidth: 100 }}
                onClick={() =>
                  props.sendAction('markScene', { type: item.type, value })
                }
              >
                {value}
              </Card>
            </Flex>
          ))}
        </Flex>
      </Flex>
    ))}
  </Flex>
)

const Seats = ({ players, ...props }) => (
  <Flex flex={2} variant="column">
    {players.map((player, n) => (
      <Seat key={`seat-${player.index}`} player={player} {...props} />
    ))}
  </Flex>
)
