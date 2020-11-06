import { useEffect, useState } from 'react'

// TODO: Allow murderer to guess who witness is if they are about to lose
// TODO: Send evidence marking over server with player color?
// TODO: Refine game content/copy and add images for clues/means

export function useRoomState({ room, setRoom }) {
  const [roomState, setServerState] = useState(initialRoomState)
  const [selectedMeans, setSelectedMeans] = useState()
  const [selectedClue, setSelectedClue] = useState()
  const [message, setMessage] = useState('')
  const { sceneDeck: scene, phaseIndex: phase, players } = roomState

  useEffect(() => {
    if (!room) return

    room.onStateChange((state) => {
      if (!state.players.toJSON().some((p) => p.id === room.sessionId)) {
        room.leave()
        localStorage.removeItem(room.id)
        setServerState(initialRoomState)
        setRoom()
      }
      setServerState({ ...state })
    })

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

  const sceneCardsThisRound = CARDS_PER_ROUND[2 - roomState.roundsLeft]
  const activeScene = scene
    .toJSON()
    .filter((s) => s.markedValueIndex > -1)
    .filter(({ markedValueIndex: m }) => currentPlayer.role === 1 || m > -1)

  const sceneDeck = scene
    .toJSON()
    .slice(
      0,
      sceneCardsThisRound +
        (phase === 1 && activeScene.length < sceneCardsThisRound ? 2 : -1),
    )

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
    sceneCardsThisRound,
    activeScene,
    sceneDeck: sceneDeck.sort((s) => (s.markedValueIndex === -1 ? 1 : -1)),
    role: currentPlayer.role,
    scene: currentPlayer.role === 1 && phase === 1 ? sceneDeck : activeScene,
    setSelectedMeans: (s) => setSelectedMeans((o) => (o === s ? null : s)),
    setSelectedClue: (s) => setSelectedClue((o) => (o === s ? null : s)),
    players: roomState.players.toJSON
      ? roomState.players.toJSON().sort((a, b) => (a.role === 1 ? -1 : 1))
      : [],
  }
}

const initialRoomState = {
  players: [],
  activeCrime: [],
  sceneDeck: { toJSON: () => [] },
  roundsLeft: -1,
  phaseIndex: -1,
  phaseTimer: -1,
}

const CARDS_PER_ROUND = [5, 6, 7]
