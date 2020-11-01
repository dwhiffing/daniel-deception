import React from 'react'
import { Flex } from '../../components/Flex'
import { useRoomState } from './useRoomState'
import { Header } from './components/Header'
import { Evidence } from './components/Evidence'
import { Seats } from './components/Seats'
import { Actions } from './components/Actions'

export function Room({ room, setRoom }) {
  const state = useRoomState({ room, setRoom })

  return (
    <Flex variant="column" style={{ paddingTop: 70, paddingBottom: 200 }}>
      <Header {...state} />
      <Evidence {...state} />
      <Seats {...state} />
      <Actions {...state} />
    </Flex>
  )
}
