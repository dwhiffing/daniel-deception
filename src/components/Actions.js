import React, { useState } from 'react'
import { Button, Checkbox, FormControlLabel } from '@material-ui/core'
import { Flex } from './'

export function Actions({
  room,
  players,
  phaseIndex,
  selectedMeans,
  selectedClue,
}) {
  const player = players.find((p) => p.id === room.sessionId) || {}
  const [showAdmin, setShowAdmin] = useState(true)
  const sendAction = (action, rest = {}) => room.send({ action, ...rest })

  return (
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
      {player.isAdmin && (
        <>
          <FormControlLabel
            control={
              <Checkbox
                checked={showAdmin}
                onChange={(e, newValue) => setShowAdmin(newValue)}
                name="showAdmin"
              />
            }
            label="Admin"
          />
          {showAdmin && (
            <Action disabled={false} onClick={() => sendAction('deal')}>
              Deal
            </Action>
          )}
        </>
      )}

      {player.role === 2 && phaseIndex === 0 && (
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
              sendAction('murder', { means: selectedMeans, clue: selectedClue })
            }}
          >
            Commit Murder
          </Action>
        </Flex>
      )}

      {player.hasBadge && phaseIndex === 2 && (
        <Flex variant="column center">
          <Action
            disabled={!selectedMeans || !selectedClue}
            onClick={() => {
              sendAction('accuse', { means: selectedMeans, clue: selectedClue })
            }}
          >
            Accuse
          </Action>
        </Flex>
      )}
    </Flex>
  )
}

const Action = ({ variant = 'contained', ...props }) => (
  <Button variant={variant} {...props} style={{ margin: 8 }} />
)
