import { Command } from '@colyseus/command'
import { RoomState } from '../schema'
import { CheckAccuseCountCommand } from './CheckAccuseCount'
import { FinishGameCommand } from './FinishGame'

export class AccuseCommand extends Command<
  RoomState,
  {
    playerId: string
    clue: string
    means: string
  }
> {
  validate({ playerId, clue, means }) {
    const player = this.state.players.find((p) => p.id === playerId)
    return (
      typeof clue === 'string' &&
      typeof means === 'string' &&
      player.guess.length === 0
    )
  }

  execute({ playerId, clue, means }) {
    const [activeClue, activeMeans] = this.state.activeCrime
    const player = this.state.players.find((p) => p.id === playerId)
    const witness = this.state.players.find((p) => p.role === 4)
    const accused = this.state.players.find(
      (p) => p.clues.includes(clue) || p.means.includes(means),
    ).name
    const message = (m) => this.room.broadcast('message', m)

    if (activeClue === clue && activeMeans === means) {
      message(
        `${player.name} was correct! The crime was committed by ${accused} via ${means} and ${clue}!`,
      )
      if (witness) {
        this.state.phaseIndex = 3
        return []
      } else {
        return [new FinishGameCommand()]
      }
    } else if (activeClue === clue || activeMeans === means) {
      message(
        `${player.name} was close! The crime was committed by ${accused} either via ${means} or ${clue}!`,
      )
      player.guess.push(clue, means, 'true')
    } else {
      message(
        `${player.name} was wrong! The crime was not committed by ${accused}!`,
      )
      player.guess.push(clue, means)
    }

    return [new CheckAccuseCountCommand()]
  }
}
