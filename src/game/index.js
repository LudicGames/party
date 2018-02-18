import {LudicApp, Camera, ScreenManager} from 'ludic'
import {UIText, UILayer} from 'ludic-vue'

import LobbyScreen from '@/game/screens/lobbyScreen'
import GameScreen from '@/game/screens/gameScreen'

export default class PartyApp extends LudicApp {
  constructor(cfg) {
    super(cfg)

    this.screenManager = new ScreenManager(this)
    this.screenManager.addScreenEventListener(this)
    this.screenManager.addScreen(new LobbyScreen())
    // this.screenManager.addScreen(new GameScreen())
  }

  onScreenFinished(screen, manager, data){
    manager.popScreen()
  }

  update(delta, time){
    this.screenManager.update(delta, time)
  }
}
