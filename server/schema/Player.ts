import { type, Schema, ArraySchema } from '@colyseus/schema'
import { Delayed } from 'colyseus'
import numeral from 'numeral'
const RECONNECT_TIME = 30

export const formatNumber = n =>
  numeral(n)
    .format('(0[.]00a)')
    .toUpperCase()

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
  seatIndex: number

  @type('number')
  remainingConnectionTime: number

  @type('number')
  remainingMoveTime: number

  @type(['string'])
  clues = new ArraySchema<string>()

  @type(['string'])
  means = new ArraySchema<string>()

  constructor(id: string, opts) {
    super()
    this.id = id
    this.remainingConnectionTime = 0
    this.remainingMoveTime = 0
    this.seatIndex = -1
    this.clues = new ArraySchema<string>()
    this.means = new ArraySchema<string>()
    this.role = 0
    this.hasBadge = false

    this.connected = true
    this.isAdmin = opts.isAdmin || false
    this.name = opts.name || ''
  }

  removeCards() {
    this.clues = this.clues.filter(() => false)
    this.means = this.means.filter(() => false)
  }

  giveCards(clues, means) {
    this.clues.push(...clues)
    this.means.push(...means)
    this.hasBadge = true
  }

  sit(seatIndex) {
    if (this.seatIndex > -1) return

    this.seatIndex = seatIndex
  }

  stand() {
    if (this.seatIndex === -1) return

    this.removeCards()
    this.seatIndex = -1
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
