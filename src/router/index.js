import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home/Home'
import OpenCase from '@/components/OpenCase/OpenCase'
import Cases from '@/components/Cases/Cases'
import News from '@/components/News/News'
import Auth from '@/components/Auth/Auth'
import Inventory from '@/components/Inventory/Inventory'
import Roulette from '@/components/Roulette/Roulette'
import Contracts from '@/components/Contracts/Contracts'
import Contract from '@/components/Contracts/Contract'
import Coinflip from '@/components/Coinflip/Coinflip'
import CasesInfo from '@/components/Cases/Info'
import RouletteInfo from '@/components/Roulette/Info'
import ContractsInfo from '@/components/Contracts/Info'
import CoinflipInfo from '@/components/Coinflip/Info'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: 'Home page'
      }
    },

    {
      path: '/open/:type/:id',
      name: 'OpenCase',
      component: OpenCase,
      meta: {
        requiresAuth: true,
        title: 'Opening case'
      }
    },

    {
      path: '/cases',
      name: 'Cases',
      component: Cases,
      meta: {
        title: 'Cases'
      }
    },

    {
      path: '/inventory',
      name: 'Inventory',
      component: Inventory,
      meta: {
        requiresAuth: true,
        title: 'Inventory'
      }
    },

    {
      path: '/news',
      name: 'News',
      component: News,
      meta: {
        requiresAuth: true,
        title: 'News'
      }
    },

    {
      path: '/roulette',
      name: 'Roulette',
      component: Roulette,
      meta: {
        requiresAuth: true,
        title: 'Roulette'
      }
    },

    {
      path: '/contracts',
      name: 'Contracts',
      component: Contracts,
      props: {
        default: true
      },
      meta: {
        requiresAuth: true,
        title: 'Contracts'
      }
    },

    {
      path: '/contract/:qualityId',
      name: 'Contract',
      component: Contract,
      meta: {
        requiresAuth: true,
        title: 'Trade-Up Contract'
      }
    },

    {
      path: '/coinflip',
      name: 'Coinflip',
      component: Coinflip,
      meta: {
        requiresAuth: true,
        title: 'Coinflip'
      }
    },

    {
      path: '/auth/:action',
      name: 'Auth',
      component: Auth,
      props: true,
      meta: {
        title: 'Auth Page'
      }
    },

    {
      path: '*',
      redirect: '/'
    },

    {
      path: '/cases/info',
      name: 'CasesInfo',
      component: CasesInfo,
      meta: {
        requiresAuth: true,
        title: 'Cases Info'
      }
    },

    {
      path: '/roulette/info',
      name: 'RouletteInfo',
      component: RouletteInfo,
      meta: {
        requiresAuth: true,
        title: 'Roulette Info'
      }
    },

    {
      path: '/contracts/info',
      name: 'ContractsInfo',
      component: ContractsInfo,
      meta: {
        requiresAuth: true,
        title: 'Contracts Info'
      }
    },

    {
      path: '/coinflip/info',
      name: 'CoinflipInfo',
      component: CoinflipInfo,
      meta: {
        requiresAuth: true,
        title: 'Coinflip Info'
      }
    }
  ]
})
