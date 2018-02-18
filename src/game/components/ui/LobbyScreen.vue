<template lang="pug">
  #lobby-screen
    lobby-card(v-for="n in 4", ref="players" :ready="players[n-1].ready", :key="n")
</template>

<script>
import {LudicComponent} from 'ludic-vue'
import LobbyCard from '$ui/LobbyCard'
export default LudicComponent.extend({
  name: 'LobbyScreen',
  ludicComponents: {
    LobbyCard,
  },
  data(){
    return {
      ready: false,
      players: [
        {
          ready: false,
        },
        {
          ready: false,
        },
        {
          ready: false,
        },
        {
          ready: false,
        },
      ],
    }
  },
  created(){
    let [app] = this.componentArgs
    this.inputListener = app.$input.newInputListener({
      alsoAdd: true,
      binder: this,
      methods: {
        cross: this.cross,
        circle: this.circle,
        left: this.left,
        right: this.right,
      },
    })
  },
  methods: {
    cross(down, {gamepadIndex}){
      let player = this.players[gamepadIndex]
      if(!down){
        if(player.ready && !this.ready){
          this.$ludicEmit('onReady', this.players)
          this.ready = true
        } else {
          player.ready = true
        }
      }
    },
    circle(down, {gamepadIndex}){
      let player = this.players[gamepadIndex]
      if(!down){
        player.ready = false
      }
    },
    left(down, {gamepadIndex}){
      let player = this.players[gamepadIndex]
      if(!down && !player.ready){
        player.previousColor()
      }
    },
    right(down, {gamepadIndex}){
      let player = this.players[gamepadIndex]
      if(!down && !player.ready){
        player.nextColor()
      }
    },
  },
  ludicMethods: {
    // onClick(number){
    //   return number
    // },
  },
})
</script>

<style lang="stylus">
#lobby-screen
  display flex
  flex-wrap wrap
  height 100%
  .lobby-card
    flex-basis 50%
</style>
