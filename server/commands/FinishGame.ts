import { Command } from '@colyseus/command'
import { SceneCard, RoomState } from '../schema'
import { ArraySchema } from '@colyseus/schema'

export class FinishGameCommand extends Command<
  RoomState,
  { crimeSolved: boolean }
> {
  execute({ crimeSolved }) {
    this.state.lastCrime = JSON.stringify({
      solved: crimeSolved,
      crime: this.state.activeCrime,
      roles: this.state.players.reduce((obj, player) => {
        obj[player.name] = player.role
        return obj
      }, {}),
    })
    this.state.phaseIndex = -1
    this.state.activeCrime = new ArraySchema<string>()
    this.state.players.forEach((p) => {
      p.clues = p.clues.filter(() => false)
      p.means = p.means.filter(() => false)
      p.guess = p.guess.filter(() => false)
      p.role = 0
    })
  }
}
