import React from 'react'
import { Typography } from '@material-ui/core'
import { Flex } from '.'

export const Card = ({ children, backgroundColor, style = {} }) => (
  <Flex
    variant="center"
    style={{
      ...style,
      margin: 2,
      padding: 10,
      borderRadius: 8,
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
