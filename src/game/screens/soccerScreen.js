import {Screen, Camera} from 'ludic'
import {DebugDraw, World} from 'ludic-box2d'
import {Engine, BaseSystem} from 'ein'
import Circle from '$entities/circle'
import Player from '$entities/player'
import Walls from '$entities/walls'
import Goal from '$entities/goal'
import RenderSystem from '$systems/render'
import MovementSystem from '$systems/movement'
import SoccerSystem from '$systems/soccer'

export default class soccerScreen extends Screen {
  constructor(players){
    super()
    this.players = players

    // Soccer music
    // window.open("https://youtu.be/4PHVZ-6fZS8?autoplay=1", "_blank")

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

    // Soccer
    this.soccerSystem = new SoccerSystem({}, this.world)
    this.engine.addSystem(this.soccerSystem)

  }

  initEntities(){
    // Walls
    this.walls = new Walls(this.camera.width / this.camera.ptm, this.camera.height/ this.camera.ptm, this.world, 'orange', -1)
    this.engine.addEntity(this.walls)

    // Goals
    this.goal1 = new Goal((this.camera.width / this.camera.ptm) / 2 - .5, 0, 1, 6, "#92F15F", this.world)
    this.goal2 = new Goal(0 - (this.camera.width / this.camera.ptm) / 2 + .5, 0, 1, 6, "#92F15F", this.world)
    this.engine.addEntity(this.goal1)
    this.engine.addEntity(this.goal2)

    // Ball
    this.circle = new Circle(0.5, 0, 1, 'azure', this.world)
    this.engine.addEntity(this.circle)

    // Create Spawn Points
    switch (this.players.length){
    case 2:
      this.spawnPoints = {
        0: {x: -10, y: 0},
        1: {x: 10, y: 0}
      }
      break
    case 4:
      this.spawnPoints = {
        0: {x: -10, y: 5},
        1: {x: 10, y: -5},
        2: {x: 10, y: 5},
        3: {x: 10, y: -5}
      }
      break
    }

    // Players
    this.players.forEach((player, index)=>{
      if(player.ready){
        player.entity = new Player({x: this.spawnPoints[index].x, y: this.spawnPoints[index].y, width: 1, height: 6, color: player.color, world: this.world, gamepadIndex: index})
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
