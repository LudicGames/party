<template lang="pug">
  .lobby-card(:style="cardStyle", @click="onClick()")
    p test
</template>

<script>
import {LudicComponent} from 'ludic-vue'
export default LudicComponent.extend({
  name: 'LobbyCard',
  data(){
    return {
    }
  },
  computed: {
    cardStyle(){
      return {
        'background-color': '#'+Math.floor(Math.random()*16777215).toString(16),
      }
    }
  },
  methods: {
    onClick(){
      this.$emit('click')
    }
  },
})
</script>

<style lang="stylus">
p
  color white
</style>
