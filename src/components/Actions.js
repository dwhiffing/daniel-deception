import React, { useState } from 'react'
import { Button, Checkbox, FormControlLabel } from '@material-ui/core'
import { Flex } from './'

export function Actions({ room, players }) {
  const player = players.find((p) => p.id === room.sessionId) || {}
  const canStand = player.seatIndex !== -1
  const sendAction = (action, rest = {}) => room.send({ action, ...rest })

  return (
    <>
      <BottomActions
        player={player}
        players={players}
        sendAction={sendAction}
      />

      <Flex
        flex={0}
        justifyContent="flex-end"
        position="fixed"
        top={10}
        left={0}
        right={0}
        zIndex={100}
      >
        <Button
          onClick={() => {
            if (canStand) {
              sendAction('stand')
            } else {
              localStorage.removeItem(room.id)
              room.leave()
            }
          }}
        >
          {canStand ? 'Stand' : 'Leave'}
        </Button>
      </Flex>
    </>
  )
}

const Action = ({ variant = 'contained', ...props }) => (
  <Button variant={variant} {...props} style={{ margin: 8 }} />
)

function BottomActions({ sendAction, player, players }) {
  const [showAdmin, setShowAdmin] = useState(false)

  return (
    <Flex
      flex={0}
      variant="column center"
      position="fixed"
      bottom={10}
      left={0}
      right={0}
      zIndex={100}
    >
      <Flex
        variant="justify-center"
        style={{ flexWrap: 'wrap', maxWidth: 600 }}
      >
        <>
          {player.isAdmin && (
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
          )}

          {showAdmin && (
            <>
              <Action
                disabled={players.length >= 10}
                onClick={() => sendAction('addBot')}
              >
                + bot
              </Action>
              <Action
                disabled={players.filter((p) => p.isBot).length === 0}
                onClick={() => sendAction('removeBot')}
              >
                - bot
              </Action>
            </>
          )}
        </>
      </Flex>
    </Flex>
  )
}
