<template lang="pug">
  #lobby-screen
    lobby-card#player1(ref="player1", @click="onClick(1)")
    lobby-card#player2(ref="player2", @click="onClick(2)")
    lobby-card#player3(ref="player3", @click="onClick(3)")
    lobby-card#player4(ref="player4", @click="onClick(4)")
</template>

<script>
import {LudicComponent} from 'ludic-vue'
import LobbyCard from '@/game/components/LobbyCard'
export default LudicComponent.extend({
  name: 'LobbyScreen',
  ludicComponents: {
    LobbyCard,
  },
  data(){
    return {
    }
  },
  created(){
    let [app] = this.componentArgs
    this.inputListener = app.$input.newInputListener({
      alsoAdd: true,
      methods: {
        cross: (down, {gamepadIndex})=>{
          this.$refs[`player${gamepadIndex+1}`].ready = true
        },
        circle: (down, {gamepadIndex})=>{
          this.$refs[`player${gamepadIndex+1}`].ready = false
        },
        left: (down, {gamepadIndex})=>{
          let ref = this.$refs[`player${gamepadIndex+1}`]
          if(!down && !ref.ready){
            ref.previousColor()
          }
        },
        right: (down, {gamepadIndex})=>{
          let ref = this.$refs[`player${gamepadIndex+1}`]
          if(!down && !ref.ready){
            ref.nextColor()
          }
        },
      },
    })
  },
  methods: {
    onClick(){

    }
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
