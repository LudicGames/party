import {Screen} from 'ludic'
import LobbyScreenUI from '@/game/components/LobbyScreen'

export default class LobbyScreen extends Screen {
  constructor(){
    super()
  }

  onAddedToManager(manager){
    this.lobbyScreen = this.$mapMethods(new LobbyScreenUI(this.$app), {
      'onClick': 'onClick',
    })
    this.$app.$ui.$children.push(this.lobbyScreen)
  }

  onClick([component, number]){
    console.log(number)
    this.finish({
      playerNum: number,
    })
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
