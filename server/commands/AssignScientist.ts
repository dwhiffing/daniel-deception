import { Command } from "@colyseus/command"
import { RoomState } from "../schema"

export class AssignScientistCommand extends Command<RoomState, { playerId: string }> {
  execute({ playerId }) {
    this.state.players.forEach(p => p.role = p.id === playerId ? 1 : 0)
  }
}