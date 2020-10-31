import React, { useEffect, useState } from 'react'
import Table from './Table'

const getIsPortrait = () =>
  document.documentElement.clientWidth < document.documentElement.clientHeight

export function Room({ players, room }) {
  const [portrait, setPortrait] = useState(getIsPortrait())
  const currentPlayer = players.find((p) => p.id === room.sessionId) || {}
  const seatedPlayers = players
    .filter((p) => p.seatIndex !== -1)
    .map((p) => ({ ...p, isClient: p.id === room.sessionId }))
    .sort((a, b) => a.seatIndex - b.seatIndex)

  const onSit =
    currentPlayer.seatIndex === -1
      ? (seatIndex) => room.send({ action: 'sit', seatIndex })
      : null

  useEffect(() => {
    const callback = () => setPortrait(getIsPortrait())
    window.addEventListener('resize', callback)
    return () => window.removeEventListener('resize', callback)
  }, [])

  return (
    <Table
      layout={
        document.documentElement.clientHeight <= 320
          ? currentPlayer.seatIndex >= 4
            ? SMALL_2
            : SMALL
          : portrait
          ? PORTRAIT
          : LANDSCAPE
      }
      onSit={onSit}
      room={room}
      currentPlayer={currentPlayer}
      players={seatedPlayers}
    />
  )
}

const PORTRAIT = [
  [0, 1],
  [9, 8, 7],
  [2, 3, 4],
  [6, 5],
]

const LANDSCAPE = [
  [0, 1, 2],
  [9, 8],
  [3, 4],
  [7, 6, 5],
]
const SMALL = [[0, 1, 2, 3, 4], [], [], [9, 8, 7, 6, 5]]
const SMALL_2 = [[9, 8, 7, 6, 5], [], [], [0, 1, 2, 3, 4]]
