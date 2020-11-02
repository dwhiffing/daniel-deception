import { Command } from "@colyseus/command"
import { RoomState } from '../schema'
import { MEANS, CLUES, SCENES,CAUSE_OF_DEATH_SCENE,LOCATION_SCENE } from '../constants'
import { SceneCard } from '../schema/SceneCard'
import { ArraySchema } from '@colyseus/schema'
import shuffle from 'lodash/shuffle'

export class DealCommand extends Command<RoomState> {
  validate() {
    return (
      this.state.players.length >= 4 &&
      this.state.players.some(p => p.role === 1) &&
      this.state.phaseIndex === -1
    )
  }

  execute() {
    this.state.phaseIndex = 0
    this.state.phaseTimer = 0
    this.state.roundsLeft = 2

    this.state.clueDeck = this.state.clueDeck.filter(() => false)
    this.state.clueDeck.push(...shuffle(CLUES))

    this.state.meansDeck = this.state.meansDeck.filter(() => false)
    this.state.meansDeck.push(...shuffle(MEANS))

    const detectives = this.state.players.filter(p => p.role !== 1)
    const murderer = shuffle(detectives)[0]
    if (murderer) murderer.role = 2
    
    detectives.forEach(p => {
      p.clues.push(...this.state.clueDeck.splice(0, 4))
      p.means.push(...this.state.meansDeck.splice(0, 4))
      p.hasBadge = true
    })
    
    this.state.sceneDeck = new ArraySchema<SceneCard>()
    this.state.sceneDeck.push(new SceneCard(CAUSE_OF_DEATH_SCENE.type, CAUSE_OF_DEATH_SCENE.values))
    this.state.sceneDeck.push(new SceneCard(LOCATION_SCENE.type, shuffle(LOCATION_SCENE.values).slice(0, 6)))
    this.state.sceneDeck.push(...shuffle(SCENES.map(s => new SceneCard(s.type, s.values))))
    this.state.activeScene.push(...this.state.sceneDeck.splice(0, 7))
  }
}