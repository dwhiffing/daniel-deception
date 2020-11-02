import React from 'react'
import { Flex } from '../../../components/Flex'
import { Typography } from '@material-ui/core'
import { COLORS } from '../../../constants'
import { Action } from '../../../components/Action'
import { CardStack } from '../../../components/CardStack'

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
      <Flex>
        <Typography
          variant={playerId === state.currentPlayer.id ? 'h5' : 'body1'}
        >
          {playerId === state.currentPlayer.id ? `You (${label})` : label}
          {player.role === 1 ? ' (Scientist)' : ''}
        </Typography>

        {player.guess && player.guess.length > 0 && (
          <Typography style={{ margin: '0 10px 10px', color: 'gray' }}>
            They guessed {player.guess[0]} and {player.guess[1]}
          </Typography>
        )}
      </Flex>

      {!player.connected && (
        <Typography>
          Disconnected! ({player.remainingConnectionTime} seconds to reconnect)
        </Typography>
      )}

      <CardStack
        cards={player.means}
        selected={(means) => means === state.selectedMeans}
        getBackgroundColor={() => `#D33830${opacity}`}
        onClick={(means) => canSelectCards && state.setSelectedMeans(means)}
      />

      <CardStack
        cards={player.clues}
        selected={(clue) => clue === state.selectedClue}
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
