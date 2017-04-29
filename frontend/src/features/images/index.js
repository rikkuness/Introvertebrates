import angular from 'angular'
import uirouter from 'angular-ui-router'

import './images.css'

import routing from './images.routes'
import ImageController from './images.controller'

ImageController.$$ngIsClass = true

export default angular.module('trackwild.images', [uirouter])
  .config(routing)
  .controller('ImageController', ImageController)
  .name
