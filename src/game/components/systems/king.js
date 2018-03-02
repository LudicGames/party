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
    this.players = cfg.players

    this.playerEnts = []
    setInterval(()=> {
      this.playerEnts.forEach(playerEnt => {
        if(playerEnt.in){
          this.players.forEach(player => {
            if(player.entity == playerEnt){
              player.score++
            }
          })
        }
      })
    }, 1000)

    this.initContactListener()
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
            player.in = false
          }
        })
      }
    }
    // Init these, or else B2D will explode
    listener.BeginContact = (contactPtr) => {
      let contact = Box2D.wrapPointer(contactPtr, Box2D.b2Contact)
      let a = contact.GetFixtureA()
      let b = contact.GetFixtureB()

      // Contact ended with the Ring
      if(this.ring.fixture == a || this.ring.fixture == b){
        this.playerEnts.forEach(player => {
          if(player.fixture == a || player.fixture == b){
            player.in = true
          }
        })
      }
    }


    listener.PreSolve = function (contactPtr, manifoldPtr) {}
    listener.PostSolve = function (contactPtr, contactImpulsePtr) {}

    this.world.SetContactListener(listener)
  }

  onEntityAdded(entity){
    this.entities.push(entity)
    if(entity.constructor.name == "Player"){
      this.playerEnts.push(entity)
    } else {
      this.ring = entity
    }
   }
}
