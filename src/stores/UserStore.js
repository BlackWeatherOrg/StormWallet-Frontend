import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    _isAdmin: false,
    _isAuth: false,
    _isProf: false,
    _isStud: false,
    _user: {},
    _isEmail: {},
    _userid: {},
  }),

  actions: {
    setIsEmail(email) {
      this._isEmail = email
    },
    setIsAdmin(bool) {
      this._isAdmin = bool
    },
    setIsProf(bool) {
      this._isProf = bool
    },
    setIsStud(bool) {
      this._isStud = bool
    },
    setIsAuth(bool) {
      this._isAuth = bool
    },
    setUser(user) {
      this._user = user
    },
    setUserId(id) {
      this._userid = id
    },
  },

  getters: {
    isAdmin() {
      return this._isAdmin
    },
    userID() {
      return this._userid
    },
    isProf() {
      return this._isProf
    },
    isStud() {
      return this._isStud
    },
    isAuth() {
      return this._isAuth
    },
    user() {
      return this._user
    },
    isEmail() {
      return this._isEmail
    },
  },
})
