import {LudicApp, Camera, ScreenManager} from 'ludic'
import {UIText, UILayer} from 'ludic-vue'

import SplashScreen from '@/game/screens/splashScreen'
import LobbyScreen from '@/game/screens/lobbyScreen'
import TrackingScreen from '@/game/screens/trackingScreen'

// Games
import KingScreen from '@/game/screens/kingScreen'
import SoccerScreen from '@/game/screens/soccerScreen'
import SumoScreen from '@/game/screens/sumoScreen'


export default class PartyApp extends LudicApp {
  constructor(cfg) {
    super(cfg)
    this.screenManager = new ScreenManager(this)
    this.screenManager.addScreenEventListener(this)

    this.gameScreens = [
      KingScreen,
      SoccerScreen,
      SumoScreen,
    ]

    // Start on the SplashScreen
    // this.screenManager.addScreen(new SplashScreen())

    // TODO remove
    this.screenManager.addScreen(new SoccerScreen({
      players: [
        {
          color: 'red',
          ready: true
        },
        {
          color: 'blue',
          ready: true
        }
      ]
    }))
  }

  onScreenFinished(screen, manager, data){
    if(screen.constructor.name == "SplashScreen"){
      this.screenManager.addScreen(new LobbyScreen(data.teamsEnabled))
    } else {
      let rand = Math.floor(Math.random() * Math.floor(this.gameScreens.length))
      let nextScreen = new this.gameScreens[rand](data)
      this.screenManager.addScreen(nextScreen)
    }
  }

  update(delta, time){
    this.screenManager.update(delta, time)
  }
}
