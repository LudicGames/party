<template lang="pug">
  .lobby-card(:class="{'ready': player.ready}")
    .lobby-card-wrapper(:style="cardStyle")
    p(v-if="!player.ready")
      | Press
      i.button.cross
      | to join
    p(v-if="!player.ready && teamsEnabled")
      | Press
      i.button.square
      | to change team
    p(v-if="player.ready") Ready!
</template>

<script>
import {LudicComponent} from 'ludic-vue'
export default LudicComponent.extend({
  name: 'LobbyCard',
  props: {
    player: {type: Object, default: false},
    teamsEnabled: {type: Boolean, default: false},
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
    & + p
      margin-top 24px

  .button
    display inline-block
    width 22px
    height 22px
    border-radius 50%
    background black
    position relative
    margin 0 3px
    &:after,&:before
      content ' '
      position absolute
      left 50%
      top 50%
      transform translate(-50%, -50%)
      display block
    &.square
      &:after
        width 10px
        height 10px
        border 1px solid magenta
    &.cross
      &:after
        width 14px
        border 1px solid blue
        transform translate(-50%, -50%) rotate(45deg)
      &:before
        width 14px
        border 1px solid blue
        transform translate(-50%, -50%) rotate(-45deg)

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
