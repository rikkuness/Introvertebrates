import angular from 'angular'
import uirouter from 'angular-ui-router'

import './leaderboard.css'

import routing from './leaderboard.routes'
import LeaderboardController from './leaderboard.controller'

LeaderboardController.$$ngIsClass = true

export default angular.module('trackwild.leaderboard', [uirouter])
  .config(routing)
  .controller('LeaderboardController', LeaderboardController)
  .name
