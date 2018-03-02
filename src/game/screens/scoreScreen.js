import {Screen} from 'ludic'
import ScoreScreenUI from '$ui/ScoreScreen'

import {World} from 'ludic-box2d'

export default class ScoreScreen extends Screen {
  constructor(data){
    super()
    this.players = data.players
    this.teams = data.teams
  }

  onAddedToManager(manager){
    this.scoreScreen = this.$mapMethods(new ScoreScreenUI({players: this.players, teams: this.teams}), {
      'onReady': 'onReady',
    })
    this.$app.$ui.$refs.scoreScreen = this.scoreScreen
  }

  onReady(){
    this.finish({players: this.players, teams: this.teams})
  }

  onDestroy(){
    delete this.$app.$ui.$refs.scoreScreen
  }

  update(){
    this.$app.$input.update()
  }
}
