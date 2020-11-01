import React from 'react'
import { Button, Typography } from '@material-ui/core'
import { Flex } from '../../components/Flex'

export function Actions({
  room,
  players,
  phaseIndex,
  selectedMeans,
  message,
  crime,
  selectedClue,
}) {
  const player = players.find((p) => p.id === room.sessionId) || {}
  const sendAction = (action, rest = {}) => room.send(action, rest)

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
      {player.isAdmin && phaseIndex === -1 && (
        <Action
          disabled={players.filter((p) => p.role === 1).length === 0}
          onClick={() => sendAction('Deal')}
        >
          Deal
        </Action>
      )}

      <Flex variant="column center">
        {message && <Typography>{message}</Typography>}

        {phaseIndex === 0 &&
          (player.role === 2 ? (
            <Flex variant="column center">
              {(!selectedMeans || !selectedClue) && (
                <p>
                  Select one of your Red Means cards and Blue Clue cards to plan
                  the murder.
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

        {phaseIndex === 1 &&
          (player.role === 1 ? (
            <p>
              Mark the crime scene based on the means {crime[1]} and the clue{' '}
              {crime[0]}
            </p>
          ) : (
            <p>The Forensic Scientist is investigating</p>
          ))}

        {phaseIndex === 2 && (
          <>
            <p>
              Discuss the clues given by Forensics to determine the murderer,
              and via which means (Red) and key evidence (Blue). You only get
              one chance to accuse!
            </p>
            {player.hasBadge && (
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
  )
}

const Action = ({ variant = 'contained', ...props }) => (
  <Button variant={variant} {...props} style={{ margin: 8 }} />
)
