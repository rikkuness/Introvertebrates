import Auth0Lock from 'auth0-lock'

class UserCtrl {
  constructor($http) {
    this._http = $http
    this.getUser().then(res => this.user = res.data)
  }

  getUser() {
    let self = this
    return this._http.get('/api/user')
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
          primaryColor: '#4E9C68'
        },
        languageDictionary: {
          title: 'Members Login'
        }
      })
      lock.show()
    })
  }
}

export default UserCtrl