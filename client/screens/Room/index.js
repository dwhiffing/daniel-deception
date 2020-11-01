import React from 'react'
import { Typography } from '@material-ui/core'
import { Action } from '../../components/Action'
import { Flex } from '../../components/Flex'
import { EvidenceActions } from './components/EvidenceActions'
import { MurderActions } from './components/MurderActions'
import { PresentationActions } from './components/PresentationActions'
import { PreGameActions } from './components/PreGameActions'
import { EvidenceItem } from './components/EvidenceItem'
import { Seat } from './components/Seat'
import { useRoomState } from './useRoomState'
import { PHASES } from '../../constants'

export function Room({ room, setRoom }) {
  const state = useRoomState({ room, setRoom })

  return (
    <Flex variant="column" style={{ paddingTop: 70, paddingBottom: 200 }}>
      <Flex className="header" variant="row align-center justify-between">
        <Action onClick={room.leave}>Leave</Action>
        <Typography style={{ minWidth: 50 }}>
          {PHASES[state.phase + 1]}
        </Typography>
        <Typography style={{ minWidth: 50 }}>
          {state.phase === 2 ? state.phaseTimer : ''}
        </Typography>
      </Flex>

      {state.renderEvidence && (
        <Flex variant="column justify-between" style={{ flexWrap: 'wrap' }}>
          {state.scene.map((item, i) => (
            <EvidenceItem key={`s${i}`} room={room} item={item} />
          ))}
        </Flex>
      )}

      {state.renderSeats && (
        <Flex flex={2} variant="column">
          {state.players.map((player, i) => (
            <Seat key={`p${i}`} player={player} index={i} {...state} />
          ))}
        </Flex>
      )}

      <Flex flex={0} variant="center" className="actions" zIndex={100}>
        <Flex variant="column center">
          {state.message && <Typography>{state.message}</Typography>}

          {state.phase === -1 && <PreGameActions {...state} />}
          {state.phase === 0 && <MurderActions {...state} />}
          {state.phase === 1 && <EvidenceActions {...state} />}
          {state.phase === 2 && <PresentationActions {...state} />}
        </Flex>
      </Flex>
    </Flex>
  )
}
