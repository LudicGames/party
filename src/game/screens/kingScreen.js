import {Screen, Camera} from 'ludic'
import {DebugDraw, World} from 'ludic-box2d'
import {Engine, BaseSystem} from 'ein'
import Block from '$entities/block'
import RenderSystem from '$systems/render'

export default class KingScreen extends Screen {
  constructor(){
    super()
  }

  onAddedToManager(manager){
    this.initWorld()
    this.initSystems()
  }

  initWorld(){
    this.camera = new Camera(this.$app.$canvas)
    this.camera.centerWorldToCamera()

    this.world = new World(0,-9.8)
    this.debugDraw = DebugDraw.newDebugger(this.$app.$canvas)
    // this.debugDraw.SetFlags(DebugDraw.e_shapeBit)
    // this.world.SetDebugDraw(this.debugDraw)

    this.engine = new Engine()

    this.platform = new Block(8,-8,7,1,'blue',this.world, true, -1, false)
  }

  initSystems(){

    // Clear
    this.clearSystem = new BaseSystem(true, -100, (delta)=>{
      this.$app.$canvas.clear()
    })
    this.engine.addSystem(this.clearSystem)

    // Camera
    this.cameraSystem = new BaseSystem(true, 25, (delta)=>{
      this.camera.draw(this.$app.$context)
      this.camera.drawAxes(this.$app.$context)
    })
    this.engine.addSystem(this.cameraSystem)

    // Render
    // this.renderSystem = new RenderSystem(true, 30, this.$app.$context)
    // this.engine.addSystem(this.renderSystem)

  }

  initEntities(){

  }

  onDestroy(){
    console.log('onDestroy - KingScreen')
    // this.$app.$ui.$children = []
  }

  update(delta, time){
    let ctx = this.$app.$context
    // this.$app.$canvas.clear('black')
    this.world.step(delta)

    this.engine.update(delta, time)

    // draw our box
    // this.boxes.forEach((box)=>{
    //   ctx.save()
    //   box.draw(ctx)
    //   ctx.restore()
    // })

    ctx.save()
    this.platform.draw(ctx)
    ctx.restore()
    this.world.drawDebug(true)
  }
}
