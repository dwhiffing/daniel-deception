import { Command } from "@colyseus/command"
import { RoomState } from "../schema"
import { FinishGameCommand } from "./FinishGame"
import { LeaveCommand } from "./Leave"

export class TickCommand extends Command<RoomState> {
  execute({ broadcast }) {
    let commands = []

    // tick disconnected player reconnect timers
    commands = this.state.players
    .filter(player => !player.connected)
    .map(player => {
      player.remainingConnectionTime -= 1
      
      if (player.remainingConnectionTime === 0) {
        player.reconnection.reject()
        return new LeaveCommand().setPayload({ playerId: player.id })
      }
    })
    
    if (this.state.phaseIndex !== 2) {
      return commands
    }

    // tick investigation phase timer
    if (this.state.phaseTimer > 0) {
      this.state.phaseTimer -= 1
      return commands
    }

    // start evidence phase if timer up, but there are rounds left
    if (this.state.roundsLeft > 0) {
      this.state.roundsLeft -= 1
      this.state.phaseIndex = 1
      return commands
    }
    
    // otherwise the murderers win
    broadcast('message', 'The murderers won!')
    return [new FinishGameCommand()]
  }
}