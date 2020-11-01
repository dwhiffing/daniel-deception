import { Command } from "@colyseus/command"
import { Player, Table } from "../schema";

export class CheckEvidenceCommand extends Command<Table> {

  validate() {
    const markedCardsLength = this.state.activeScene.filter(c => c.markedValueIndex > -1).length

    return markedCardsLength === this.state.activeScene.length - this.state.roundsLeft
  }

  execute() {
    this.state.phaseIndex = 2
    this.state.phaseTimer = 30 * this.state.players.length
  }

}