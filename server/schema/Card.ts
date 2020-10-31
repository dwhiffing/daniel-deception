import { type, Schema,ArraySchema } from '@colyseus/schema'

export class Card extends Schema {
  @type('string')
  category: string

  @type(['string'])
  values = new ArraySchema<string>()

  @type('number')
  markedValueIndex: number

  constructor(category: string, values: ArraySchema<string>) {
    super()
    this.category =category
    this.values.push(...values)
    this.markedValueIndex = -1
  }
}
