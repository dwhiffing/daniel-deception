import React from 'react'
import { Flex } from '../../../components/Flex'
import { Action } from '../../../components/Action'

export const PresentationActions = ({
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
