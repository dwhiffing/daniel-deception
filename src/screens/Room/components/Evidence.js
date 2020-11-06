import React from 'react'
import { Typography } from '@material-ui/core'
import { Flex } from '../../../components/Flex'
import { CardStack } from '../../../components/CardStack'

export const Evidence = (props) =>
  props.renderEvidence && (
    <Flex variant="justify-between" style={{ flexWrap: 'wrap' }}>
      {props.scene
        .sort((s) => (s.markedValueIndex === -1 ? 1 : -1))
        .map((item, i) => (
          <EvidenceItem
            key={`s${i}`}
            role={props.role}
            room={props.room}
            item={item}
          />
        ))}
    </Flex>
  )

const EvidenceItem = ({ item, room, role }) => (
  <Flex variant="column align-center" style={{ margin: 8, minWidth: 300 }}>
    <Typography variant="h5" align="center">
      {item.type}
    </Typography>

    <CardStack
      cards={item.values.filter((value, i) =>
        role === 1
          ? i === item.markedValueIndex || item.markedValueIndex === -1
          : i === item.markedValueIndex,
      )}
      getBackgroundColor={(n) =>
        item.markedValueIndex === -1 ? 'gray' : '#D33830'
      }
      onClick={(value) => room.send('MarkEvidence', { type: item.type, value })}
    />
  </Flex>
)
