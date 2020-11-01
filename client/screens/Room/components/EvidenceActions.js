import React from 'react'

export const EvidenceActions = ({ currentPlayer, activeCrime }) =>
  currentPlayer.role === 1 ? (
    <p>
      Mark the crime scene based on the means {activeCrime[1]} and the clue{' '}
      {activeCrime[0]}
    </p>
  ) : (
    <p>The Forensic Scientist is investigating</p>
  )
