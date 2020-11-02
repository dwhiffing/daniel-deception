import { Command } from "@colyseus/command"
import { RoomState } from "../schema"
import { FinishGameCommand } from "./FinishGame"

export class AccuseCommand extends Command<RoomState, {
    playerId: string,
    clue: string,
    means: string,
}> {
  validate({ playerId, clue, means }) {
    const player = this.state.players.find(p => p.id === playerId)
    return typeof clue === 'string' && typeof means === 'string' && player.hasBadge
  }

  execute({ broadcast, playerId, clue, means }) {
    const player = this.state.players.find(p => p.id === playerId)
    
    if (this.state.activeCrime[0] === clue && this.state.activeCrime[1] === means) {
      broadcast("message", `${player.name} was correct! The crime was commited via ${clue} and ${means}!`)
      return [new FinishGameCommand()]
    } else {
      broadcast("message", `${player.name} was wrong! The crime was not commited via ${clue} and ${means}!`)
      player.hasBadge = false
    }
    
    if (this.state.players.every(p => !p.hasBadge)) {
      broadcast("message", 'The murderer has eluded the investgators! They may come forward if they choose')
      return [new FinishGameCommand()]
    }
  }
}