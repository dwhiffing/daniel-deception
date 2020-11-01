import { Command } from "@colyseus/command"
import { Player, RoomState } from "../schema"

export class JoinCommand extends Command<RoomState, { playerId: string }> {
  validate({ playerId }) {
    return this.state.phaseIndex === -1
  }
  
  execute({ playerId }) {
    const player = new Player(playerId)
    this.state.players.push(player)
    if (!this.state.players.find(p => p.isAdmin)) {
      player.isAdmin = true
    }
  }
}