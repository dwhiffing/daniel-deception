import { type, filter, Schema, ArraySchema } from '@colyseus/schema'
import { Player } from './Player'
import { Card } from './Card'
import { MEANS, CLUES, SCENES,CAUSE_OF_DEATH_SCENE,LOCATION_SCENE } from '../constants'
import shuffle from 'lodash/shuffle'

export class Table extends Schema {
  @type('number')
  phaseTimer: number

  @type('number')
  phaseIndex: number

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
    this.phaseIndex = -1
  }

  deal() {
    if (this.phaseIndex !== -1) return
    
    this.phaseIndex = 0
    
     // Shuffle clue, means, and scene decks
    this.clueDeck = this.clueDeck.filter(() => false)
    this.meansDeck = this.meansDeck.filter(() => false)
    this.clueDeck.push(...shuffle(CLUES))
    this.meansDeck.push(...shuffle(MEANS))

    // Setup scene deck
    this.sceneDeck.push(new Card(CAUSE_OF_DEATH_SCENE.type, CAUSE_OF_DEATH_SCENE.values))
    this.sceneDeck.push(new Card(LOCATION_SCENE.type, shuffle(LOCATION_SCENE.values).slice(0, 6)))
    this.sceneDeck.push(...shuffle(SCENES.map(s => new Card(s.type, s.values))))

    // Assign murderer role
    const otherPlayers = this.players.filter(p => p.role !== 1)
    const murderer = shuffle(otherPlayers)[0]
    if (murderer) murderer.role = 2
    
    // Deal 4 clue cards and 4 means cards to each player
    otherPlayers.forEach(p => {
      const clueCards = this.clueDeck.splice(0,4)
      const meansCards = this.meansDeck.splice(0,4)
      p.giveCards(clueCards, meansCards)
    })

    this.activeScene.push(...this.sceneDeck.splice(0, 5))
  }

  murder(clue, means) {
    this.activeCrime.push(clue)
    this.activeCrime.push(means)
    this.phaseIndex = 1
  }

  accuse(player, clue, means) {
    if (!player.hasBadge) return

    if (this.activeCrime[0] === clue && this.activeCrime[1] === means) {
      this.endGame()
    } else {
      player.hasBadge = false
    }
  }

  endGame() {
    this.phaseIndex = -1
    this.phaseTimer = 0
  }

  mark(type, value) {
    if (this.phaseIndex !== 1) return

    const card = this.activeScene.find(c => c.type === type)
    card.markedValueIndex = card.values.findIndex(c => c === value)
    const markedCardsLength = this.activeScene.filter(c => c.markedValueIndex > -1).length

    if (markedCardsLength === this.activeScene.length) {
      this.phaseIndex = 2
    }
  }
}
