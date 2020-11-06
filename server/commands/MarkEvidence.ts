import { Command } from "@colyseus/command"
import { RoomState } from "../schema"

export class MarkEvidenceCommand extends Command<RoomState, {
    playerId: string,
    type: string,
    value: string
}> {
  validate({ playerId, type, value }) {
    const player = this.state.players.find(p => p.id === playerId)
    const card = this.state.sceneDeck.find(c => c.type === type)
    return player.role === 1 && this.state.phaseIndex === 1 && typeof type === 'string' && typeof value === 'string' && card.markedValueIndex === -1
  }

  execute({ playerId, type, value }) {
    const card = this.state.sceneDeck.find(c => c.type === type)
    card.markedValueIndex = card.values.findIndex(c => c === value)
    const markedCardsLength = this.state.sceneDeck.filter(c => c.markedValueIndex > -1).length
    const cardsThisRound = CARDS_PER_ROUND[2 - this.state.roundsLeft]
    if (markedCardsLength === cardsThisRound) {
      this.state.phaseIndex = 2
      this.state.phaseTimer = this.state.phaseTimerMultiple * (this.state.players.length - 1)
      // TODO: disard the unpicked cards
      // this.state.sceneDeck = this.state.sceneDeck.filter((c, i) => c.markedValueIndex > -1 || i > cardsThisRound)
    }
  }
}

const CARDS_PER_ROUND = [5, 6, 7]