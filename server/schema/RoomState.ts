import { type, Schema, ArraySchema } from '@colyseus/schema'
import { Player } from './Player'
import { SceneCard } from './SceneCard'

export class RoomState extends Schema {
  @type('number')
  phaseTimer = -1

  @type('number')
  phaseIndex = -1

  @type('number')
  roundsLeft = -1

  @type('string')
  message = ''

  @type([Player])
  players = new ArraySchema<Player>()
  
  // @filter(() => false)
  @type(['string'])
  clueDeck = new ArraySchema<string>()
  
  // @filter(() => false)
  @type(['string'])
  meansDeck = new ArraySchema<string>()
  
  // @filter(() => false)
  @type([SceneCard])
  sceneDeck = new ArraySchema<SceneCard>()
  
  @type([SceneCard])
  activeScene = new ArraySchema<SceneCard>()
  
  @type(['string'])
  activeCrime = new ArraySchema<string>()
  
  constructor() {
    super()
  }
}