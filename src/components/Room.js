import { Button, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Flex } from '.'
import { Actions } from './Actions'
import { Card } from './Card'
import { Seat } from './Seat'

// TODO: Send evidence marking over server with player color?
// TODO: Ensure all secrets are removed

export function Room({ players, crime, scene, room, phaseIndex, phaseTimer }) {
  const [selectedMeans, setSelectedMeans] = useState()
  const [selectedClue, setSelectedClue] = useState()
  const currentPlayer = players.find((p) => p.id === room.sessionId) || {}
  let scientist = players.find((p) => p.role === 1)
  let scientistLabel = scientist ? scientist.name : 'none'

  useEffect(() => {
    setSelectedMeans()
    setSelectedClue()
  }, [phaseIndex])

  if (scientist === currentPlayer) scientistLabel = `You (${scientist.name})`

  const sendAction = (action, rest = {}) => room.send({ action, ...rest })
  return (
    <Flex variant="column" style={{ paddingTop: 70, paddingBottom: 200 }}>
      <Header
        onLeave={() => {
          localStorage.removeItem(room.id)
          room.leave()
        }}
        phaseIndex={phaseIndex}
        phaseTimer={phaseTimer}
      />

      <Flex variant="column">
        {(phaseIndex === 1 || phaseIndex === 2) && (
          <Scene player={currentPlayer} scene={scene} sendAction={sendAction} />
        )}

        <Typography align="center">
          Forensic Scientist: {scientistLabel}
        </Typography>

        {(phaseIndex === 2 ||
          phaseIndex === -1 ||
          (phaseIndex === 0 && currentPlayer.role === 2) ||
          (phaseIndex === 1 && currentPlayer.role !== 1)) && (
          <Seats
            showSetScientistButton={currentPlayer.isAdmin && phaseIndex === -1}
            sendAction={sendAction}
            currentPlayer={currentPlayer}
            selectedMeans={selectedMeans}
            selectedClue={selectedClue}
            phaseIndex={phaseIndex}
            setSelectedMeans={(s) =>
              setSelectedMeans((o) => (o === s ? null : s))
            }
            setSelectedClue={(s) =>
              setSelectedClue((o) => (o === s ? null : s))
            }
            players={players
              .map((p, index) => ({
                ...p,
                index,
                isClient: p.id === room.sessionId,
              }))
              .filter((p) => p.role !== 1)}
          />
        )}
      </Flex>

      <Actions
        room={room}
        players={players}
        crime={crime}
        phaseIndex={phaseIndex}
        selectedMeans={selectedMeans}
        selectedClue={selectedClue}
      />
    </Flex>
  )
}

const Header = ({ phaseIndex, phaseTimer, onLeave }) => (
  <Flex
    flex={0}
    variant="row align-center justify-between"
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
    <Button onClick={onLeave}>Leave</Button>
    <span style={{ minWidth: 50 }}>{PHASES[phaseIndex + 1]}</span>
    <span style={{ minWidth: 50 }}>{phaseTimer}</span>
  </Flex>
)

const Scene = (props) => (
  <Flex variant="column justify-between" style={{ flexWrap: 'wrap' }}>
    {props.scene
      .filter((item) => props.player.role === 1 || item.markedValueIndex > -1)
      .map((item, n) => (
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
                  backgroundColor={
                    item.markedValueIndex === n ? '#D33830' : 'gray'
                  }
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

const PHASES = [
  'PRE-GAME',
  'MURDER PHASE',
  'EVIDENCE PHASE',
  'PRESENTATION PHASE',
]
