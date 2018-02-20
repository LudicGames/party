<template lang="pug">
  .lobby-card(:class="{'ready': player.ready}")
    .lobby-card-wrapper(:style="cardStyle")
    p(v-if="!player.ready") Press X to join
    p(v-if="player.ready") Ready!
</template>

<script>
import {LudicComponent} from 'ludic-vue'
export default LudicComponent.extend({
  name: 'LobbyCard',
  props: {
    player: {type: Object, default: false},
  },
  data(){
    return {
    }
  },
  computed: {
    cardStyle(){
      return {
        'background-color': this.player.color,
      }
    }
  },
  methods: {
  },
})
</script>

<style lang="stylus">
.lobby-card
  display flex
  justify-content center
  align-items center
  position relative
  p
    position absolute
    left 50%
    top 50%
    transform translate(-50%, -50%)
    margin 0
  .lobby-card-wrapper
    display flex
    justify-content center
    align-items center
    width 100%
    height 100%
    transition width 300ms, height 300ms
  &.ready
    .lobby-card-wrapper
      width 90%
      height 90%
</style>
