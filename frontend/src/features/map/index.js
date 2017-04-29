import angular from 'angular'
import uirouter from 'angular-ui-router'
import 'angular-simple-logger'
import 'leaflet'
import 'ui-leaflet'

import './map.css'
import 'leaflet/dist/leaflet.css'

import routing from './map.routes'

import MapController from './map.controller'
MapController.$$ngIsClass = true

export default angular.module('app.map', [uirouter, 'nemLogging', 'ui-leaflet'])
  .config(routing)
  .controller('MapController', MapController)
  .name
