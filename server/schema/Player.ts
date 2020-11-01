import { type, Schema, ArraySchema } from '@colyseus/schema'

export class Player extends Schema {
  reconnection: any

  @type('string')
  id = ''

  @type('string')
  name = ''

  @type('number')
  role = 0

  @type('boolean')
  connected = true

  @type('boolean')
  hasBadge = false

  @type('boolean')
  isAdmin = false

  @type('number')
  remainingConnectionTime = 0

  @type(['string'])
  clues = new ArraySchema<string>()

  @type(['string'])
  means = new ArraySchema<string>()

  constructor(id: string) {
    super()
    this.id = id
  }
}

