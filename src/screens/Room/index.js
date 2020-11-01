import { Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Flex } from '../../components/Flex'
import { Actions } from './Actions'
import { Card } from '../../components/Card'
import { Seat } from './Seat'
import { Header } from './Header'

export function Room({ room, setRoom }) {
  const [serverState, setServerState] = useState({})
  const [selectedMeans, setSelectedMeans] = useState()
  const [selectedClue, setSelectedClue] = useState()

  const {
    players = [],
    activeCrime = [],
    activeScene = [],
    roundsLeft = -1,
    phaseIndex = -1,
    phaseTimer = -1,
    message = '',
  } = serverState
  const currentPlayer = players.find((p) => p.id === room.sessionId) || {}
  const scene = activeScene.slice(0, activeScene.length - roundsLeft)

  useEffect(() => {
    if (!room) return

    room.onStateChange((state) => setServerState({ ...state }))
    room.onLeave(() => {
      setServerState({})
      setRoom()
    })
  }, [room, setRoom])

  useEffect(() => {
    setSelectedMeans()
    setSelectedClue()
  }, [phaseIndex])

  const sendAction = (action, rest = {}) => room.send(action, rest)
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
              .sort((a, b) => (a.role === 1 ? -1 : 1))}
          />
        )}
      </Flex>

      <Actions
        room={room}
        players={players}
        crime={activeCrime}
        message={message}
        phaseIndex={phaseIndex}
        selectedMeans={selectedMeans}
        selectedClue={selectedClue}
      />
    </Flex>
  )
}

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
                    props.sendAction('MarkEvidence', { type: item.type, value })
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

export const PHASES = [
  'PRE-GAME',
  'MURDER PHASE',
  'EVIDENCE PHASE',
  'PRESENTATION PHASE',
]
