import {Screen, Camera} from 'ludic'
import {DebugDraw, World} from 'ludic-box2d'
import {Engine, BaseSystem} from 'ein'
import Circle from '$entities/circle'
import Player from '$entities/player'
import Ring from '$entities/ring'
import RenderSystem from '$systems/render'
import MovementSystem from '$systems/movement'
import SumoSystem from '$systems/sumo'

export default class SumoScreen extends Screen {
  constructor(data){
    super()
    this.players = data.players
    this.teams = data.teams

    // Sumo music
    // window.open("https://www.youtube.com/embed/qupswFhMCxI?autoplay=1", "_blank")
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
    this.sumoSystem = new SumoSystem({players: this.players, teams: this.teams}, this.world, this.endGame.bind(this))
    this.engine.addSystem(this.sumoSystem)
  }

  initEntities(){
    // Ring
    if(this.players.length == 2){
      this.ring = new Ring(0, 0, 6, 'azure', this.world)
    } else {
      this.ring = new Ring(0, 0, 8, 'azure', this.world)
    }

    this.engine.addEntity(this.ring)


    // Players
    if(this.players.length == 2){
      this.players[0].entity = new Player({x: -4, y: 0.5, width: 2, height: 4, color: this.players[0].color, world: this.world, gamepadIndex: 0})
      this.players[1].entity = new Player({x: 4, y: 0.5, width: 2, height: 4, color: this.players[1].color, world: this.world, gamepadIndex: 1})
    }
    if(this.players.length == 3){
      this.players[0].entity = new Player({x: -4, y: 0.5, width: 2, height: 4, color: this.players[0].color, world: this.world, gamepadIndex: 0})
      this.players[1].entity = new Player({x: 4, y: 0.5, width: 2, height: 4, color: this.players[1].color, world: this.world, gamepadIndex: 1})
      this.players[2].entity = new Player({x: 4, y: 0.5, width: 2, height: 4, color: this.players[2].color, world: this.world, gamepadIndex: 2})
    }
    if(this.players.length == 4){
      this.players[0].entity = new Player({x: -4, y: 0, width: 2, height: 4, color: this.players[0].color, world: this.world, gamepadIndex: 0})
      this.players[1].entity = new Player({x: 4, y: 0, width: 2, height: 4, color: this.players[1].color, world: this.world, gamepadIndex: 1})
      this.players[2].entity = new Player({x: 0, y: 4, width: 4, height: 2, color: this.players[2].color, world: this.world, gamepadIndex: 2})
      this.players[3].entity = new Player({x: 0, y: -4, width: 4, height: 2, color: this.players[3].color, world: this.world, gamepadIndex: 3})
    }

    this.players.forEach((player, index) => {
      this.engine.addEntity(this.players[index].entity)
    })
  }

  endGame(){
    this.finish({players: this.players, teams: this.teams})
  }

  onDestroy(){
    // this.$app.$ui.$children = []
  }

  update(delta, time){
    this.world.step(delta)
    this.engine.update(delta, time)
    // this.world.drawDebug(true)
  }
}
