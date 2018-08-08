import Vue from 'vue'

const state = {
  user: {
    auth: null,
    data: null
  },
  isUserLogged: false
}

const getters = {
  user (state) {
    return state.user
  },

  userAuth (state) {
    return state.user.auth
  },

  userData (state) {
    return state.user.data
  },

  isUserLogged (state) {
    return state.isUserLogged
  }
}

const actions = {
  fetchUserAuth ({ commit }, payload) {
    commit('FETCH_USER_AUTH', payload)
  },

  fetchUserData ({ commit }, payload) {
    commit('FETCH_USER_DATA', payload)
  },

  fetchUser ({ commit }, payload) {
    commit('FETCH_USER', payload)
  },

  logOut ({ commit }) {
    window.localStorage.removeItem('user')
    commit('LOG_OUT')
  },

  increaseUserBalance ({ commit }, payload) {
    commit('INCREASE_USER_BALANCE', payload)
  },

  increaseUserDiamonds ({ commit }, payload) {
    commit('INCREASE_USER_DIAMONDS', payload)
  }
}

const mutations = {
  FETCH_USER_AUTH (state, payload) {
    if (state.user === null) {
      state.user = {
        auth: payload
      }
    } else {
      Vue.set(state.user, 'auth', payload)
    }
  },

  FETCH_USER_DATA (state, payload) {
    if (state.user === null) {
      state.user = {
        data: payload
      }
    } else {
      Vue.set(state.user, 'data', payload)
    }
    state.isUserLogged = true
  },

  FETCH_USER (state, payload) {
    state.user = payload
    if (payload) {
      state.isUserLogged = true
    }
  },

  LOG_OUT (state) {
    state.user = {}
    state.isUserLogged = false
  },

  INCREASE_USER_BALANCE (state, payload) {
    let user = JSON.parse(window.localStorage.getItem('user'))
    user.data.balance += payload
    window.localStorage.setItem('user', JSON.stringify(user))
    state.user.data.balance += payload
  },

  INCREASE_USER_DIAMONDS (state, payload) {
    let user = JSON.parse(window.localStorage.getItem('user'))
    user.data.diamonds += payload
    window.localStorage.setItem('user', JSON.stringify(user))
    state.user.data.diamonds += payload
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
