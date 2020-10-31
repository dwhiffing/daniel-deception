import { Room, Delayed, Client } from 'colyseus'
import { Player, Table } from '../schema'

export class Deception extends Room<Table> {
  maxClients = 15
  leaveInterval: Delayed
  moveTimeout: Delayed

  onCreate(options) {
    this.setState(new Table())

    if (options && options.roomName) {
      this.setMetadata({ roomName: options.roomName })
    }
  }

  onJoin(client: Client) {
    if (this.getPlayer(client.sessionId)) return

    const player = new Player(client.sessionId, { clock: this.clock })
    if (!this.state.players.find(p => p.isAdmin)) {
      player.isAdmin = true
    }
    this.state.players.push(player)
  }

  onMessage(client: Client, data: any) {
    const player = this.getPlayer(client.sessionId)
    if (!player) return null
    
    const eligiblePlayers = this.getSeatedPlayers()
    const canDeal = eligiblePlayers.length >= 4 && this.state.players.find(p => p.role === 1)
    console.log(data, player.role)

    if (data.action === 'deal' && canDeal) {
      this.state.deal()
    } else if (data.action === 'setScientist') {
      if (typeof data.playerId === 'string') {
        this.state.players.forEach( p => p.role = 0)
        const player = this.getPlayer(data.playerId)
        player.role = 1
      }
    } else if (data.action === 'markScene' && player.role === 1 && this.state.phaseIndex === 1) {
      if (typeof data.type === 'string' && typeof data.value === 'string') {
        this.state.mark(data.type, data.value)
      }
    } else if (data.action === 'murder' && player.role === 2) {
      if (typeof data.clue === 'string' && typeof data.means === 'string') {
        this.state.murder(data.clue, data.means)
      }
    } else if (data.action === 'accuse' && player.role === 2) {
      if (typeof data.clue === 'string' && typeof data.means === 'string') {
        this.state.accuse(player, data.clue, data.means)
      }
    } else if (data.action === 'sit') {
      if (typeof data.seatIndex === 'number') {
        player.sit(data.seatIndex)
      }
      this.sitInAvailableSeat(player)
    } else if (data.action === 'setName') {
      player.setName(data.name)
    }
  }

  onLeave = async (client, consented) => {
    const player = this.getPlayer(client.sessionId)
    if (!player) {
      return
    }

    this.unlock()

    if (consented) {
      this.removePlayer(player)
      return
    }

    player.startReconnect(this.clock, this.allowReconnection(client), () => {
      this.removePlayer(player)
    })
  }

  removePlayer(player) {
    this.state.players = this.state.players.filter(p => p.id !== player.id)
  }

  sitInAvailableSeat = player => {
    const takenSeats = this.getSeatedPlayers().map(p => p.seatIndex)
    const availableSeats = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
      n => !takenSeats.includes(n),
    )
    const availableSeat = availableSeats[0]
    if (typeof availableSeat === 'number') {
      player.sit(availableSeat)
    }
  }

  getPlayers = () =>
    [...this.state.players.values()].sort((a, b) => a.seatIndex - b.seatIndex)

  getPlayer = sessionId => this.getPlayers().find(p => p.id === sessionId)

  getActivePlayers = () => this.getSeatedPlayers()

  getSeatedPlayers = ({ getDealerIndex = false } = {}) => {
    const sortedPlayers = this.getPlayers().filter(p => p.seatIndex > -1)
    return sortedPlayers
  }
}
