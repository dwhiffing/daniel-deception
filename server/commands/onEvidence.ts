import { Command } from "@colyseus/command"
import { Player, Table } from "../schema";
import { CheckEvidenceCommand } from "./checkEvidence";

export class MarkEvidenceCommand extends Command<Table, {
    playerId: string,
    type: string,
    value: string
}> {

  validate({ playerId, type, value }) {
    const player = this.state.players.find(p => p.id === playerId)
    const card = this.state.activeScene.find(c => c.type === type)
    return player.role === 1 && this.state.phaseIndex === 1 && typeof type === 'string' && typeof value === 'string' && card.markedValueIndex === -1
  }

  execute({ playerId, type, value }) {
    const card = this.state.activeScene.find(c => c.type === type)
    card.markedValueIndex = card.values.findIndex(c => c === value)
    return [new CheckEvidenceCommand()]
  }

}