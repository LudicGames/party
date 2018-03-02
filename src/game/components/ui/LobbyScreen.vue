<template lang="pug">
  #lobby-screen
    lobby-card(v-for="n in 4", ref="players", :player="players[n-1]", :teams-enabled="teamsEnabled", :key="n", @mousedown.native="cross(true,{gamepadIndex:n-1})", @mouseup.native="cross(false,{gamepadIndex:n-1})")
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
      teamsEnabled: false,
      colors: ['#c0392b', '#8e44ad', '#2980b9', '#27ae60'],
      players: [
        {
          color: '#c0392b',
          ready: false,
        },
        {
          color: '#8e44ad',
          ready: false,
        },
        {
          color: '#2980b9',
          ready: false,
        },
        {
          color: '#27ae60',
          ready: false,
        },
      ],
    }
  },
  computed: {
    numPlayersReady(){
      return this.players.reduce((total, player) => total =+ player.ready ? 1 : 0, 0)
    },
    teams(){
      return this.players.reduce((teams, player)=>{
        // find an existing team
        let team = teams.find(team => team.color == player.color)
        if(team){
          team.players.push(player)
        } else {
          teams.push({
            color: player.color,
            players: [player],
          })
        }
        return teams
      },[])
    },
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
  mounted(){
    let [{teamsEnabled}] = this.componentArgs
    this.teamsEnabled = teamsEnabled
  },
  methods: {
    cross(down, {gamepadIndex}){
      let player = this.players[gamepadIndex]
      if(!down){
        if(player.ready && !this.ready){
          this.$ludicEmit('onReady', {
            players: this.players,
            teams: this.teams,
          })
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
      if(!down && !player.ready && this.teamsEnabled){
        player.color = this.getNextColor(player.color)
      }
    },

    getNextColor(color){
      let ix = this.colors.findIndex(c => c == color)
      if(ix+1 >= this.colors.length){
        ix = 0
      } else {
        ix++
      }
      return this.colors[ix]
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
