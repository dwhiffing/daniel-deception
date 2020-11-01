import { Command } from "@colyseus/command"
import { Player, RoomState } from "../schema"

export class JoinCommand extends Command<RoomState, { playerId: string }> {
  validate({ playerId, name }) {
    return this.state.phaseIndex === -1
  }
  
  execute({ playerId, name }) {
    const player = new Player(playerId)
    player.name = name
    this.state.players.push(player)
    if (!this.state.players.find(p => p.isAdmin)) {
      player.isAdmin = true
    }
  }
}