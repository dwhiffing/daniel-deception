import React from 'react'
import { Flex } from '../../../components/Flex'
import { Typography } from '@material-ui/core'
import { COLORS } from '../../../constants'
import { Action } from '../../../components/Action'
import { CardStack } from '../../../components/CardStack'

// TODO: show guess made on each player

export const Seats = (props) =>
  props.renderSeats && (
    <Flex flex={2} variant="column">
      {props.players.map((player, i) => (
        <Seat key={`p${i}`} player={player} index={i} {...props} />
      ))}
    </Flex>
  )

const Seat = ({ player, index, phase, role, ...state }) => {
  const showSetScientistButton = state.currentPlayer.isAdmin && phase === -1
  const playerId = player.id
  const label = player.name || player.id
  const isClient = playerId === state.currentPlayer.id

  const canSelectCards =
    (phase === 0 && isClient && role === 2) ||
    (phase === 2 && !isClient && role !== 1)

  const opacity = canSelectCards ? 'FF' : '55'
  const color = COLORS[index]
  const style = { border: `5px solid ${color}`, margin: 10, padding: 10 }

  return playerId ? (
    <Flex variant="column" style={style}>
      <Typography
        variant={playerId === state.currentPlayer.id ? 'h5' : 'body1'}
      >
        {playerId === state.currentPlayer.id ? `You (${label})` : label}
        {player.role === 1 ? ' (Scientist)' : ''}
      </Typography>

      {!player.connected && (
        <Typography>
          Disconnected! ({player.remainingConnectionTime} seconds to reconnect)
        </Typography>
      )}

      <CardStack
        cards={player.means}
        getBackgroundColor={() => `#D33830${opacity}`}
        onClick={(means) => canSelectCards && state.setSelectedMeans(means)}
      />

      <CardStack
        cards={player.clues}
        getBackgroundColor={() => `#0071AA${opacity}`}
        onClick={(clue) => canSelectCards && state.setSelectedClue(clue)}
      />

      {showSetScientistButton && player.role !== 1 && (
        <Action
          onClick={() => state.room.send('AssignScientist', { playerId })}
        >
          Assign Forensic Scientist
        </Action>
      )}
    </Flex>
  ) : null
}
