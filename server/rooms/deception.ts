import { Room, Delayed, Client } from 'colyseus'
import { Player, Table } from '../schema'
import faker from 'faker'
import random from 'lodash/random'

const BOT_TIMEOUT = 1000

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
    if (data.action === 'sit') {
      if (typeof data.seatIndex === 'number') {
        player.sit(data.seatIndex)
      }
      this.sitInAvailableSeat(player)
    } else if (data.action === 'setName') {
      player.setName(data.name)
    } else if (data.action === 'addBot') {
      this.addBot()
    } else if (data.action === 'removeBot') {
      this.removeBot()
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

  addBot() {
    if (this.state.players.length >= 10) {
      return
    }

    const bot = new Player(faker.random.uuid().slice(0, 8), {
      isBot: true,
      name: faker.name.firstName(),
      clock: this.clock,
    })
    this.state.players.push(bot)
    this.sitInAvailableSeat(bot)
  }

  removeBot() {
    const nextBotToRemove = this.getSeatedPlayers()
      .sort((a, b) => b.seatIndex - a.seatIndex)
      .find(p => p.isBot)
    if (nextBotToRemove) {
      this.removePlayer(nextBotToRemove)
    }
  }

  doPlayerMove(bot, action = {}, timeout = BOT_TIMEOUT) {
    this.clock.setTimeout(() => {
      this.onMessage({ sessionId: bot.id } as Client, {
        ...action,
      })
    }, random(timeout / 2, timeout * 2))
  }

  sitInAvailableSeat = player => {
    const takenSeats = this.getSeatedPlayers().map(p => p.seatIndex)
    const availableSeats = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
      n => !takenSeats.includes(n),
    )
    const availableSeat = availableSeats[0] // sample(availableSeats)
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
