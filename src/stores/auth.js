import { observable, action } from 'mobx'

class Auth {
  @observable user = null
  @observable initialized = false
  
  @action setUser = (user) => {
    this.user = user
    this.initialized = true
  }
}

export default new Auth()
