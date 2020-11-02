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
    _setPhaseTimerMultiple(
      typeof n === 'number' && n <= 100 && n >= 15 ? n : 30,
    )
  return (
    <>
      {currentPlayer.isAdmin ? (
        <Flex>
          <Action
            disabled={players.filter((p) => p.role === 1).length === 0}
            onClick={() =>
              room.send('Deal', {
                numCards: numCards,
                phaseTimerMultiple: phaseTimerMultiple,
              })
            }
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
              const thing = prompt('Set timer duration in seconds (15-100)')
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

const EvidenceActions = ({ currentPlayer, activeCrime }) =>
  currentPlayer.role === 1 ? (
    <Typography>
      Mark the crime scene based on the means {activeCrime[1]} and the clue{' '}
      {activeCrime[0]}
    </Typography>
  ) : (
    <Typography>The Forensic Scientist is investigating</Typography>
  )

const PresentationActions = ({
  currentPlayer,
  selectedClue,
  activeCrime,
  selectedMeans,
  room,
  role,
}) =>
  role !== 1 ? (
    <>
      {role === 2 ? (
        <Typography>
          You are the murderer. You killed the victim using {activeCrime[1]} and
          left behind {activeCrime[1]} as evidence. Try to convince the others
          it wasn't you
        </Typography>
      ) : (
        <Typography>
          Discuss the clues given by Forensics to determine the murderer, and
          via which means (Red) and key evidence (Blue). You only get one chance
          to accuse!
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
