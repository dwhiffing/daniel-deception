import React from 'react'
import { Typography } from '@material-ui/core'
import { Flex } from '../../../components/Flex'
import { Action } from '../../../components/Action'

export const Actions = (props) => (
  <Flex flex={0} variant="center" className="actions" zIndex={100}>
    <Flex variant="column center">
      {props.message && <Typography>{props.message}</Typography>}

      {props.phase === -1 && <PreGameActions {...props} />}
      {props.phase === 0 && <MurderActions {...props} />}
      {props.phase === 1 && <EvidenceActions {...props} />}
      {props.phase === 2 && <PresentationActions {...props} />}
    </Flex>
  </Flex>
)

const PreGameActions = ({ phaseIndex, players, currentPlayer, room }) => (
  <>
    {currentPlayer.isAdmin && phaseIndex === -1 && (
      <Action
        disabled={players.filter((p) => p.role === 1).length === 0}
        onClick={() => room.send('Deal')}
      >
        Deal
      </Action>
    )}
  </>
)

const MurderActions = ({ currentPlayer, selectedMeans, selectedClue, room }) =>
  currentPlayer.role === 2 ? (
    <Flex variant="column center">
      {(!selectedMeans || !selectedClue) && (
        <p>
          Select one of your Red Means cards and Blue Clue cards to plan the
          murder.
        </p>
      )}
      {selectedMeans && selectedClue && (
        <p>
          You will kill the victim using {selectedMeans} and leave behind{' '}
          {selectedClue} as evidence.
        </p>
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
    <p>The murder is currently happening</p>
  )

const EvidenceActions = ({ currentPlayer, activeCrime }) =>
  currentPlayer.role === 1 ? (
    <p>
      Mark the crime scene based on the means {activeCrime[1]} and the clue{' '}
      {activeCrime[0]}
    </p>
  ) : (
    <p>The Forensic Scientist is investigating</p>
  )

const PresentationActions = ({
  currentPlayer,
  selectedClue,
  selectedMeans,
  room,
}) => (
  <>
    <p>
      Discuss the clues given by Forensics to determine the murderer, and via
      which means (Red) and key evidence (Blue). You only get one chance to
      accuse!
    </p>
    {currentPlayer.hasBadge && (
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
)
