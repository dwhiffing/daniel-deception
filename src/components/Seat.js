import React from 'react'
import { Button, Box, Typography } from '@material-ui/core'
import { Flex } from '.'

export const Seat = ({ onSit, getPlayer, index, style = {} }) => {
  const player = getPlayer(index) || {}
  const {
    id,
    remainingConnectionTime,
    remainingMoveTime,
    connected,
    isClient,
    name,
  } = player

  let backgroundColor = '#54b786'

  return (
    <Flex position="relative" variant="center">
      <Flex
        flex={1}
        mx={{ xs: 0.25, md: 2 }}
        my={{ xs: 2, md: 4 }}
        variant="center"
        borderRadius={12}
        minWidth={document.documentElement.clientWidth < 400 ? 64 : 83}
        maxWidth={125}
        position="relative"
        py={1}
        style={{
          border: `3px solid ${COLORS[index]}`,
          backgroundColor,
          zIndex: 10,
          ...style,
        }}
      >
        {id ? (
          <>
            <Flex variant="column center">
              <Typography
                style={{
                  fontSize: isClient ? 14 : 12,
                  textAlign: 'center',
                  fontWeight: isClient ? 'bold' : 'normal',
                }}
              >
                {name || id}
              </Typography>
            </Flex>

            <TimeChip
              time={!connected ? remainingConnectionTime : remainingMoveTime}
            />
          </>
        ) : (
          <Button disabled={!onSit} onClick={() => onSit(index)}>
            Sit
          </Button>
        )}
      </Flex>
    </Flex>
  )
}

function TimeChip({ time }) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width={30}
      height={30}
      borderRadius={15}
      position="absolute"
      right={-20}
      style={{
        zIndex: 300,
        boxShadow: 'rgba(0,0,0,0.5) 0px 0px 3px',
        backgroundColor: 'white',
        color: 'green',
      }}
    >
      {time}
    </Box>
  )
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
