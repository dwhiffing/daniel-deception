import React, { useState } from 'react'
import { Button, Checkbox, FormControlLabel } from '@material-ui/core'
import { Flex } from './'

export function Actions({ room, players }) {
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
    </Flex>
  )
}

const Action = ({ variant = 'contained', ...props }) => (
  <Button variant={variant} {...props} style={{ margin: 8 }} />
)
