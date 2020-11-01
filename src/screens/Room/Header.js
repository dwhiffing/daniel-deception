import { Button } from '@material-ui/core'
import React from 'react'
import { Flex } from '../../components/Flex'
import { PHASES } from './index'

export const Header = ({ phaseIndex, phaseTimer, onLeave }) => (
  <Flex
    flex={0}
    variant="row align-center justify-between"
    style={{
      padding: 10,
      borderBottom: '1px solid gray',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
    }}
  >
    <Button onClick={onLeave}>Leave</Button>
    <span style={{ minWidth: 50 }}>{PHASES[phaseIndex + 1]}</span>
    <span style={{ minWidth: 50 }}>{phaseIndex === 2 ? phaseTimer : ''}</span>
  </Flex>
)
