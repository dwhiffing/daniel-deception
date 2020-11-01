import React from 'react'
import { Button, Typography } from '@material-ui/core'
import { Card } from '../../components/Card'
import { Flex } from '../../components/Flex'

export const Seat = ({
  showSetScientistButton,
  sendAction,
  player,
  currentPlayer,

  phaseIndex,
  selectedClue,
  setSelectedClue,
  selectedMeans,
  setSelectedMeans,
  style = {},
}) => {
  const {
    id,
    clues,
    role,
    means,
    isClient,
    index,
    name,
    remainingConnectionTime,
    connected,
  } = player

  const canSelect =
    (phaseIndex === 0 &&
      currentPlayer.role === 2 &&
      player.id === currentPlayer.id) ||
    (phaseIndex === 2 && id !== currentPlayer.id && currentPlayer.role !== 1)

  const opacity = canSelect ? 'FF' : '55'

  return id ? (
    <Flex
      variant="column"
      style={{
        border: `5px solid ${COLORS[index]}`,
        margin: 10,
        padding: 10,
        ...style,
      }}
    >
      <Typography variant={isClient ? 'h5' : 'body1'}>
        {isClient ? `You (${name || id})` : name || id}
        {role === 1 ? ' (Scientist)' : ''}
      </Typography>

      {!connected && (
        <Typography>
          Disconnected! ({remainingConnectionTime} seconds to reconnect)
        </Typography>
      )}

      <Flex variant="justify-between">
        {means.map((means, index) => (
          <Card
            backgroundColor={`#D33830${opacity}`}
            selected={selectedMeans === means}
            key={`means-${index}`}
            onClick={() => canSelect && setSelectedMeans(means)}
          >
            {means}
          </Card>
        ))}
      </Flex>

      <Flex variant="justify-between">
        {clues.map((clue, index) => (
          <Card
            backgroundColor={`#0071AA${opacity}`}
            key={`clue-${index}`}
            selected={selectedClue === clue}
            onClick={() => canSelect && setSelectedClue(clue)}
          >
            {clue}
          </Card>
        ))}
      </Flex>

      {showSetScientistButton && role !== 1 && (
        <Button
          variant="contained"
          onClick={() => sendAction('AssignScientist', { playerId: player.id })}
        >
          Assign Forensic Scientist
        </Button>
      )}
    </Flex>
  ) : null
}

const COLORS = [
  '#0071AA',
  '#ECE4B7',
  '#E8C340',
  '#D33830',
  '#A06033',
  '#EA9438',
  '#E27C81',
  '#7FC12E',
  '#525252',
  '#AA5BAF',
]
