import Auth0Lock from 'auth0-lock'

export default class HomeController {
  constructor($http) {
    this._http = $http
    this.key = ''
  }

  login() {
    this._http.get('/auth').then(res => {
      let lock = new Auth0Lock(res.data.clientID, res.data.domain, {
        auth: {
          redirectUrl: res.data.callbackURL,
          responseType: 'code',
          params: {
            scope: 'openid name email picture'
          }
        },
        theme: {
          primaryColor: '#345a6d'
        },
        languageDictionary: {
          title: 'Member Login'
        }
      })
      lock.show()
    })
  }
}
