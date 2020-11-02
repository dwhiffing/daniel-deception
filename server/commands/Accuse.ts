import { Command } from "@colyseus/command"
import { RoomState } from "../schema"
import { FinishGameCommand } from "./FinishGame"

export class AccuseCommand extends Command<RoomState, {
    playerId: string,
    clue: string,
    means: string,
}> {
  validate({ playerId, clue, means }) {
    const player = this.state.players.find(p => p.id === playerId)
    return typeof clue === 'string' && typeof means === 'string' && player.guess.length === 0
  }

  execute({ broadcast, playerId, clue, means }) {
    const player = this.state.players.find(p => p.id === playerId)

    const accusedPlayer =
    this.state.players.find(
      (p) => p.clues.includes(clue) || p.means.includes(means),
      )
      
      if (this.state.activeCrime[0] === clue && this.state.activeCrime[1] === means) {
        broadcast("message", `${player.name} was correct! The crime was committed by ${accusedPlayer.name} via ${means} and ${clue}!`)
        return [new FinishGameCommand()]
      } else if (this.state.activeCrime[0] === clue || this.state.activeCrime[1] === means) {
        broadcast("message", `${player.name} was close! The crime was committed by ${accusedPlayer.name} either via ${means} or ${clue}!`)
        player.guess.push(clue, means, 'true')
      } else {
        broadcast("message", `${player.name} was wrong! The crime was not committed by ${accusedPlayer.name}!`)
        player.guess.push(clue, means)
      }
      
      if (this.state.players.every(p => p.guess.length === 0)) {
      const murderer = this.state.players.find(p => p.role === 2)
      broadcast("message", `The murderer has eluded the investgators! ${murderer.name} committed the crime via ${means} and ${clue}`)
      return [new FinishGameCommand()]
    }
  }
}