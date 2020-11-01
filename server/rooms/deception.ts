import { Room, Client, ServerError } from 'colyseus'
import { Table } from '../schema'
import { Dispatcher } from "@colyseus/command"
import { OnJoinCommand } from '../commands/onJoin'
import { OnLeaveCommand } from '../commands/onLeave'
import { DealCommand } from '../commands/onDeal'
import { MurderCommand } from '../commands/onMurder'
import { AccuseCommand } from '../commands/onAccuse'
import { FinishGameCommand } from '../commands/onFinish'
import { MarkEvidenceCommand } from '../commands/onEvidence'
import { AssignScientistCommand } from '../commands/AssignScientist'

export class Deception extends Room<Table> {
  maxClients = 15
  dispatcher = new Dispatcher(this);

  onCreate(options) {
    this.setState(new Table())

    this.onMessage('*', (client, action, data) => {
      const playerId = client.sessionId
      const player = this.state.players.find(p => p.id === playerId)
      const { clue, means, type, value } = data

      if (action === 'deal') {
        this.dispatcher.dispatch(new DealCommand(), { playerId })
      } else if (action === 'setScientist') {
        this.dispatcher.dispatch(new AssignScientistCommand(), { playerId: data.playerId })
      } else if (action === 'markScene') {
        this.dispatcher.dispatch(new MarkEvidenceCommand(), { playerId, type, value })
      } else if (action === 'murder') {
        this.dispatcher.dispatch(new MurderCommand(), { playerId, clue, means })
      } else if (action === 'accuse') {
        this.dispatcher.dispatch(new AccuseCommand(), { playerId, clue, means })
      } else if (action === 'setName') {
        player && player.setName(data.name)
      }
    })

    this.clock.setInterval(() => {
      if (this.state.phaseIndex !== 2) return

      if (this.state.phaseTimer > 1) {
        this.state.phaseTimer -= 1
      } else {
        if (this.state.roundsLeft > 0) {
          this.state.roundsLeft -= 1
          this.state.phaseIndex = 1
        } else {
          this.dispatcher.dispatch(new FinishGameCommand(), { message: 'The murderers won!' })
        }
      }
    }, 1000)

    if (options && options.roomName) {
      this.setMetadata({ roomName: options.roomName })
    }
  }

  onAuth(client: Client) {
    if (this.state.phaseIndex !== -1)
      throw new ServerError(400, "Game in Progress");
    
    if (this.state.players.length >= 10)
      throw new ServerError(400, "Too many players");

    return true
  }

  onJoin(client: Client) {
    const playerId = client.sessionId
    this.dispatcher.dispatch(new OnJoinCommand(), { playerId })
  }

  onLeave = async (client, consented) => {
    const playerId = client.sessionId
    const player = this.state.players.find(p => p.id === playerId)
    if (!player) return

    if (consented) {
      this.dispatcher.dispatch(new OnLeaveCommand(), { playerId })
    } else {
      player.startReconnect(this.clock, this.allowReconnection(client), () => 
        this.dispatcher.dispatch(new OnLeaveCommand(), { playerId })
      )
    }
  }
}

