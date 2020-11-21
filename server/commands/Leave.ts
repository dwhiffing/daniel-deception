import { Command } from '@colyseus/command'
import { RoomState } from '../schema'
import { CheckAccuseCountCommand } from './CheckAccuseCount'
import { FinishGameCommand } from './FinishGame'

export class LeaveCommand extends Command<RoomState, { playerId: string }> {
  execute({ playerId }) {
    this.state.players = this.state.players.filter((p) => p.id !== playerId)
    if (!this.state.players.find((p) => p.isAdmin)) {
      const firstPlayer = this.state.players[0]
      if (firstPlayer) firstPlayer.isAdmin = true
    }

    const roles = this.state.players.map((p) => p.role)

    if (!roles.includes(1)) {
      this.room.broadcast('message', 'Stalemate (The Investigator left)')
      return [new FinishGameCommand()]
    }

    if (!roles.includes(2)) {
      this.room.broadcast('message', 'Stalemate (The Murderer left)')
      return [new FinishGameCommand()]
    }

    return [new CheckAccuseCountCommand()]
  }
}
