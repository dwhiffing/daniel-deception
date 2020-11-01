import { Command } from "@colyseus/command"
import { Player, Table } from "../schema";
import { FinishGameCommand } from "./onFinish";

export class AccuseCommand extends Command<Table, {
    playerId: string,
    clue: string,
    means: string,
}> {

  validate({ playerId, clue, means }) {
    const player = this.state.players.find(p => p.id === playerId)
    return typeof clue === 'string' && typeof means === 'string' && player.hasBadge
  }

  execute({ playerId, clue, means }) {
    const player = this.state.players.find(p => p.id === playerId)
    
    if (this.state.activeCrime[0] === clue && this.state.activeCrime[1] === means) {
      return [new FinishGameCommand().setPayload({ message: `${player.name} was correct! The crime was commited via ${clue} and ${means}!` })]
    } else {
      this.state.message = `${player.name} was wrong! The crime was not commited via ${clue} and ${means}!`
      player.hasBadge = false
    }
    
    if (this.state.players.every(p => !p.hasBadge)) {
      return [new FinishGameCommand().setPayload({ message: 'The murderer has eluded the investgators! They may come forward if they choose' })]
    }
  }
}