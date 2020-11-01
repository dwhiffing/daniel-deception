import { Command } from "@colyseus/command"
import { Table } from '../schema'
import { MEANS, CLUES, SCENES,CAUSE_OF_DEATH_SCENE,LOCATION_SCENE } from '../constants'
import { Card } from '../schema/Card'
import { ArraySchema } from '@colyseus/schema'
import shuffle from 'lodash/shuffle'

export class DealCommand extends Command<Table> {

  validate() {
    return this.state.players.length >= 4 && this.state.players.some(p => p.role === 1) && this.state.phaseIndex === -1
  }

  execute() {
    this.state.phaseIndex = 0
    this.state.roundsLeft = 2
    this.state.phaseTimer = 0
    this.state.message = ''

     // Shuffle clue, means, and scene decks
    this.state.clueDeck = this.state.clueDeck.filter(() => false)
    this.state.meansDeck = this.state.meansDeck.filter(() => false)
    this.state.clueDeck.push(...shuffle(CLUES))
    this.state.meansDeck.push(...shuffle(MEANS))
    
    // Setup scene deck
    this.state.sceneDeck = new ArraySchema<Card>()
    this.state.sceneDeck.push(new Card(CAUSE_OF_DEATH_SCENE.type, CAUSE_OF_DEATH_SCENE.values))
    this.state.sceneDeck.push(new Card(LOCATION_SCENE.type, shuffle(LOCATION_SCENE.values).slice(0, 6)))
    this.state.sceneDeck.push(...shuffle(SCENES.map(s => new Card(s.type, s.values))))


    // Assign murderer role
    const otherPlayers = this.state.players.filter(p => p.role !== 1)
    const murderer = shuffle(otherPlayers)[0]
    if (murderer) murderer.role = 2
    
    // Deal 4 clue cards and 4 means cards to each player
    otherPlayers.forEach(p => {
      const clueCards = this.state.clueDeck.splice(0,4)
      const meansCards = this.state.meansDeck.splice(0,4)
      p.giveCards(clueCards, meansCards)
    })

    this.state.activeScene.push(...this.state.sceneDeck.splice(0, 7))
  }

}