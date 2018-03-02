// 10 Points when the ball touches your goal
// -5 Points when the ball touches someone elses goal

import {BaseSystem} from 'ein'
import {Box2D} from 'ludic-box2d'
import Circle from '$entities/circle'

const DEFAULTS = {
  active: true,
  priority: 10,
  entityQuery: {
    props: ['draw']
  },
  resetNeeded: false
}

export default class SoccerSystem extends BaseSystem {
  constructor(cfg={}, world){
    cfg = Object.assign(DEFAULTS, cfg)
    super(cfg)
    this.world = world
    this.players = cfg.players
    this.teams = cfg.teams

    this.playerEnts = []
    this.goalEnts = []
    this.ballEnt = null
  }

  initContactListener(){
    let listener = new Box2D.JSContactListener()
    listener.EndContact = (contactPtr) => {
      let contact = Box2D.wrapPointer(contactPtr, Box2D.b2Contact)
      let a = contact.GetFixtureA()
      let b = contact.GetFixtureB()


      // Check if the contact was with a Ball
      if(a == this.ballEnt.fixture || b == this.ballEnt.fixture){
        // Check if the Ball touched a Goal
        this.goalEnts.forEach(goal => {
          if(a == goal.fixture || b == goal.fixture){

            if(this.teams){
              this.teams.forEach(team => {
                if(team.color == goal.color){
                  team.score += 10
                } else {
                  team.score -= 5
                }
              })
            } else {
              this.players.forEach(player => {
                if(player.color == goal.color){
                  player.score += 10
                } else {
                  player.score -= 5
                }
              })
            }

            // Reset the Ball
            this.resetNeeded = true
          }
        })
      }
    }
    // Init these, or else B2D will explode
    listener.BeginContact = function (contactPtr) {}
    listener.PreSolve = function (contactPtr, manifoldPtr) {}
    listener.PostSolve = function (contactPtr, contactImpulsePtr) {}

    this.world.SetContactListener(listener)
  }

  onEntityAdded(entity){
    if(entity.constructor.name == "Player"){ this.playerEnts.push(entity) }
    if(entity.constructor.name == "Goal"){ this.goalEnts.push(entity) }
    if(entity.constructor.name == "Circle"){ this.ballEnt = entity }
    this.initContactListener()
  }

  onEntityRemoved(entity){
    this.ballEnt = null
  }

  update(){
    if(this.resetNeeded){
      this.world.DestroyBody(this.ballEnt.body)
      this.circle = new Circle(0.5, 0, 1, 'azure', this.world)
      this.engine.addEntity(this.circle)
      this.resetNeeded = false
    }
  }
}
