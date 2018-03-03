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
    this.teams = cfg.teams

    this.playerEnts = []
    this.ringEnt = null

    this.contested = false
    this.currentKings = []

    this.initContactListener()

    this.awardPointsInterval = setInterval(()=> {
      this.awardPoints()
    }, 1000)
  }

  initContactListener(){
    let listener = new Box2D.JSContactListener()
    listener.EndContact = (contactPtr) => {
      let contact = Box2D.wrapPointer(contactPtr, Box2D.b2Contact)
      let a = contact.GetFixtureA()
      let b = contact.GetFixtureB()

      // Contact ended with the Ring
      if(this.ringEnt.fixture == a || this.ringEnt.fixture == b){
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
      if(this.ringEnt.fixture == a || this.ringEnt.fixture == b){
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
      this.ringEnt = entity
    }
  }

  awardPoints(){
    this.currentKings.forEach(king => {
      this.players.forEach(player => {
        if(player.entity == king){
          player.score++
        }
      })
    })
  }

  onDestroy(){
    clearInterval(this.awardPointsInterval)
  }

  update(){
    let playersIn = this.playerEnts.filter(p => p.in)

    if(playersIn.length == 0){
      this.ringEnt.color = "azure"
      this.currentKings = []
    }

    if(playersIn.length == 1){
      this.contested = false
      this.ringEnt.color = playersIn[0].color
      this.currentKings = [playersIn[0]]
    }

    // More than 1 player in the ring, and no teams
    if(playersIn.length > 1 && !this.teams){
      this.contested = true
      this.ringEnt.color = "azure"
      this.currentKings = []
    }

    // More than 1 player in the ring, and teams
    if(playersIn.length > 1 && this.teams){
      let colors = new Set()
      playersIn.forEach(player => {
        colors.add(player.color)
      })

      if(colors.size > 1){
        this.contested = true
        this.ringEnt.color = "azure"
        this.currentKings = []
      } else {
        this.contested = false
        this.currentKings = playersIn
        this.ringEnt.color = playersIn[0].color
      }
    }


  }
}
