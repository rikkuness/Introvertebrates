import angular from 'angular'
import uirouter from 'angular-ui-router'

import './species.css'

import routing from './species.routes'
import SpeciesController from './species.controller'

SpeciesController.$$ngIsClass = true

export default angular.module('trackwild.species', [uirouter])
  .config(routing)
  .controller('SpeciesController', SpeciesController)
  .name
