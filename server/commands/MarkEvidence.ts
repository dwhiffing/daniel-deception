import { Command } from "@colyseus/command"
import { RoomState } from "../schema"

export class MarkEvidenceCommand extends Command<RoomState, {
    playerId: string,
    type: string,
    value: string
}> {
  validate({ playerId, type, value }) {
    const player = this.state.players.find(p => p.id === playerId)
    const card = this.state.activeScene.find(c => c.type === type)
    return player.role === 1 && this.state.phaseIndex === 1 && typeof type === 'string' && typeof value === 'string' && card.markedValueIndex === -1
  }

  execute({ playerId, type, value }) {
    const card = this.state.activeScene.find(c => c.type === type)
    card.markedValueIndex = card.values.findIndex(c => c === value)
    const markedCardsLength = this.state.activeScene.filter(c => c.markedValueIndex > -1).length
    if (markedCardsLength === this.state.activeScene.length - this.state.roundsLeft) {
      this.state.phaseIndex = 2
      this.state.phaseTimer = this.state.phaseTimerMultiple * (this.state.players.length - 1)
    }
  }
}