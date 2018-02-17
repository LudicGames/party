<template lang="pug">
  #game-page
    ludic-app(:app="app", use-ludic-ui, full-window)
</template>

<script>
import PartyApp from '@/game'
export default {
  name: 'GamePage',
  data(){
    return {
      app: PartyApp,
    }
  },
  methods: {
  },
}
</script>

<style lang="stylus">
</style>
