import { type, Schema, ArraySchema } from '@colyseus/schema'

export class Player extends Schema {
  reconnection: any

  @type('string')
  id = ''

  @type('string')
  name = ''

  // 0: detective, 1: scientist, 2: murderer, 3: accomplice, 4: witness
  @type('number')
  role = 0

  @type('boolean')
  connected = true

  @type('boolean')
  isAdmin = false

  @type('number')
  remainingConnectionTime = 0

  @type(['string'])
  guess = new ArraySchema<string>()

  @type(['string'])
  clues = new ArraySchema<string>()

  @type(['string'])
  means = new ArraySchema<string>()

  constructor(id: string) {
    super()
    this.id = id
  }
}
