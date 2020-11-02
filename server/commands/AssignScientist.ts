import { Command } from "@colyseus/command"
import { RoomState } from "../schema"

export class AssignScientistCommand extends Command<RoomState, { playerId: string }> {
  execute({ broadcast, playerId }) {
    this.state.players.forEach(p => p.role = 0)
    const player = this.state.players.find(p => p.id === playerId)
    broadcast('message', player.name + ' was made Forensic Scientist')
    player.role = 1
  }
}