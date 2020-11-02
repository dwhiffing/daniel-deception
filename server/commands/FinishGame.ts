import { Command } from "@colyseus/command"
import { SceneCard, RoomState } from "../schema"
import { ArraySchema } from '@colyseus/schema'

export class FinishGameCommand extends Command<RoomState> {
  execute() {
    this.state.phaseIndex = -1
    this.state.activeScene = new ArraySchema<SceneCard>()
    this.state.activeCrime = new ArraySchema<string>()
    this.state.players.forEach(p => {
      p.clues = p.clues.filter(() => false)
      p.means = p.means.filter(() => false)
      p.guess = p.guess.filter(() => false)
      p.role = 0
    })
  }
}