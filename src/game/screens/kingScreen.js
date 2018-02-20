import {Screen, Camera} from 'ludic'
import {DebugDraw, World} from 'ludic-box2d'
import {Engine, BaseSystem} from 'ein'
import Block from '$entities/block'
import RenderSystem from '$systems/render'

export default class KingScreen extends Screen {
  constructor(){
    super()
  }

  onAddedToManager(){
    this.initWorld()
    this.initSystems()
    this.initEntities()
  }

  initWorld(){
    this.camera = new Camera(this.$app.$canvas)
    this.camera.centerWorldToCamera()

    this.world = new World(0,-9.8)
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



  }

  initEntities(){
    this.platform1 = new Block(0,0,20,20,'blue',this.world, true, -1, false)
    // this.platform2 = new Block(8,-1,7,1,'orange',this.world, true, -1, true)
    this.engine.addEntity(this.platform1)
    // this.engine.addEntity(this.platform2)
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
