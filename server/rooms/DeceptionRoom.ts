import { Room, Client, ServerError } from 'colyseus'
import { RoomState } from '../schema'
import { Dispatcher } from "@colyseus/command"
import * as Commands from '../commands'

// TODO: show if guess had at least one component correct

export class DeceptionRoom extends Room<RoomState> {
  maxClients = 10
  dispatcher = new Dispatcher(this)

  onCreate({ roomName = 'DeceptionRoom' } = {}) {
    this.setState(new RoomState())
    this.setMetadata({ roomName })

    this.onMessage('*', (client, action, _data = {}) => {
      const data = { ..._data, playerId: _data.playerId || client.sessionId }
      const Command = Commands[action + 'Command']
      Command && this.dispatcher.dispatch(new Command(), data)
    })
    
    this.clock.setInterval(() => 
      this.dispatcher.dispatch(new Commands.TickCommand()),
      1000,
    )
  }

  onAuth() {
    if (this.state.phaseIndex !== -1)
      throw new ServerError(400, "Game in Progress");
    
    if (this.state.players.length >= 10)
      throw new ServerError(400, "Too many players");

    return true
  }

  onJoin(client: Client, options) {
    const playerId = client.sessionId
    this.dispatcher.dispatch(new Commands.JoinCommand(), { playerId, ...options })
  }

  onLeave = async (client, consented) => {
    const playerId = client.sessionId
    if (consented) {
      this.dispatcher.dispatch(new Commands.LeaveCommand(), { playerId })
    } else {
      const reconnection = this.allowReconnection(client)
      this.dispatcher.dispatch(new Commands.DisconnectCommand(), { playerId, reconnection })
    }
  }
}
