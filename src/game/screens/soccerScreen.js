import {Screen, Camera} from 'ludic'
import {DebugDraw, World} from 'ludic-box2d'
import {Engine, BaseSystem} from 'ein'
import Circle from '$entities/circle'
import Player from '$entities/player'
import Walls from '$entities/walls'
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

    this.engine = new Engine(this.$app)
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
    // Walls
    this.walls = new Walls(this.camera.width / this.camera.ptm, this.camera.height/ this.camera.ptm, this.world, 'orange', -1)
    this.engine.addEntity(this.walls)

    // Ball
    this.circle = new Circle(0, 0, 1, 'green', this.world)
    this.engine.addEntity(this.circle)

    // Players
    this.players.forEach((player, index)=>{
      if(player.ready){
        player.entity = new Player({x:8, y: 3, width: 8, height: 1, color: player.color, world: this.world, gamepadIndex: index})
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
