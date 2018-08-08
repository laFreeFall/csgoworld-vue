import axios from 'axios'

const state = {
  items: [],
  itemsLoaded: false,
  pagination: {
    perPage: 25,
    currentPage: 1,
    begin: 0,
    end: 25
  },
  crates: null,
  cratesFilter: '',
  qualities: [],
  modalItem: {},
  filteredPaginatedItemsAmount: 0,
  itemsSearchFilter: '',
  itemsQualityFilter: null,
  exteriors: []
}

const getters = {
  items (state) {
    return state.items
  },

  itemsLoaded (state) {
    return state.itemsLoaded
  },

  paginated (state) {
    let items = state.items
    if (state.itemsQualityFilter) {
      items = state.items.filter((item) => {
        return (item.item.quality.id === state.itemsQualityFilter.qualityId && item.item.stattrak === +state.itemsQualityFilter.stattrak && item.item.souvenir === +state.itemsQualityFilter.souvenir)
      })
    }
    if (state.itemsSearchFilter !== '') {
      items = items.filter((item) => {
        let itemFeature = ''
        if (item.item.stattrak) {
          itemFeature = 'Stattrak '
        } else if (item.item.souvenir) {
          itemFeature = 'Souvenir '
        }
        let fullItemTitle = `${itemFeature} ${item.item.weapon.title} ${item.item.pattern.title}`
        return fullItemTitle.toLowerCase().includes(state.itemsSearchFilter.toLowerCase())
      })
      return {
        amount: items.length,
        items: items.slice(state.pagination.begin, state.pagination.end)
      }
    }
    return {
      amount: items.length,
      items: items.slice(state.pagination.begin, state.pagination.end)
    }
  },

  itemsPrice (state) {
    return state.items.reduce((a, b) => { return a + b.item['price'] }, 0)
  },

  exteriors (state) {
    return state.exteriors
  },

  pagination (state) {
    return state.pagination
  },

  modalItem (state) {
    return state.modalItem
  },

  crates (state) {
    return state.crates
  },

  containers (state) {
    return state.crates ? state.crates.containers : null
  },

  collections (state) {
    return state.crates ? state.crates.collections : null
  },

  cratesFilter (state) {
    return state.cratesFilter
  },

  qualities (state) {
    return state.qualities
  }
}

const actions = {
  fetchItems ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/inventory')
      .then(function (response) {
        commit('FETCH_ITEMS', response.data.items)
        commit('FETCH_EXTERIORS', response.data.exteriors)
        resolve(response)
      })
      .catch(function (error) {
        reject(error)
      })
    })
  },

  clearItems ({ commit }) {
    commit('CLEAR_ITEMS')
  },

  deleteUserItem ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.post('/api/user/delete-item', payload)
      .then(function (response) {
        commit('DELETE_USER_ITEM', payload)
        resolve(response)
      })
      .catch(function (error) {
        reject(error)
      })
    })
  },

  addItemToUser ({ commit }, payload) {
    commit('ADD_ITEM_TO_USER', payload)
  },

  removeItemsFromUser ({ commit }, payload) {
    commit('REMOVE_ITEMS_FROM_USER', payload.ids)
  },

  changePaginationPage ({ commit }, payload) {
    commit('CHANGE_PAGINATION_PAGE', payload)
  },

  changeItemsSearchFilter ({ commit }, payload) {
    commit('CHANGE_ITEMS_SEARCH_FILTER', payload)
  },

  setModalItem ({ commit }, payload) {
    commit('SET_MODAL_ITEM', payload)
  },

  changeItemsQualityFilter ({ commit }, payload) {
    commit('CHANGE_ITEMS_QUALITY_FILTER', payload)
  },

  fetchCrates ({ commit }) {
    axios.get('/api/cases')
    .then((response) => {
      commit('FETCH_CRATES', response.data)
      commit('TOGGLE_CRATES_FILTER', 'containers')
    })
    .catch((error) => {
      console.log(error)
    })
  },

  fetchQualities ({ commit }) {
    axios.get('/api/contracts')
    .then((response) => {
      commit('FETCH_QUALITIES', response.data)
    })
    .catch(function (error) {
      console.log(error)
    })
  },
  toggleCratesFilter ({ commit }) {
    commit('TOGGLE_CRATES_FILTER')
  }
}

const mutations = {
  FETCH_ITEMS (state, payload) {
    state.items = payload
    state.filteredPaginatedItemsAmount = payload.length
    state.itemsLoaded = true
    // console.log(state.items)
  },

  CLEAR_ITEMS (state) {
    state.items = []
    state.itemsLoaded = false
    state.filteredPaginatedItemsAmount = 0
  },

  FETCH_EXTERIORS (state, payload) {
    state.exteriors = payload
  },

  DELETE_USER_ITEM (state, payload) {
    // console.log(`deleting user item in vuex store.js with pivot id ${payload.id}`)
    let itemToDeleteIndex = state.items.findIndex((item) => { return item.id === payload.id })
    let itemToDelete = state.items[itemToDeleteIndex]
    let user = JSON.parse(window.localStorage.getItem('user'))
    if (itemToDelete.item.price >= 1) {
      user.data.diamonds += Math.floor(itemToDelete.item.price)
      state.user.data.diamonds += Math.floor(itemToDelete.item.price)
    }
    user.data.balance -= itemToDelete.price
    window.localStorage.setItem('user', JSON.stringify(user))
    state.user.data.balance -= itemToDelete.item.price
    // state.items = state.items.filter((item) => item.pivot.id !== payload.id)
    state.items.splice(itemToDeleteIndex, 1)
  },

  ADD_ITEM_TO_USER (state, payload) {
    let binSearch = () => {
      let low = 0
      let high = state.items.length
      let mid = -1
      let c = 0
      while (low < high) {
        mid = parseInt((low + high) / 2)
        c = state.items[mid].item.price - payload.item.price
        if (c > 0) {
          low = mid + 1
        } else if (c < 0) {
          high = mid
        } else {
          return mid
        }
      }
      return low
    }
    let index = binSearch()
    state.items.splice(index, 0, payload)
  },

  REMOVE_ITEMS_FROM_USER (state, payload) {
    state.items = state.items.filter(item => { return payload.indexOf(item.id) === -1 })
  },

  CHANGE_PAGINATION_PAGE (state, payload) {
    state.pagination.begin = (payload - 1) * state.pagination.perPage
    state.pagination.end = (payload - 1) * state.pagination.perPage + state.pagination.perPage
    // console.log(`start: ${state.pagination.begin}`)
    // console.log(`end: ${state.pagination.end}`)
    state.pagination.currentPage = payload
  },

  CHANGE_ITEMS_SEARCH_FILTER (state, payload) {
    state.itemsSearchFilter = payload
  },

  SET_MODAL_ITEM (state, payload) {
    state.modalItem = payload
  },

  CHANGE_ITEMS_QUALITY_FILTER (state, payload) {
    state.itemsQualityFilter = payload
  },

  FETCH_CRATES (state, payload) {
    state.crates = {}
    state.crates.containers = payload.containers
    state.crates.collections = payload.collections
  },

  FETCH_QUALITIES (state, payload) {
    state.qualities = payload
  },

  TOGGLE_CRATES_FILTER (state) {
    state.cratesFilter = state.cratesFilter === 'containers' ? 'collections' : 'containers'
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
