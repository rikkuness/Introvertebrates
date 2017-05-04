// Import CSS
import 'material-design-lite/dist/material.blue_grey-deep_purple.min.css'
import './css/style.css'

// Libraries
import angular from 'angular'
import uirouter from 'angular-ui-router'
import resource from 'angular-resource'
import spinner from 'angular-spinners'

import 'material-design-lite'
import 'material-design-icons/iconfont/material-icons.css'

import 'typeface-roboto'

import 'moment'
import moment from 'angular-moment'

// Angular configuration options
import routing from './app.config'

// Helper functions
import UserCtrl from './js/helpers'
UserCtrl.$$ngIsClass = true

// Load all features
import home from './features/home'
import species from './features/species'
import map from './features/map'
import upload from './features/upload'
import leaderboard from './features/leaderboard'

angular.module('trackwild', [uirouter, moment, resource, home, species, map, upload, leaderboard, spinner])
  .controller('UserCtrl', UserCtrl)
  .config(routing)
