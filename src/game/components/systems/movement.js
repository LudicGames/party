import {BaseSystem} from 'ein'
// import Ludic from 'Ludic'
import Box2D from 'ludic-box2d'

const DEGTORAD = Math.PI / 180

export default class MovementSystem extends BaseSystem {
  constructor(app){
    super(true, -1)
    this.entityListenerMap = {}
    this.$app = app

    // environment vars describing how players move
    this.maxVX = 25
    this.maxVY = 25
    this.maxRotation = 11

    this.entityQuery = {
      class: 'Player'
    }
    this.entities = []

    this.registerEvents()
  }

  registerEvents(){
    // register 'create new player' event
  }

  //Overide
  onEntityAdded(entity){
    this.createListener(entity)
    this.entities.push(entity)
  }

  onEntityRemoved(manager){}


  //Overide
  update(delta){

  }

  // instance methods
  createListener(entity){
    let listenerConfig = {
      keyConfig: {
        'w.once': 'up',
        'a.once': 'left',
        's.once': 'down',
        'd.once': 'right',
        'q.once': 'l1',
        'e.once': 'r1',
      },
      methods: {
        left: this.moveEntity('x', entity, -this.maxVX, 'd'),
        right: this.moveEntity('x', entity, this.maxVX, 'a'),
        up: this.moveEntity('y', entity, this.maxVY, 's'),
        down: this.moveEntity('y', entity, -this.maxVY, 'w'),
        r1: this.rotateEntity(entity, true),
        l1: this.rotateEntity(entity, false),

        rightStick: this.moveStick(entity, true),
        leftStick: this.moveStick(entity, false)
      }
    }

    if(entity.hasOwnProperty('gamepadIndex')){
      listenerConfig.gamepadIndex = entity.gamepadIndex
    }

    this.entityListenerMap[entity._id] = {
      entity,
      id: entity._id,
      listener: this.$app.$input.newInputListener(listenerConfig, this, true)
    }
  }

  moveEntity(axis, entity, max, oddKey){
    let vec = new Box2D.b2Vec2(0,0)
    let dirs = {
      y: {
        old: 'x',
        desired: 'y'
      },
      x: {
        old: 'y',
        desired: 'x'
      }
    }
    let dir = dirs[axis]

    return (keyDown, e)=>{
      let desiredVel
      if(keyDown){
        desiredVel = max
        // this.running = true
      } else if(e.type === 'gamepadButtonEvent' || !e.allKeys[oddKey]) {
        desiredVel = 0
        // this.running = false
      } else if(e.allKeys[oddKey]) {
        desiredVel = -max
      }
      // let vel = entity.body.GetLinearVelocity()
      // let velChange = desiredVel - vel.get_x()
      // let impulse = entity.body.GetMass() * velChange
      // console.log('move entity right', desiredVel, vel.get_x(), velChange, entity.body.GetMass(), impulse)
      // entity.body.ApplyForce(new Box2D.b2Vec2(0, impulse), entity.body.GetWorldCenter())
      let oldVel = entity.body.GetLinearVelocity()
      vec[`set_${dir.old}`](oldVel[`get_${dir.old}`]())
      vec[`set_${dir.desired}`](desiredVel)
      entity.body.SetLinearVelocity(vec)
    }
  }

  rotateEntity(entity, right){

    return (keyDown, e)=>{
      // console.log('on rotate: ', keyDown)
      if(keyDown){
        entity.body.SetAngularVelocity(right ? -this.maxRotation : this.maxRotation)
      } else {
        entity.body.SetAngularVelocity(0)
      }
    }
  }

  moveStick(entity, right){
    let vec = new Box2D.b2Vec2(0,0)
    return (x, y, e)=>{
      // -x:left, -y:up
      if(!right){
        if(!e.axis.zeroed){
          vec.set_x(x*this.maxVX)
          vec.set_y(y*-this.maxVY)
        } else {
          vec.set_x(0)
          vec.set_y(0)
        }
        entity.body.SetLinearVelocity(vec)
      }
    }
  }
}
