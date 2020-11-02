import React from 'react'
import { Typography } from '@material-ui/core'
import { Action } from '../../../components/Action'
import { Flex } from '../../../components/Flex'
import { PHASES } from '../../../constants'

export const Header = (props) => (
  <Flex className="header" variant="row align-center justify-between">
    <Action onClick={props.room.leave.bind(props.room)}>Leave</Action>

    <Typography style={{ minWidth: 50 }}>{PHASES[props.phase + 1]}</Typography>

    <Typography style={{ minWidth: 50 }}>
      {props.phase === 2 ? props.phaseTimer : ''}
    </Typography>
  </Flex>
)
