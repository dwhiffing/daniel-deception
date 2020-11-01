import React from 'react'
import { Flex } from '../../../components/Flex'
import { Action } from '../../../components/Action'

export const MurderActions = ({
  currentPlayer,
  selectedMeans,
  selectedClue,
  room,
}) =>
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
