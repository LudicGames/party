import {BaseSystem} from 'ein'
import {Box2D} from 'ludic-box2d'

const DEFAULTS = {
  active: true,
  priority: 10,
  entityQuery: {
    props: ['draw']
  }
}

export default class KingSystem extends BaseSystem {
  constructor(cfg={}, world){
    cfg = Object.assign(DEFAULTS, cfg)
    super(cfg)
    this.world = world
    this.players = []
    this.ring = null
  }

  initContactListener(){
    let listener = new Box2D.JSContactListener()
    listener.EndContact = (contactPtr) => {
      let contact = Box2D.wrapPointer(contactPtr, Box2D.b2Contact)
      let a = contact.GetFixtureA()
      let b = contact.GetFixtureB()

      // Player 0 looses
      if((this.ring.fixture == a && this.players[0].fixture == b) || (this.ring.fixture == b && this.players[0].fixture == a)){
        // console.log(this.players[0].color + " LOOSES! HE FUCKIN SUCKS!")
        this.engine.props.onScreenFinished()
      }

      // Player 1 looses
      if((this.ring.fixture == a && this.players[1].fixture == b) || (this.ring.fixture == b && this.players[1].fixture == a)){
        // console.log(this.players[1].color + " LOOSES! HE FUCKIN SUCKS!")
        this.engine.props.onScreenFinished()
      }


    }
    // Init these, or else B2D will explode
    listener.BeginContact = function (contactPtr) {}
    listener.PreSolve = function (contactPtr, manifoldPtr) {}
    listener.PostSolve = function (contactPtr, contactImpulsePtr) {}

    this.world.SetContactListener(listener)
  }

  onEntityAdded(entity){
    this.entities.push(entity)
    if(entity.constructor.name == "Player"){
      this.players.push(entity)
    } else {
      this.ring = entity
    }
    this.initContactListener()
  }

  onEntityRemoved(entity){
    this.entities.splice(this.entities.indexOf(entity), 1)
  }

  update(){
    this.entities.forEach(entity => {

    })
  }
}
