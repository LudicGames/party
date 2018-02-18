<template lang="pug">
  #lobby-screen
    lobby-card#player1(@click="onClick(1)")
    lobby-card#player1(@click="onClick(2)")
    lobby-card#player1(@click="onClick(3)")
    lobby-card#player1(@click="onClick(4)")
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
  methods: {
  },
  ludicMethods: {
    onClick(number){
      return number
    },
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
