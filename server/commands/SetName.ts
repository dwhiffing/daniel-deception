import { Command } from "@colyseus/command"
import { RoomState } from "../schema"

export class SetNameCommand extends Command<RoomState, { playerId: string, name: string }> {
  execute({ playerId, name }) {
    const player = this.state.players.find(p => p.id === playerId)
    player.name = name
  }
}