import {LudicApp, Camera, ScreenManager} from 'ludic'
import {UIText, UILayer} from 'ludic-vue'

import SplashScreen from '@/game/screens/splashScreen'
import LobbyScreen from '@/game/screens/lobbyScreen'
import ScoreScreen from '@/game/screens/scoreScreen'
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

    this.screenManager.addScreen(new KingScreen({
      players: [
        {
          color: 'red',
          ready: true,
          score: 0,
        },
        {
          color: 'red',
          ready: true,
          score: 30,
        },
        {
          color: 'green',
          ready: true,
          score: 10,
        },
        {
          color: 'green',
          ready: true,
          score: 0,
        }
      ],
      teams: [
        {
          color: 'red',
          players: [
            {
              score: 20,
            },
            {
              score: 30,
            },
          ]
        },
        {
          color: 'green',
          players: [
            {
              score: 20,
            },
            {
              score: 60,
            },
          ]
        }
      ],
    }))
  }

  onScreenFinished(screen, manager, data){
    if(screen.constructor.name == "SplashScreen"){
      this.screenManager.addScreen(new LobbyScreen(data.teamsEnabled))
    } else if(screen.constructor.name == "ScoreScreen"){
      // filter out our current screen from contention
      let nextScreens = this.gameScreens.filter(gs => gs.name != screen.constructor.name)
      let rand = Math.floor(Math.random() * Math.floor(nextScreens.length))
      let nextScreen = new nextScreens[rand](data)
      this.screenManager.addScreen(nextScreen)
    }
    else {
      // Show the score screen for 5 seconds
      this.screenManager.addScreen(new ScoreScreen(data))
    }
  }

  update(delta, time){
    this.screenManager.update(delta, time)
  }
}
