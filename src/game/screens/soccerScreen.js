import {Screen, Camera} from 'ludic'
import {DebugDraw, World} from 'ludic-box2d'
import {Engine, BaseSystem} from 'ein'

// UI
import Timer from '$ui/Timer'

// Entities
import Circle from '$entities/circle'
import Player from '$entities/player'
import Walls from '$entities/walls'
import Goal from '$entities/goal'

// Systems
import RenderSystem from '$systems/render'
import MovementSystem from '$systems/movement'
import SoccerSystem from '$systems/soccer'

export default class SoccerScreen extends Screen {
  constructor(data){
    super()
    this.players = data.players
    this.teams = data.teams
    this.goals = []
    // Soccer music
    // window.open("https://youtu.be/4PHVZ-6fZS8?autoplay=1", "_blank")
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

    // Soccer
    this.soccerSystem = new SoccerSystem({players: this.players, teams: this.teams}, this.world)
    this.engine.addSystem(this.soccerSystem)
  }

  initEntities(){
    // Walls
    this.walls = new Walls(this.camera.width / this.camera.ptm, this.camera.height/ this.camera.ptm, this.world, 'orange', -1)
    this.engine.addEntity(this.walls)

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
    case 3:
      this.spawnPoints = {
        0: {x: 10, y: 0},
        1: {x: -10, y: 0},
        2: {x: 0.5, y: 10}
      }
      break
    case 4:
      this.spawnPoints = {
        0: {x: 10, y: 0},
        1: {x: -10, y: 0},
        2: {x: 0.5, y: 10},
        3: {x: 0.5, y: -10}
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

    // Goals
    if(this.teams){
      this.goals.push(new Goal((this.camera.width / this.camera.ptm) / 2 - 1, 0, 2, 10, this.teams[0].color, this.world))
      this.goals.push(new Goal(0 - (this.camera.width / this.camera.ptm) / 2 + 1, 0, 2, 10, this.teams[1].color, this.world))
      this.teams.forEach((player, index)=>{
        this.engine.addEntity(this.goals[index])
      })
    } else {
      if(this.players.length == 2){
        this.goals.push(new Goal((this.camera.width / this.camera.ptm) / 2 - 1, 0, 2, 10, this.players[0].color, this.world))
        this.goals.push(new Goal(0 - (this.camera.width / this.camera.ptm) / 2 + 1, 0, 2, 10, this.players[1].color, this.world))
      }
      if(this.players.length == 3){
        this.goals.push(new Goal((this.camera.width / this.camera.ptm) / 2 - 1, 0, 2, 10, this.players[0].color, this.world))
        this.goals.push(new Goal(0 - (this.camera.width / this.camera.ptm) / 2 + 1, 0, 2, 10, this.players[1].color, this.world))
        this.goals.push(new Goal(0, (this.camera.height / this.camera.ptm) / 2 - 1, 10, 2, this.players[2].color, this.world))

      }
      if(this.players.length == 4){
        this.goals.push(new Goal((this.camera.width / this.camera.ptm) / 2 - 1, 0, 2, 10, this.players[0].color, this.world))
        this.goals.push(new Goal(0 - (this.camera.width / this.camera.ptm) / 2 + 1, 0, 2, 10, this.players[1].color, this.world))
        this.goals.push(new Goal(0, (this.camera.height / this.camera.ptm) / 2 - 1, 10, 2, this.players[2].color, this.world))
        this.goals.push(new Goal(0, 0 - (this.camera.height / this.camera.ptm) / 2 + 1, 10, 2, this.players[3].color, this.world))
      }
      this.players.forEach((player, index)=>{
        this.engine.addEntity(this.goals[index])
      })
    }
  }

  initUI(){
    // Timer
    this.timer = this.$mapMethods(new Timer({time: 60}), {
      'onTimeUp': 'onTimeUp',
    })
    this.$app.$ui.$refs.timer = this.timer
  }

  onTimeUp(){
    this.finish({players: this.players, teams: this.teams})
  }

  onDestroy(){
    delete this.$app.$ui.$refs.timer
  }

  update(delta, time){
    this.world.step(delta)
    this.engine.update(delta, time)
    // this.world.drawDebug(true)
  }
}
