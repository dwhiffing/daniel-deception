import React, { useState } from 'react'
import { Flex } from '../../../components/Flex'
import { Action } from '../../../components/Action'
import { Typography } from '@material-ui/core'

export const Actions = (props) => {
  return (
    <Flex flex={0} variant="center" className="actions" zIndex={100}>
      <Flex variant="column center" style={{ padding: '4px 0' }}>
        {props.phase === -1 && <PreGameActions {...props} />}
        {props.phase === 0 && <MurderActions {...props} />}
        {props.phase === 1 && <EvidenceActions {...props} />}
        {props.phase === 2 && <PresentationActions {...props} />}
        {props.phase === 3 && <ReversalActions {...props} />}
      </Flex>
    </Flex>
  )
}

const PreGameActions = ({ players, currentPlayer, room }) => {
  const [numCards, _setNumCards] = useState(3)
  const [phaseTimerMultiple, _setPhaseTimerMultiple] = useState(30)

  const setNumCards = (n) =>
    _setNumCards(typeof n === 'number' && n <= 5 && n >= 3 ? n : 3)
  const setPhaseTimerMultiple = (n) =>
    _setPhaseTimerMultiple(typeof n === 'number' && n <= 120 && n >= 5 ? n : 30)
  return (
    <>
      {currentPlayer.isAdmin ? (
        <Flex>
          <Action
            disabled={players.filter((p) => p.role === 1).length === 0}
            onClick={() => room.send('Deal', { numCards, phaseTimerMultiple })}
          >
            Deal
          </Action>
          <Action
            onClick={() => {
              const thing = prompt(
                'Set number of means/clue cards to deal to each player (3-5)',
              )
              setNumCards(+thing)
            }}
          >
            Set num cards ({numCards})
          </Action>
          <Action
            onClick={() => {
              const thing = prompt(
                'Set time per investigator in seconds (5-120)',
              )
              setPhaseTimerMultiple(+thing)
            }}
          >
            Set timer duration ({phaseTimerMultiple})
          </Action>
        </Flex>
      ) : null}
    </>
  )
}

const MurderActions = ({ currentPlayer, selectedMeans, selectedClue, room }) =>
  currentPlayer.role === 2 ? (
    <Flex variant="column center">
      {(!selectedMeans || !selectedClue) && (
        <Typography>
          Select one of your Red Means cards and Blue Clue cards to plan the
          murder.
        </Typography>
      )}
      {selectedMeans && selectedClue && (
        <Typography>
          You will kill the victim using {selectedMeans} and leave behind{' '}
          {selectedClue} as evidence.
        </Typography>
      )}
      <Action
        disabled={!selectedMeans || !selectedClue}
        onClick={() => {
          room.send('Murder', {
            means: selectedMeans,
            clue: selectedClue,
          })
        }}
      >
        Commit Murder
      </Action>
    </Flex>
  ) : (
    <Typography>The murder is currently happening</Typography>
  )

const EvidenceActions = ({
  currentPlayer,
  activeCrime,
  activeScene,
  sceneCardsThisRound,
  players,
}) => {
  const num = sceneCardsThisRound - activeScene.length
  const murderer = players.find((m) => m.role === 2)
  const accomplice = players.find((m) => m.role === 3)

  return currentPlayer.role === 1 ? (
    <Typography>
      Mark the crime scene based on the means {activeCrime[1]} and the clue{' '}
      {activeCrime[0]}. You have {num} remaining selection{num > 1 ? 's' : ''}.
    </Typography>
  ) : currentPlayer.role === 2 ? (
    <Typography>
      You commited the crime via {activeCrime[1]} and the clue {activeCrime[0]}.{' '}
      {accomplice ? `Your accomplice was ${accomplice.name}` : ''}
    </Typography>
  ) : currentPlayer.role === 3 ? (
    <Typography>
      You were the accomplice of the murder using {activeCrime[1]} and the clue{' '}
      {activeCrime[0]}. Help the murderer ({murderer.name}) avoid suspicion.
    </Typography>
  ) : currentPlayer.role === 4 ? (
    <Typography>
      You saw the murderer ({murderer.name}) and accomplice ({accomplice.name})
      getting away from the scene. Try to draw attention to them without letting
      them figure out you know. If they can guess you are the witness at the
      end, they win.
    </Typography>
  ) : (
    <Typography>The Forensic Scientist is investigating</Typography>
  )
}

const PresentationActions = ({
  players,
  currentPlayer,
  selectedClue,
  activeCrime,
  selectedMeans,
  room,
  role,
}) => {
  const murderer = players.find((m) => m.role === 2)
  const accomplice = players.find((m) => m.role === 3)
  return role !== 1 ? (
    <>
      {role === 2 ? (
        <Typography>
          You are the murderer. You killed the victim using {activeCrime[1]} and
          left behind {activeCrime[0]} as evidence. Try to convince the others
          it wasn't you.
        </Typography>
      ) : role === 3 ? (
        <Typography>
          You are the accomplice. You killed the victim using {activeCrime[1]}{' '}
          and left behind {activeCrime[0]} as evidence. Try to convince the
          others it wasn't {murderer.name}.
        </Typography>
      ) : role === 4 ? (
        <Typography>
          You are the witness. Try to draw attention to the murderer (
          {murderer.name}) but not yourself. The accomplice was{' '}
          {accomplice.name}. They win if they can guess the witness at the end.
        </Typography>
      ) : (
        <Typography>
          You are a detective. Discuss the clues given to determine the
          murderer, and via which means (Red) and key evidence (Blue). You only
          get one chance to accuse!
        </Typography>
      )}
      {currentPlayer.guess.length === 0 && (
        <Flex variant="column center">
          <Action
            disabled={!selectedMeans || !selectedClue}
            onClick={() => {
              room.send('Accuse', {
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
  ) : (
    <Typography>
      Plan your next clue based on how the investigators responded to your last
      one!
    </Typography>
  )
}

const ReversalActions = ({
  players,
  currentPlayer,
  selectedClue,
  activeCrime,
  selectedMeans,
  room,
  role,
}) => {
  // const murderer = players.find((m) => m.role === 2)
  // const accomplice = players.find((m) => m.role === 3)
  return role !== 1 ? (
    <>
      {role === 2 ? (
        <Typography>
          You are the murderer. You've been made, but if you can guess who the
          witness was, you'll win.
        </Typography>
      ) : role === 3 ? (
        <Typography>
          You are the accomplice. You've been made, but if the murderer can
          guess who the witness was, you'll win. Try to nudge them in the right
          direction.
        </Typography>
      ) : role === 4 ? (
        <Typography>
          You are the witness. The murderers have almost been caught. If they
          find you, they'll kill you and get away with the crime.
        </Typography>
      ) : (
        <Typography>
          You are a detective. You've almost caught the criminals, but if the
          witness disappears, they'll get away!
        </Typography>
      )}
      {currentPlayer.role === 2 && (
        <Flex variant="column center">
          {players.map((player) => (
            <Action
              onClick={() => {
                room.send('Reversal', { selectedPlayerId: player.id })
              }}
            >
              Guess {player.name}
            </Action>
          ))}
        </Flex>
      )}
    </>
  ) : (
    <Typography>
      Plan your next clue based on how the investigators responded to your last
      one!
    </Typography>
  )
}
