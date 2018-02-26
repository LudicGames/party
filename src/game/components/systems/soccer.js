import {BaseSystem} from 'ein'
import Box2D from 'ludic-box2d'

const DEFAULTS = {
  active: true,
  priority: 10,
  entityQuery: {
    props: ['draw']
  }
}

export default class SoccerSystem extends BaseSystem {
  constructor(cfg={}, world){
    cfg = Object.assign(DEFAULTS, cfg)
    super(cfg)
    this.world = world
    this.players = []
    this.goals = []
    this.ball = null
  }

  initContactListener(){
    let listener = new Box2D.JSContactListener()
    listener.EndContact = (contactPtr) => {
      let contact = Box2D.wrapPointer(contactPtr, Box2D.b2Contact)
      let a = contact.GetFixtureA()
      let b = contact.GetFixtureB()

      // If the ball touched goal 0, player 1 wins
      if((a == this.ball.fixture && b == this.goals[0].fixture) || (b == this.ball.fixture && a == this.goals[0].fixture)){
        if(!this.players[1].goals){
          this.players[1].goals = 1
        } else {
          this.players[1].goals++
        }
        // this.engine.props.onScreenFinished()
      }

      // If the ball touched goal 1, player 0 wins
      if((a == this.ball.fixture && b == this.goals[1].fixture) || (b == this.ball.fixture && a == this.goals[1].fixture)){
        if(!this.players[0].goals){
          this.players[0].goals = 1
        } else {
          this.players[0].goals++
        }


        // Reset the Ball - BROKEN
        // this.ball.needsDestroy = true

      }

    }
    // Init these, or else B2D will explode
    listener.BeginContact = function (contactPtr) {}
    listener.PreSolve = function (contactPtr, manifoldPtr) {}
    listener.PostSolve = function (contactPtr, contactImpulsePtr) {}

    this.world.SetContactListener(listener)
  }

  onEntityAdded(entity){
    if(entity.constructor.name == "Player"){ this.players.push(entity) }
    if(entity.constructor.name == "Goal"){ this.goals.push(entity) }
    if(entity.constructor.name == "Circle"){ this.ball = entity }
    this.initContactListener()
  }

  onEntityRemoved(entity){

  }

  update(){}
}
