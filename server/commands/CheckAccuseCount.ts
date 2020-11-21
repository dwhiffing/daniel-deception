import { Command } from '@colyseus/command'
import { RoomState } from '../schema'
import { FinishGameCommand } from './FinishGame'

export class CheckAccuseCountCommand extends Command<RoomState> {
  execute() {
    const noAccusalsRemaining = this.state.players.every(
      (p) => p.guess.length > 0 || [1, 2, 3].includes(p.role),
    )
    if (noAccusalsRemaining) {
      const [clue, means] = this.state.activeCrime
      const murderer = this.state.players.find((p) => p.role === 2)
      this.room.broadcast(
        'message',
        `The murderer has eluded the investgators! ${murderer.name} committed the crime via ${means} and ${clue}`,
      )
      return [new FinishGameCommand()]
    }
  }
}
