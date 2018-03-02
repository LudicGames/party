// 1st 20  points
// 2nd 10  points
// 3rd 0   points
// 4th -10 points


import {BaseSystem} from 'ein'
import {Box2D} from 'ludic-box2d'

const DEFAULTS = {
  active: true,
  priority: 10,
  entityQuery: {
    props: ['draw']
  }
}

export default class SumoSystem extends BaseSystem {
  constructor(cfg={}, world, endGame){
    cfg = Object.assign(DEFAULTS, cfg)
    super(cfg)
    this.world = world
    this.playerEnts = []
    this.ring = null

    this.teams = cfg.teams
    this.players = cfg.players
    this.playersOut = 0
    this.endGame = endGame
  }

  initContactListener(){
    let listener = new Box2D.JSContactListener()
    listener.EndContact = (contactPtr) => {
      let contact = Box2D.wrapPointer(contactPtr, Box2D.b2Contact)
      let a = contact.GetFixtureA()
      let b = contact.GetFixtureB()

      // Contact ended with the Ring
      if(this.ring.fixture == a || this.ring.fixture == b){
        this.playerEnts.forEach(player => {
          if(player.fixture == a || player.fixture == b){
            this.playersOut++
            player.movementDisabled = true
            player.movementListener.enabled = false

            // Award points
            if(this.playersOut == 1){ this.awardPoints(player, -10) }
            if(this.playersOut == 3){
              this.awardPoints(player, 10)
              player.score += 10

              // Last player left gets 20
              this.players.forEach(player => {
                if(!player.out){
                  player.score += 20
                }
              })

              this.endGame()
            }
          }
        })
      }
      // this.engine.props.onScreenFinished()
    }
    // Init these, or else B2D will explode
    listener.BeginContact = function (contactPtr) {}
    listener.PreSolve = function (contactPtr, manifoldPtr) {}
    listener.PostSolve = function (contactPtr, contactImpulsePtr) {}

    this.world.SetContactListener(listener)
  }

  onEntityAdded(entity){
    if(entity.constructor.name == "Player"){
      this.playerEnts.push(entity)
    } else {
      this.ring = entity
    }
    this.initContactListener()
  }

  awardPoints(entity, points){
    this.players.forEach(player => {
      if(player.entity == entity){
        player.score += points
        player.out = true
      }
    })
  }
}
