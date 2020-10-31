import React from 'react'
import { Typography } from '@material-ui/core'
import { Flex } from '.'

export const Card = ({
  children,
  selected,
  backgroundColor,
  onClick,
  style = {},
}) => (
  <Flex
    variant="center"
    onClick={onClick}
    style={{
      ...style,
      margin: 2,
      padding: 10,
      borderRadius: 8,
      boxSizing: 'borderBox',
      border: selected ? '4px solid black' : null,
      backgroundColor,
    }}
  >
    <Typography
      style={{ fontWeight: 'bold', textAlign: 'center', color: 'white' }}
    >
      {children}
    </Typography>
  </Flex>
)
