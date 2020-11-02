import React from 'react'
import { Flex } from '../../components/Flex'
import { useRoomState } from './useRoomState'
import { Header } from './components/Header'
import { Evidence } from './components/Evidence'
import { Seats } from './components/Seats'
import { Actions } from './components/Actions'
import { Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

export function Room({ room, setRoom }) {
  const state = useRoomState({ room, setRoom })

  return (
    <Flex variant="column" style={{ paddingTop: 70, paddingBottom: 200 }}>
      <Header {...state} />
      <Evidence {...state} />
      <Seats {...state} />
      <Actions {...state} />

      <Snackbar
        open={!!state.message}
        autoHideDuration={6000}
        style={{ bottom: 100 }}
      >
        <Alert elevation={6} variant="filled" severity="info">
          {state.message}
        </Alert>
      </Snackbar>
    </Flex>
  )
}
