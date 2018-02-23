import {BaseSystem} from 'ein'
import Box2D from 'ludic-box2d'

const DEFAULTS = {
  active: true,
  priority: 10,
  entityQuery: {
    props: ['draw']
  }
}

export default class SumoSystem extends BaseSystem {
  constructor(cfg={}, world){
    cfg = Object.assign(DEFAULTS, cfg)
    super(cfg)
    this.world = world
  }

  initContactListener(){
    let contactFilter = new Box2D.JSContactFilter()


    let listener = new Box2D.JSContactListener()
    listener.BeginContact = function (contactPtr) {
      console.log("begin contact", contactPtr)
    }

    // Empty implementations for unused methods.
    listener.EndContact = (contactPtr) => {
      console.log("end contact", contactPtr)
      let contact = Box2D.wrapPointer(contactPtr, Box2D.b2Contact)
      let a = contact.GetFixtureA()
      let b = contact.GetFixtureB()

      console.log(a)
      console.log(b)
      this.entities.forEach(ent => {
        if(ent.fixture == a){
          console.log("yes!")
        }
        if(ent.fixture == b){
          console.log("yes!")
        }
      })
    }

    this.world.SetContactListener(listener)

  }

  onEntityAdded(entity){
    this.entities.push(entity)
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
