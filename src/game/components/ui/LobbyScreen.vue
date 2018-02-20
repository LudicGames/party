<template lang="pug">
  #lobby-screen
    lobby-card(v-for="n in 4", ref="players", :player="players[n-1]", :key="n", @mousedown.native="cross(true,{gamepadIndex:n-1})", @mouseup.native="cross(false,{gamepadIndex:n-1})")
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
          color: 'red',
          ready: false,
        },
        {
          color: 'blue',
          ready: false,
        },
        {
          color: 'purple',
          ready: false,
        },
        {
          color: 'green',
          ready: false,
        },
      ],
    }
  },
  ludicInput(){
    return {
      inputListener: {
        methods: {
          cross: this.cross,
          circle: this.circle,
          square: this.square,
        },
      },
    }
  },
  methods: {
    cross(down, {gamepadIndex}){
      let player = this.players[gamepadIndex]
      if(!down){
        if(player.ready && !this.ready){
          console.log(this.players)
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
    square(down, {gamepadIndex}){
      let player = this.players[gamepadIndex]
      if(!down && !player.ready){
        player.color = this.generateNewColor()
      }
    },

    generateNewColor(){
      return '#'+Math.floor(Math.random()*16777215).toString(16)
    },
  },
  ludicMethods: {
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
