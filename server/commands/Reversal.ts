import { Command } from '@colyseus/command'
import { RoomState } from '../schema'
import { FinishGameCommand } from './FinishGame'

export class ReversalCommand extends Command<
  RoomState,
  {
    playerId: string
    selectedPlayerId: string
  }
> {
  validate({ playerId, selectedPlayerId }) {
    const player = this.state.players.find((p) => p.id === playerId)
    const guessedPlayer = this.state.players.find(
      (p) => p.id === selectedPlayerId,
    )
    return player.role === 2 && this.state.phaseIndex === 3 && !!guessedPlayer
  }

  execute({ playerId, selectedPlayerId }) {
    const guessedPlayer = this.state.players.find(
      (p) => p.id === selectedPlayerId,
    )
    if (guessedPlayer.role === 4) {
      this.room.broadcast(
        'message',
        'The murderers killed the witness and got away with the crime.',
      )
    } else {
      this.room.broadcast(
        'message',
        'The murderers killed an innocent bystander and went to prison.',
      )
    }
    return [
      new FinishGameCommand().setPayload({
        crimeSolved: guessedPlayer.role !== 4,
      }),
    ]
  }
}

const CARDS_PER_ROUND = [5, 6, 7]
