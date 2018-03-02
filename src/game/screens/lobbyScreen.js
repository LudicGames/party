import {Screen} from 'ludic'
import LobbyScreenUI from '$ui/LobbyScreen'

import {World} from 'ludic-box2d'

export default class LobbyScreen extends Screen {
  constructor(teamsEnabled){
    super()
    this.teamsEnabled = teamsEnabled
  }

  onAddedToManager(manager){
    this.lobbyScreen = this.$mapMethods(new LobbyScreenUI({teamsEnabled: this.teamsEnabled}), {
      'onReady': 'onReady',
    })
    this.$app.$ui.$refs.lobby = this.lobbyScreen
  }

  onReady([component, data]){
    data.players = data.players.filter(p => p.ready)
    this.finish(data)
  }

  onDestroy(){
    delete this.$app.$ui.$refs.lobby
  }

  update(time, delta){
    let ctx = this.$app.$context

    this.$app.$input.update()
    this.$app.$canvas.clear('black')
  }
}
