import React from 'react'
import { Button, Typography } from '@material-ui/core'
import { Flex } from '.'
import { Card } from './Card'

export const Seat = ({
  showSetScientistButton,
  sendAction,
  player,
  style = {},
}) => {
  const {
    id,
    // remainingConnectionTime,
    // remainingMoveTime,
    // connected,
    clues,
    role,
    means,
    isClient,
    index,
    name,
  } = player

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
      </Typography>

      <Flex variant="justify-between">
        {means.map((means, index) => (
          <Card backgroundColor={'#D33830'} key={`means-${index}`}>
            {means}
          </Card>
        ))}
      </Flex>

      <Flex variant="justify-between">
        {clues.map((clue, index) => (
          <Card backgroundColor={'#0071AA'} key={`clue-${index}`}>
            {clue}
          </Card>
        ))}
      </Flex>

      {showSetScientistButton && role === 0 && (
        <Button
          variant="contained"
          onClick={() => sendAction('setScientist', { playerId: player.id })}
        >
          Assign Forensic Scientist
        </Button>
      )}

      {/* <TimeChip
              time={!connected ? remainingConnectionTime : remainingMoveTime}
            /> */}
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
