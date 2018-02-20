import {Screen, Camera} from 'ludic'
import {DebugDraw, World} from 'ludic-box2d'
import {Engine, BaseSystem} from 'ein'
import Block from '$entities/block'
import Player from '$entities/player'
import RenderSystem from '$systems/render'
import MovementSystem from '$systems/movement'

export default class KingScreen extends Screen {
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

    this.engine = new Engine()
  }

  initSystems(){
    // Clear
    this.clearSystem = new BaseSystem(true, -100, (delta)=>{
      this.$app.$canvas.clear()
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

    this.inputSystem = new BaseSystem(true, 1, ()=>{
      this.$app.$input.update()
    })
    this.engine.addSystem(this.inputSystem)

    this.movementSystem = new MovementSystem(this.$app)
    this.engine.addSystem(this.movementSystem)
  }

  initEntities(){
    this.platform1 = new Block(0,0,20,20,'blue',this.world, true, -1, false)
    // this.platform2 = new Block(8,-1,7,1,'orange',this.world, true, -1, true)
    this.engine.addEntity(this.platform1)
    // this.engine.addEntity(this.platform2)

    this.players.forEach((player, index)=>{
      if(player.ready){
        player.entity = new Player({x:8, y: 3, width: 2, height: 2, color: player.color, world: this.world, gamepadIndex: index})
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
