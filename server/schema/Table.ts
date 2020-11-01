import { type, Schema, ArraySchema } from '@colyseus/schema'
import { Player } from './Player'
import { Card } from './Card'

export class Table extends Schema {
  @type('number')
  phaseTimer: number

  @type('number')
  phaseIndex: number

  @type('number')
  roundsLeft: number

  @type('string')
  message: string

  @type([Player])
  players = new ArraySchema<Player>()
  
  // @filter(() => false)
  @type(['string'])
  clueDeck = new ArraySchema<string>()
  
  // @filter(() => false)
  @type(['string'])
  meansDeck = new ArraySchema<string>()
  
  // @filter(() => false)
  @type([Card])
  sceneDeck = new ArraySchema<Card>()
  
  @type([Card])
  activeScene = new ArraySchema<Card>()
  
  @type(['string'])
  activeCrime = new ArraySchema<string>()
  
  constructor() {
    super()
    this.phaseTimer = 0
    this.message = ''
    this.phaseIndex = -1
  }
}
