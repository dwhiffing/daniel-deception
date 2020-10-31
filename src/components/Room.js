import { Typography } from '@material-ui/core'
import React from 'react'
import { Flex } from '.'
import { Actions } from './Actions'
import { Card } from './Card'
import { Seat } from './Seat'

// TODO: Allow admin to select scientist
// TODO: Allow murderer to select cards
// TODO: allow scientist to mark scene
// TODO: allow investigators to guess
// TODO: handle win conditions

export function Room({ players, scene, room, phaseIndex }) {
  const currentPlayer = players.find((p) => p.id === room.sessionId) || {}
  let scientist = players.find((p) => p.role === 1) || { name: 'none' }
  if (scientist === currentPlayer)
    scientist = { name: `You (${scientist.name})` }
  return (
    <Flex variant="column" style={{ paddingTop: 50, paddingBottom: 80 }}>
      <Header />

      <Flex variant="column">
        <Typography align="center" variant="h5">
          Forensic Scientist: {scientist.name}
        </Typography>

        <Scene scene={scene} />

        <Seats
          showSetScientistButton={currentPlayer.isAdmin && phaseIndex === -1}
          sendAction={(action, rest = {}) => room.send({ action, ...rest })}
          players={players
            .map((p, index) => ({
              ...p,
              index,
              isClient: p.id === room.sessionId,
            }))
            .filter((p) => p.role !== 1)}
        />
      </Flex>

      <Actions room={room} players={players} />
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
              <Card backgroundColor="gray" style={{ minWidth: 100 }}>
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
