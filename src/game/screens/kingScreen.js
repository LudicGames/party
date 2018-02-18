import {Screen, Camera} from 'ludic'
import {Box2D, DebugDraw, World} from 'ludic-box2d'
import Block from '$entities/block'

export default class KingScreen extends Screen {
  constructor(){
    super()

  }

  onAddedToManager(manager){
    this.initWorld()
    // console.log(this.$app)
  }

  initSystems(){


  }

  initEntities(){

  }

  initWorld(){
    console.log("world creator")
    console.log(Box2D)
    // this.camera = new Camera(this.$app.$canvas)
    this.world = new World(0,-9.8)
    // this.debugDraw = DebugDraw.newDebugger(this.$app.$canvas)
    // this.debugDraw.SetFlags(DebugDraw.e_shapeBit)
    // this.world.SetDebugDraw(this.debugDraw)

    // this.platform = new Block(8,-8,7,1,'orange',this.world, true, -1, false)
  }


  onDestroy(){
    console.log('onDestroy - KingScreen')
    // this.app.$ui.$children = []
  }

  update(delta, time){
    let ctx = this.$app.$context
    this.$app.$canvas.clear('black')
    // this.world.step(delta)
    // this.camera.draw(ctx)
    // this.camera.drawAxes(ctx)

    // draw our box
    // this.boxes.forEach((box)=>{
    //   ctx.save()
    //   box.draw(ctx)
    //   ctx.restore()
    // })

    // ctx.save()
    // this.platform.draw(ctx)
    // ctx.restore()
    // this.world.drawDebug(true)
  }
}
