import {LudicApp, Camera, ScreenManager} from 'ludic'
import {UIText, UILayer} from 'ludic-vue'

import LobbyScreen from '@/game/screens/lobbyScreen'
import GameScreen from '@/game/screens/gameScreen'
import KingScreen from '@/game/screens/kingScreen'
import SoccerScreen from '@/game/screens/soccerScreen'
import TrackingScreen from '@/game/screens/trackingScreen'
import SumoScreen from '@/game/screens/sumoScreen'

export default class PartyApp extends LudicApp {
  constructor(cfg) {
    super(cfg)

    this.screenManager = new ScreenManager(this)
    this.screenManager.addScreenEventListener(this)
    // this.screenManager.addScreen(new LobbyScreen())
    // this.screenManager.addScreen(new GameScreen())
    // this.screenManager.addScreen(new KingScreen([{color: '#6FC3DF', ready: true}, {color: '#FFE64D', ready: true}]))
    // this.screenManager.addScreen(new SoccerScreen([{color: '#6FC3DF', ready: true}, {color: '#FFE64D', ready: true}]))
    this.screenManager.addScreen(new SumoScreen([{color: '#6FC3DF', ready: true}, {color: '#FFE64D', ready: true}]))
  }

  onScreenFinished(screen, manager, data){
    manager.addScreen(new KingScreen(data.players), true)
  }

  update(delta, time){
    this.screenManager.update(delta, time)
  }
}
