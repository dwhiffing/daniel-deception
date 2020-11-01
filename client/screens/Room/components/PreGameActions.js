import React from 'react'
import { Action } from '../../../components/Action'

export const PreGameActions = ({
  phaseIndex,
  players,
  currentPlayer,
  room,
}) => (
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
