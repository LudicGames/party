import {Screen} from 'ludic'
import LobbyScreenUI from '$ui/LobbyScreen'

import {World} from 'ludic-box2d'

export default class LobbyScreen extends Screen {
  constructor(){
    super()
    this.world = new World(0,-9.8)
  }

  onAddedToManager(manager){
    this.lobbyScreen = this.$mapMethods(new LobbyScreenUI(this.$app), {
      'onReady': 'onReady',
    })
    this.$app.$ui.$children.push(this.lobbyScreen)
  }

  onReady([component, players]){
    console.log(players)
    // this.finish({
    //   playerNum: number,
    // })
  }

  onDestroy(){
    console.log('on onDestroy')
    this.$app.$ui.$children = []
  }

  update(time, delta){
    let ctx = this.$app.$context

    this.$app.$input.update()
    this.$app.$canvas.clear('black')
  }
}
