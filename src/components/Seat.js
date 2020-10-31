import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { Flex } from '.'

export const Seat = ({ player, style = {} }) => {
  const {
    id,
    remainingConnectionTime,
    remainingMoveTime,
    connected,
    clues,
    means,
    isClient,
    index,
    name,
  } = player

  return id ? (
    <Flex
      variant="column"
      style={{
        border: `3px solid ${COLORS[index]}`,
        ...style,
      }}
    >
      <Typography style={{ fontWeight: isClient ? 'bold' : 'normal' }}>
        {name || id}
      </Typography>
      <Flex variant="justify-between">
        {means.map((means, index) => (
          <Typography style={{ margin: 6 }} key={`means-${index}`}>
            {means}
          </Typography>
        ))}
      </Flex>

      <Flex variant="justify-between">
        {clues.map((clue, index) => (
          <Typography style={{ margin: 6 }} key={`clue-${index}`}>
            {clue}
          </Typography>
        ))}
      </Flex>

      {/* <TimeChip
              time={!connected ? remainingConnectionTime : remainingMoveTime}
            /> */}
    </Flex>
  ) : null
}

function TimeChip({ time }) {
  return <Box>{time}</Box>
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
