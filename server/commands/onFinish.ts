import { Command } from "@colyseus/command"
import { Card, Player, Table } from "../schema";
import { ArraySchema } from '@colyseus/schema'

export class FinishGameCommand extends Command<Table, {
    message: string
}> {

  execute({ message }) {
    this.state.phaseIndex = -1
    this.state.message = message
    this.state.players.forEach(p => p.removeCards())
    this.state.activeScene = new ArraySchema<Card>()
    this.state.activeCrime = new ArraySchema<string>()
  }

}