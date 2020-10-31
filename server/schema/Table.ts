import { type, Schema, ArraySchema } from '@colyseus/schema'
import { Player } from './Player'
import { Card } from './Card'
export class Table extends Schema {
  @type('number')
  phaseTimer: number

  @type('number')
  phaseIndex: number

  @type([Player])
  players = new ArraySchema<Player>()
  
  @type([Card])
  clueDeck = new ArraySchema<string>()
  
  @type(['string'])
  meansDeck = new ArraySchema<string>()
  
  @type(['string'])
  sceneDeck = new ArraySchema<Card>()
  
  @type([Card])
  activeScene = new ArraySchema<Card>()

  constructor() {
    super()
    this.phaseTimer = 0
    this.phaseIndex = 0
  }
}
