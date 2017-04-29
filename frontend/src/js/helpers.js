class UserCtrl {
  constructor($http) {
    this._http = $http
  }

  getUser() {
    let self = this
    return this._http.get('/api/user')
  }
}

export default UserCtrl