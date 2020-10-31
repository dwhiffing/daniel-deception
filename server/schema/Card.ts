import { type, Schema,ArraySchema } from '@colyseus/schema'

export class Card extends Schema {
  @type('string')
  type: string

  @type(['string'])
  values = new ArraySchema<string>()

  @type('number')
  markedValueIndex: number

  constructor(type: string, values) {
    super()
    this.type = type
    this.values.push(...values)
    this.markedValueIndex = -1
  }
}
