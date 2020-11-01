import { Command } from "@colyseus/command"
import { Player, Table } from "../schema";

export class AssignScientistCommand extends Command<Table, {
    playerId: string
}> {

  execute({ playerId }) {
    this.state.players.forEach(p => p.role = p.id === playerId ? 1 : 0)
  }

}