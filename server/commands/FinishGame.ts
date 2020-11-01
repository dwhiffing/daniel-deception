import { Command } from "@colyseus/command"
import { SceneCard, RoomState } from "../schema"
import { ArraySchema } from '@colyseus/schema'

export class FinishGameCommand extends Command<RoomState, { message: string }> {
  execute({ message }) {
    this.state.phaseIndex = -1
    this.state.message = message
    this.state.activeScene = new ArraySchema<SceneCard>()
    this.state.activeCrime = new ArraySchema<string>()
    this.state.players.forEach(p => {
      p.clues = p.clues.filter(() => false)
      p.means = p.means.filter(() => false)
      p.hasBadge = false
      p.role = 0
    })
  }
}