import { type, Schema, ArraySchema } from '@colyseus/schema'

export class SceneCard extends Schema {
  @type('string')
  type: string

  @type(['string'])
  values = new ArraySchema<string>()

  @type('number')
  markedValueIndex = -1

  constructor(type: string, values) {
    super()
    this.type = type
    this.values.push(...values)
  }
}
