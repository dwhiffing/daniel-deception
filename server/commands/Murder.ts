import { Command } from "@colyseus/command"
import { RoomState } from "../schema";

export class MurderCommand extends Command<RoomState, {
    playerId: string,
    clue: string,
    means: string,
}> {
  validate({ playerId, clue, means }) {
    const player = this.state.players.find(p => p.id === playerId)
    return typeof clue === 'string' && typeof means === 'string' && this.state.phaseIndex === 0 && player.role === 2
  }

  execute({ playerId, clue, means }) {
    this.state.activeCrime.push(clue)
    this.state.activeCrime.push(means)
    this.state.phaseIndex = 1
  }
}