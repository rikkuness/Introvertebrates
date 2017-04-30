import angular from 'angular'
import uirouter from 'angular-ui-router'

import './upload.css'

import routing from './upload.routes'
import UploadController from './upload.controller'

UploadController.$$ngIsClass = true

export default angular.module('trackwild.upload', [uirouter])
  .config(routing)
  .controller('UploadController', UploadController)
  .name
