import { type, Schema, ArraySchema } from '@colyseus/schema'
import { Delayed } from 'colyseus'
const RECONNECT_TIME = 120

export class Player extends Schema {
  leaveInterval: Delayed

  @type('string')
  id: string

  @type('string')
  name: string

  @type('number')
  role: number

  @type('boolean')
  connected: boolean

  @type('boolean')
  hasBadge: boolean

  @type('boolean')
  isAdmin: boolean

  @type('number')
  remainingConnectionTime: number

  @type(['string'])
  clues = new ArraySchema<string>()

  @type(['string'])
  means = new ArraySchema<string>()

  constructor(id: string) {
    super()
    this.id = id
    this.remainingConnectionTime = 0
    this.clues = new ArraySchema<string>()
    this.means = new ArraySchema<string>()
    this.role = 0
    this.hasBadge = false
    this.connected = true
    this.isAdmin = false
    this.name = ''
  }

  removeCards() {
    this.clues = this.clues.filter(() => false)
    this.means = this.means.filter(() => false)
    this.role = 0
  }

  giveCards(clues, means) {
    this.clues.push(...clues)
    this.means.push(...means)
    this.hasBadge = true
  }

  setName(name) {
    this.name = name
  }

  startReconnect = async (clock, reconnection, callback = () => {}) => {
    this.remainingConnectionTime = RECONNECT_TIME
    this.connected = false

    this.leaveInterval = clock.setInterval(() => {
      this.remainingConnectionTime -= 1
      if (this.remainingConnectionTime === 0) {
        this.leaveInterval && this.leaveInterval.clear()
        reconnection.reject()
        callback()
      }
    }, 1000)

    await reconnection
    this.leaveInterval && this.leaveInterval.clear()
    this.connected = true
  }
}
