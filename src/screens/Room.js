import React, { useEffect, useState } from 'react'
import { Button, Typography } from '@material-ui/core'
import { Card } from '../components/Card'
import { Flex } from '../components/Flex'
import { Action } from '../components/Action'
import { COLORS } from '../constants'

// TODO: show guess made on each player
// TODO: show if guess had at least one component correct
// TODO: Ensure players don't leave if their phone sleeps
// TODO: Allow configuration of reconnect time, phaseTimer, number of cards dealt
// TODO: Send evidence marking over server with player color?
// TODO: Ensure all secrets are removed?

export function Room({ room, setRoom }) {
  const [serverState, setServerState] = useState(initialState)
  const [selectedMeans, setSelectedMeans] = useState()
  const [selectedClue, setSelectedClue] = useState()
  const currentPlayer =
    serverState.players.find((p) => p.id === room.sessionId) || {}

  const sendAction = (action, rest = {}) => room.send(action, rest)
  const state = {
    ...serverState,
    sendAction,
    currentPlayer,
    selectedMeans,
    selectedClue,
    scene: serverState.activeScene.slice(
      0,
      serverState.activeScene.length - serverState.roundsLeft,
    ),
    setSelectedMeans: (s) => setSelectedMeans((o) => (o === s ? null : s)),
    setSelectedClue: (s) => setSelectedClue((o) => (o === s ? null : s)),
    players: serverState.players
      .map((p, index) => ({
        ...p,
        index,
        isClient: p.id === room.sessionId,
      }))
      .sort((a, b) => (a.role === 1 ? -1 : 1)),
  }

  useEffect(() => {
    if (!room) return

    room.onStateChange((state) => setServerState({ ...state }))
    room.onLeave(() => {
      setServerState(initialState)
      setRoom()
    })
  }, [room, setRoom])

  useEffect(() => {
    setSelectedMeans()
    setSelectedClue()
  }, [state.phaseIndex])

  const onLeave = () => {
    localStorage.removeItem(room.id)
    room.leave()
  }

  const renderSeats =
    state.phaseIndex === 2 ||
    state.phaseIndex === -1 ||
    (state.phaseIndex === 0 && currentPlayer.role === 2) ||
    (state.phaseIndex === 1 && currentPlayer.role !== 1)

  const renderEvidence = state.phaseIndex === 1 || state.phaseIndex === 2

  return (
    <Flex variant="column" style={{ paddingTop: 70, paddingBottom: 200 }}>
      <Header onLeave={onLeave} {...state} />

      <Flex variant="column">
        {renderEvidence && (
          <Flex variant="column justify-between" style={{ flexWrap: 'wrap' }}>
            {state.scene
              .filter(
                (item) =>
                  currentPlayer.role === 1 || item.markedValueIndex > -1,
              )
              .map((item, n) => (
                <EvidenceItem
                  key={`s-${n}`}
                  sendAction={sendAction}
                  item={item}
                />
              ))}
          </Flex>
        )}

        {renderSeats && (
          <Flex flex={2} variant="column">
            {state.players.map((player) => (
              <Seat key={`seat-${player.index}`} player={player} {...state} />
            ))}
          </Flex>
        )}
      </Flex>

      <Flex
        flex={0}
        variant="center"
        zIndex={100}
        style={{
          borderTop: '1px solid gray',
          backgroundColor: 'white',
          padding: 10,
          minHeight: 50,
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        {currentPlayer.isAdmin && state.phaseIndex === -1 && (
          <Action
            disabled={state.players.filter((p) => p.role === 1).length === 0}
            onClick={() => sendAction('Deal')}
          >
            Deal
          </Action>
        )}

        <Flex variant="column center">
          {state.message && <Typography>{state.message}</Typography>}

          {state.phaseIndex === 0 &&
            (currentPlayer.role === 2 ? (
              <Flex variant="column center">
                {(!selectedMeans || !selectedClue) && (
                  <p>
                    Select one of your Red Means cards and Blue Clue cards to
                    plan the murder.
                  </p>
                )}
                {selectedMeans && selectedClue && (
                  <p>
                    You will kill the victim using {selectedMeans} and leave
                    behind {selectedClue} as evidence.
                  </p>
                )}
                <Action
                  disabled={!selectedMeans || !selectedClue}
                  onClick={() => {
                    sendAction('Murder', {
                      means: selectedMeans,
                      clue: selectedClue,
                    })
                  }}
                >
                  Commit Murder
                </Action>
              </Flex>
            ) : (
              <p>The murder is currently happening</p>
            ))}

          {state.phaseIndex === 1 &&
            (currentPlayer.role === 1 ? (
              <p>
                Mark the crime scene based on the means {state.activeCrime[1]}{' '}
                and the clue {state.activeCrime[0]}
              </p>
            ) : (
              <p>The Forensic Scientist is investigating</p>
            ))}

          {state.phaseIndex === 2 && (
            <>
              <p>
                Discuss the clues given by Forensics to determine the murderer,
                and via which means (Red) and key evidence (Blue). You only get
                one chance to accuse!
              </p>
              {currentPlayer.hasBadge && (
                <Flex variant="column center">
                  <Action
                    disabled={!selectedMeans || !selectedClue}
                    onClick={() => {
                      sendAction('Accuse', {
                        means: selectedMeans,
                        clue: selectedClue,
                      })
                    }}
                  >
                    Accuse
                  </Action>
                </Flex>
              )}
            </>
          )}
        </Flex>
      </Flex>
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
    <span style={{ minWidth: 50 }}>
      {
        ['PRE-GAME', 'MURDER PHASE', 'EVIDENCE PHASE', 'PRESENTATION PHASE'][
          phaseIndex + 1
        ]
      }
    </span>
    <span style={{ minWidth: 50 }}>{phaseIndex === 2 ? phaseTimer : ''}</span>
  </Flex>
)

const Seat = ({ player, ...state }) => {
  const showSetScientistButton =
    state.currentPlayer.isAdmin && state.phaseIndex === -1
  const canSelect =
    (state.phaseIndex === 0 &&
      state.currentPlayer.role === 2 &&
      player.id === state.currentPlayer.id) ||
    (state.phaseIndex === 2 &&
      player.id !== state.currentPlayer.id &&
      state.currentPlayer.role !== 1)
  const opacity = canSelect ? 'FF' : '55'

  return player.id ? (
    <Flex
      variant="column"
      style={{
        border: `5px solid ${COLORS[player.index]}`,
        margin: 10,
        padding: 10,
      }}
    >
      <Typography variant={player.isClient ? 'h5' : 'body1'}>
        {player.isClient
          ? `You (${player.name || player.id})`
          : player.name || player.id}
        {player.role === 1 ? ' (Scientist)' : ''}
      </Typography>

      {!player.connected && (
        <Typography>
          Disconnected! ({player.remainingConnectionTime} seconds to reconnect)
        </Typography>
      )}

      <Flex variant="justify-between">
        {player.means.map((means, index) => (
          <Card
            backgroundColor={`#D33830${opacity}`}
            selected={state.selectedMeans === means}
            key={`means-${index}`}
            onClick={() => canSelect && state.setSelectedMeans(means)}
          >
            {means}
          </Card>
        ))}
      </Flex>

      <Flex variant="justify-between">
        {player.clues.map((clue, index) => (
          <Card
            backgroundColor={`#0071AA${opacity}`}
            key={`clue-${index}`}
            selected={state.selectedClue === clue}
            onClick={() => canSelect && state.setSelectedClue(clue)}
          >
            {clue}
          </Card>
        ))}
      </Flex>

      {showSetScientistButton && player.role !== 1 && (
        <Button
          variant="contained"
          onClick={() =>
            state.sendAction('AssignScientist', { playerId: player.id })
          }
        >
          Assign Forensic Scientist
        </Button>
      )}
    </Flex>
  ) : null
}

const EvidenceItem = (props) => (
  <Flex variant="column align-center" style={{ margin: 8 }}>
    <Typography variant="h5" align="center">
      {props.item.type}
    </Typography>
    <Flex style={{ width: '100%', flexWrap: 'wrap' }}>
      {props.item.values.map((value, n) => (
        <Flex variant="center" key={`scene-${n}`}>
          <Card
            backgroundColor={
              props.item.markedValueIndex === n ? '#D33830' : 'gray'
            }
            style={{ minWidth: 100 }}
            onClick={() =>
              props.sendAction('MarkEvidence', {
                type: props.item.type,
                value,
              })
            }
          >
            {value}
          </Card>
        </Flex>
      ))}
    </Flex>
  </Flex>
)

const initialState = {
  players: [],
  activeCrime: [],
  activeScene: [],
  roundsLeft: -1,
  phaseIndex: -1,
  phaseTimer: -1,
  message: '',
}
