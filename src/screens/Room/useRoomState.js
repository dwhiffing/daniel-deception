import { useEffect, useState } from 'react'

// TODO: Send evidence marking over server with player color?
// TODO: Allow configuration of reconnect time, phaseTimer, number of cards dealt

export function useRoomState({ room, setRoom }) {
  const [roomState, setServerState] = useState(initialRoomState)
  const [selectedMeans, setSelectedMeans] = useState()
  const [selectedClue, setSelectedClue] = useState()
  const [message, setMessage] = useState('')
  const { activeScene: scene, phaseIndex: phase, players } = roomState

  useEffect(() => {
    if (!room) return

    room.onStateChange((state) => setServerState({ ...state }))

    room.onMessage('message', (opts) => {
      setMessage(opts)
      setTimeout(() => setMessage(''), 5000)
    })

    room.onLeave(() => {
      localStorage.removeItem(room.id)
      setServerState(initialRoomState)
      setRoom()
    })
  }, [room, setRoom])

  useEffect(() => {
    setSelectedMeans()
    setSelectedClue()
  }, [phase])

  const currentPlayer = players.find((p) => p.id === room.sessionId) || {}
  const renderEvidence = phase === 1 || phase === 2
  const renderSeats =
    phase === -1 ||
    (phase === 0 && currentPlayer.role === 2) ||
    (phase === 1 && currentPlayer.role !== 1) ||
    phase === 2

  return {
    activeCrime: roomState.activeCrime.toJSON
      ? roomState.activeCrime.toJSON()
      : [],
    message,
    room,
    phase,
    phaseTimer: roomState.phaseTimer,
    currentPlayer,
    selectedClue,
    selectedMeans,
    renderSeats,
    renderEvidence,
    role: currentPlayer.role,
    setSelectedMeans: (s) => setSelectedMeans((o) => (o === s ? null : s)),
    setSelectedClue: (s) => setSelectedClue((o) => (o === s ? null : s)),
    players: roomState.players.toJSON
      ? roomState.players.toJSON().sort((a, b) => (a.role === 1 ? -1 : 1))
      : [],
    scene: scene
      .slice(0, scene.length - roomState.roundsLeft)
      .filter(({ markedValueIndex: m }) => currentPlayer.role === 1 || m > -1),
  }
}

const initialRoomState = {
  players: [],
  activeCrime: [],
  activeScene: [],
  roundsLeft: -1,
  phaseIndex: -1,
  phaseTimer: -1,
}
