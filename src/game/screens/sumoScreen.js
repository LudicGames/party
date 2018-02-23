import {Screen, Camera} from 'ludic'
import {DebugDraw, World} from 'ludic-box2d'
import {Engine, BaseSystem} from 'ein'
import Circle from '$entities/circle'
import Player from '$entities/player'
import SumoRing from '$entities/sumoRing'
import RenderSystem from '$systems/render'
import MovementSystem from '$systems/movement'
import SumoSystem from '$systems/sumo'

export default class SumoScreen extends Screen {
  constructor(players){
    super()
    this.players = players
  }

  onAddedToManager(){
    this.initWorld()
    this.initSystems()
    this.initEntities()
  }

  initWorld(){
    this.camera = new Camera(this.$app.$canvas)
    this.camera.centerWorldToCamera()

    this.world = new World(0,0)
    this.debugDraw = DebugDraw.newDebugger(this.$app.$canvas)
    // this.debugDraw.SetFlags(DebugDraw.e_shapeBit)
    // this.world.SetDebugDraw(this.debugDraw)

    this.engine = new Engine(this.$app)
  }

  initSystems(){
    // Clear
    this.clearSystem = new BaseSystem(true, -100, (delta)=>{
      this.$app.$canvas.clear('#0C141F')
    })
    this.engine.addSystem(this.clearSystem)

    // Camera
    this.cameraSystem = new BaseSystem(true, 5, (delta)=>{
      this.camera.draw(this.$app.$context)
      this.camera.drawAxes(this.$app.$context)
    })
    this.engine.addSystem(this.cameraSystem)

    // Render
    this.renderSystem = new RenderSystem(this.$app.$context)
    this.engine.addSystem(this.renderSystem)

    // Input
    this.inputSystem = new BaseSystem(true, 1, ()=>{
      this.$app.$input.update()
    })
    this.engine.addSystem(this.inputSystem)

    // Movement
    this.movementSystem = new MovementSystem(this.$app)
    this.engine.addSystem(this.movementSystem)

    // Sumo
    this.sumoSystem = new SumoSystem({}, this.world)
    this.engine.addSystem(this.sumoSystem)
  }

  initEntities(){
    // Ring
    this.ring = new SumoRing(0, 0, 10, 'azure', this.world)
    this.engine.addEntity(this.ring)

    // Players
    this.players.forEach((player, index)=>{
      let x = 1 - index
      if(player.ready){
        player.entity = new Player({x:index * 4, y: 0, width: 2, height: 2, color: player.color, world: this.world, gamepadIndex: index})
        this.engine.addEntity(player.entity)
      }
    })
  }

  onDestroy(){
    // console.log('onDestroy - KingScreen')
    // this.$app.$ui.$children = []
  }

  update(delta, time){
    this.world.step(delta)
    this.engine.update(delta, time)
    this.world.drawDebug(true)
  }
}
