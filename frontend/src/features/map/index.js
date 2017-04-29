import angular from 'angular'
import uirouter from 'angular-ui-router'

import './map.css'

import routing from './map.routes'
import HomeController from './map.controller'

HomeController.$$ngIsClass = true

export default angular.module('app.map', [uirouter])
  .config(routing)
  .controller('HomeController', HomeController)
  .name
