<template lang="pug">
  .lobby-card(:style="cardStyle", @click="onClick()")
    p(v-if="!ready") Press X to join
    p(v-if="ready") Ready!
</template>

<script>
import {LudicComponent} from 'ludic-vue'
export default LudicComponent.extend({
  name: 'LobbyCard',
  data(){
    return {
      ready: false,
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
      console.log(color)
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
</style>
