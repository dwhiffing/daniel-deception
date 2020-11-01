import React from 'react'
import { Card } from './Card'
import { Flex } from './Flex'

export const CardStack = ({ cards, ...props }) => (
  <Flex style={{ width: '100%', flexWrap: 'wrap' }}>
    {cards.map((value, n) => (
      <Flex variant="center" key={`card-${n}`}>
        <Card
          backgroundColor={props.getBackgroundColor(n)}
          onClick={() => props.onClick(value)}
          style={{ minWidth: 100 }}
        >
          {value}
        </Card>
      </Flex>
    ))}
  </Flex>
)
