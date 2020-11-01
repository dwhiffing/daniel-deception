import React from 'react'
import { Typography } from '@material-ui/core'
import { Flex } from '../../../components/Flex'
import { CardStack } from '../../../components/CardStack'

export const Evidence = (props) =>
  props.renderEvidence && (
    <Flex variant="column justify-between" style={{ flexWrap: 'wrap' }}>
      {props.scene.map((item, i) => (
        <EvidenceItem key={`s${i}`} room={props.room} item={item} />
      ))}
    </Flex>
  )

const EvidenceItem = ({ item, room }) => (
  <Flex variant="column align-center" style={{ margin: 8 }}>
    <Typography variant="h5" align="center">
      {item.type}
    </Typography>

    <CardStack
      cards={item.values}
      getBackgroundColor={(n) =>
        item.markedValueIndex === n ? '#D33830' : 'gray'
      }
      onClick={(value) => room.send('MarkEvidence', { type: item.type, value })}
    />
  </Flex>
)
