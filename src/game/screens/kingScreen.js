import {Screen, Camera} from 'ludic'
import {DebugDraw, World} from 'ludic-box2d'
import {Engine, BaseSystem} from 'ein'

// UI
import Timer from '$ui/Timer'

// Entities
import Walls from '$entities/walls'
import Ring from '$entities/ring'
import Player from '$entities/player'

// Systems
import RenderSystem from '$systems/render'
import MovementSystem from '$systems/movement'
import KingSystem from '$systems/king'

export default class KingScreen extends Screen {
  constructor(data){
    super()
    this.players = data.players
    this.teams = data.teams
  }

  onAddedToManager(){
    this.initWorld()
    this.initSystems()
    this.initEntities()
    this.initUI()
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

    // King
    this.kingSystem = new KingSystem({}, this.world)
    this.engine.addSystem(this.kingSystem)

  }

  initEntities(){
    // Ring
    this.ring = new Ring(0, 0, 4, 'azure', this.world)
    this.engine.addEntity(this.ring)

    // Walls
    // this.walls = new Walls(this.camera.width / this.camera.ptm, this.camera.height/ this.camera.ptm, this.world, 'orange', 0)
    // this.engine.addEntity(this.walls)

    // Create Spawn Points
    switch (this.players.length){
    case 2:
      this.spawnPoints = {
        0: {x: -10, y: 0},
        1: {x: 10, y: 0}
      }
      break
    case 3:
      this.spawnPoints = {
        0: {x: -10, y: 0},
        1: {x: 10, y: 0},
        2: {x: 0, y: 10},
      }
      break
    case 4:
      this.spawnPoints = {
        0: {x: -10, y: 0},
        1: {x: 10, y: 0},
        2: {x: 0, y: 10},
        3: {x: 0, y: -10},
      }
      break
    }


    // Players
    this.players.forEach((player, index)=>{
      if(player.ready){
        player.entity = new Player({x: this.spawnPoints[index].x, y: this.spawnPoints[index].y, width: 1, height: 3, color: player.color, world: this.world, gamepadIndex: index})
        this.engine.addEntity(player.entity)
      }
    })
  }

  initUI(){
    // Timer
    this.timer = this.$mapMethods(new Timer(this.$app), {
      'onTimeUp': 'onTimeUp',
    })

    this.$app.$ui.$refs.timer = this.timer
  }

  onTimeUp(){
    this.finish({

    })
  }

  onDestroy(){
    delete this.$app.$ui.$refs.timer
  }

  update(delta, time){
    this.world.step(delta)
    this.engine.update(delta, time)
    this.world.drawDebug(true)
  }
}
