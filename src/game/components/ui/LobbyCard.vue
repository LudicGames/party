<template lang="pug">
  .lobby-card(@click="onClick()", :class="{'ready': ready}")
    .lobby-card-wrapper(:style="cardStyle")
    p(v-if="!ready") Press X to join
    p(v-if="ready") Ready!
</template>

<script>
import {LudicComponent} from 'ludic-vue'
export default LudicComponent.extend({
  name: 'LobbyCard',
  props: {
    ready: {type: Boolean, default: false},
  },
  data(){
    return {
      colorIndex: 0,
      colors: [this.generateNewColor()],
    }
  },
  computed: {
    cardStyle(){
      return {
        'background-color': this.colors[this.colorIndex],
      }
    }
  },
  methods: {
    onClick(){
      this.$emit('click')
    },
    generateNewColor(){
      return '#'+Math.floor(Math.random()*16777215).toString(16)
    },
    nextColor(){
      let color = this.generateNewColor()
      this.colors.push(color)
      this.colorIndex++
    },
    previousColor(){
      if(this.colors.length > 1){
        this.colors.pop()
        this.colorIndex = this.colors.length-1
      }
    },
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
