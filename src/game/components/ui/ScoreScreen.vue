<template lang="pug">
  #score-screen
    h1 Score

    .score
      .teams(v-if="teams")
        .team(v-for="team in teams")
          .score-block(:style="{'background-color': team.color}")
            span {{team.players[0].score + team.players[1].score}}

      .ffa(v-else)
        .player(v-for="player in players")
          .score-block(:style="{'background-color': player.color}")
            span {{player.score}}

</template>

<script>
import {LudicComponent} from 'ludic-vue'

export default LudicComponent.extend({
  name: 'ScoreScreen',
  data(){
    return {
      ready: false,
      teams: null,
      players: []
    }
  },
  ludicInput(){
    return {
      inputListener: {
        methods: {
          cross: this.start,
        },
      },
    }
  },
  methods: {
    start(down, {gameIndex}){
      if(!down){
        this.$ludicEmit('onReady')
      }
    }
  },
  mounted(){
    this.players = this.componentArgs[0].players
    this.teams = this.componentArgs[0].teams
  },
})
</script>

<style lang="stylus">
#score-screen
  height 100%
  background linear-gradient(to right, #feac5e, #c779d0, #4bc0c8)
  font-family 'Permanent Marker', cursive

  h1
    text-align center
    color white
    font-size 9em
    margin 0
    padding-top .5em
    padding-bottom 1em


  .ffa
    display flex
    flex-basis 100%
    margin-right 20%
    margin-left 20%
    align-content center
    justify-content space-around

 .teams
    display flex
    flex-basis 100%
    margin-right 20%
    margin-left 20%
    align-content center
    justify-content space-around

  .score-block
    padding 3em
    span
      font-size 4em
      color white

</style>
