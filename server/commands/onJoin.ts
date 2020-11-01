import { Command } from "@colyseus/command"
import { Player, Table } from "../schema";

export class OnJoinCommand extends Command<Table, {
    playerId: string
}> {

  validate({ playerId }) {
    return this.state.phaseIndex === -1
  }
  
  execute({ playerId }) {
    const player = new Player(playerId)
    // this.state.players[playerId] = player
    this.state.players.push(player)
    if (!this.state.players.find(p => p.isAdmin)) {
      player.isAdmin = true
    }
  }

}