routes.$inject = ['$stateProvider']

export default function routes($stateProvider) {
  $stateProvider
    .state('leaderboard', {
      url: '/leaderboard',
      template: require('./leaderboard.pug')(),
      controller: 'LeaderboardController',
      controllerAs: 'leaderboard'
    })
}
