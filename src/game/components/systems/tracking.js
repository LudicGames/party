import {BaseSystem} from 'ein'
import TrackingComponent from '$ui/TrackingComponent'
import {UILayer} from 'ludic-vue'

export default class TrackingSystem extends BaseSystem {
  constructor(camera){
    super(true, 10)
    this.camera = camera
    // let br = this.boundingRect = this.camera.getViewportBounds()

    // this.bounds = Path2D.rect(br.x, br.y, br.w-br.x, br.h-br.y)
    // this.bounds = Path2D.rect(-10, -10, 20, 20)
    // console.log(br.x, br.y, br.w-br.x, br.h-br.y)
    this.entityQuery = {
      class: 'Player'
    }
    this.entities = []
    this.playerTrackerMap = new WeakMap()
  }

  onSystemAdded(engine){
    this.$app = engine.props.$app
    this.trackingLayer = this.$app.$ui.$refs.trackingLayer = new UILayer()
  }

  //Overide
  onEntityAdded(entity){
    this.createTrackingComponent(entity)
    this.entities.push(entity)
  }

  onEntityRemoved(manager){}

  //Overide
  update(delta){
    let ctx = this.$app.$context
    for(let player of this.entities){
      let playerWorldPos = player.getPosition(true)
      let playerPixelPos = this.camera.getPixelPointFromWorldPoint(playerWorldPos)
      let tracker = this.playerTrackerMap.get(player)
      if(this.camera.isPointInBounds(playerWorldPos.x, playerWorldPos.y, ctx)){
        if(tracker.visible){
          tracker.visible = false
        }
      } else if(tracker.visible){
        tracker.x = this.getTrackerX(player, tracker, playerPixelPos)
        tracker.y = this.getTrackerY(player, tracker, playerPixelPos)
        tracker.$vm.render(player)
      } else {
        tracker.x = this.getTrackerX(player, tracker, playerPixelPos)
        tracker.y = this.getTrackerY(player, tracker, playerPixelPos)
        tracker.visible = true
      }
    }
  }

  getTrackerX(player, tracker, playerPixelPos){
    return playerPixelPos.x - (player.width / 2) < 0
      ? 0
      : playerPixelPos.x > this.camera.width
        ? this.camera.width - 100
        : playerPixelPos.x - (tracker.width / 2)
  }
  getTrackerY(player, tracker, playerPixelPos){
    return playerPixelPos.y < 0
      ? this.camera.height - 100
      : playerPixelPos.y > this.camera.height
        ? 0
        : this.camera.height - playerPixelPos.y - (tracker.height / 2)
  }

  createTrackingComponent(entity){
    let component = new TrackingComponent()
    this.trackingLayer.$children.push(component)
    this.playerTrackerMap.set(entity, component)
  }
}
