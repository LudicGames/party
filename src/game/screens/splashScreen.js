import {Screen} from 'ludic'
import SplashScreenUI from '$ui/SplashScreen'

import {World} from 'ludic-box2d'

export default class SplashScreen extends Screen {
  constructor(){
    super()
  }

  onAddedToManager(manager){
    this.splashScreen = this.$mapMethods(new SplashScreenUI(this.$app), {
      'onReady': 'onReady',
    })
    this.$app.$ui.$refs.splashScreen = this.splashScreen
  }

  onReady([component, teamsEnabled]){
    this.finish({teamsEnabled})
  }

  onDestroy(){
    delete this.$app.$ui.$refs.splashScreen
  }

  update(time, delta){
    let ctx = this.$app.$context

    this.$app.$input.update()
    this.$app.$canvas.clear()
  }
}
