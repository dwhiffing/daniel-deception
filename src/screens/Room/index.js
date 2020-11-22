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
  console.log(state)

  return (
    <Flex variant="column" style={{ paddingTop: 70, paddingBottom: 200 }}>
      <Header {...state} />
      <Evidence {...state} />
      <Seats {...state} />
      <LastGame {...state} />
      <Actions {...state} />

      <Snackbar
        open={!!state.message}
        autoHideDuration={8000}
        style={{ bottom: 100 }}
      >
        <Alert elevation={6} variant="filled" severity="info">
          {state.message}
        </Alert>
      </Snackbar>
    </Flex>
  )
}

const ROLES = ['Detective', 'Scientist', 'Murderer', 'Accomplice', 'Witness']
const LastGame = ({ lastCrime }) => {
  if (!lastCrime) return null
  const rolesArr = Object.entries(lastCrime.roles)
  const bad = rolesArr.filter(([name, role]) => role === 2 || role === 3)
  const good = rolesArr.filter(
    ([name, role]) => role === 0 || role === 1 || role === 4,
  )
  const mapper = ([name, role]) => (
    <p>
      {ROLES[role]}: {name}
    </p>
  )
  return (
    <div style={{ margin: 16 }}>
      <h2>Last Crime</h2>
      <h3>
        {lastCrime.solved
          ? 'Crime was solved and murderers were arrested!'
          : 'Murderers eluded the investigation!'}
      </h3>
      <p>
        <span style={{ color: 'red' }}>Means: {lastCrime.crime[1]}</span>{' '}
        <span style={{ color: 'blue' }}>Clue: {lastCrime.crime[0]}</span>
      </p>
      <div style={{ margin: '32px 0' }}>
        <h4>Bad Cops</h4>
        {bad.map(mapper)}
      </div>
      <h4>Good Cops</h4>
      {good.map(mapper)}
    </div>
  )
}
