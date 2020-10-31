import React from 'react'
import { Flex } from '.'
import { Actions } from './Actions'
import { Seat } from './Seat'

export function Room({ players, scene, room }) {
  const _players = players
    .map((p, index) => ({
      ...p,
      index,
      isClient: p.id === room.sessionId,
    }))
    .filter((p) => p.role !== 1)

  return (
    <Flex variant="column" style={{ paddingTop: 50, paddingBottom: 80 }}>
      <Flex
        flex={0}
        variant="row justify-between"
        style={{
          padding: 10,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
        }}
      >
        <span>Deception</span>
        <span>1:23</span>
        <span>?</span>
      </Flex>

      <Flex variant="column">
        <Flex variant="row justify-between">
          {scene.map((item, n) => (
            <Flex variant="column" key={`scene-${n}`}>
              <p>{item.type}</p>
              {item.values.map((value, n) => (
                <span key={`scene-${n}`}>{value}</span>
              ))}
            </Flex>
          ))}
        </Flex>

        <Flex flex={2} variant="column">
          {_players.map((player, n) => (
            <Seat key={`seat-${player.index}`} player={player} />
          ))}
        </Flex>
      </Flex>

      <Actions room={room} players={players} />
    </Flex>
  )
}
