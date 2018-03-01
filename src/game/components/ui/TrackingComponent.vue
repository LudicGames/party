<template lang="pug">
  .tracking-component(:style="style")
    canvas(ref="canvas", :width="width", :height="height")
</template>

<script>
import {LudicComponent} from 'ludic-vue'
export default LudicComponent.extend({
  name: 'TrackingComponent',
  data(){
    return {
      x: 0,
      y: 0,
      visible: false,
      width: 130,
      height: 130,
    }
  },
  computed: {
    style(){
      return {
        top: `${this.y}px`,
        left: `${this.x}px`,
        height: `${this.height}px`,
        width: `${this.width}px`,
        display: this.visible ? null : 'none',
      }
    },
  },
  mounted(){
    this.$nextTick(()=>{
      this.ctx = this.$refs.canvas.getContext('2d')
    })
  },
  methods: {
    render(player){
      this.ctx.save()
      // clear the background
      this.ctx.clearRect(0, 0, this.width, this.height)
      let pos = player.getPosition(true)
      // put the 0,0 position in the center
      this.ctx.translate(this.width / 2, this.height / 2)
      // scale up
      this.ctx.scale(15,-15)
      // offset the center by the player's pos to place the player in the center
      this.ctx.translate(-pos.x, -pos.y)
      // draw the player like normal
      player.draw(this.ctx)
      this.ctx.restore()
    }
  },
})
</script>

<style lang="stylus">
.tracking-component
  position absolute
  border-radius 50%
  border 1px solid blue
  // overflow hidden
  canvas
    width 100%
    height 100%

</style>
