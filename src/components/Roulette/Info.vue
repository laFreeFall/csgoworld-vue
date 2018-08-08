<template>
  <div>
    <div class="container">
      <div class="row col-md-12">
        <h2 class="text-center">
          Roulette stats
        </h2>
        <div v-if="!dataLoaded">
          <app-loader loadingText="Data is loading..."></app-loader>
        </div>
        <div
          v-else
          class="col-md-12"
        >
          <div class="row">
            <div class="stats-table-wrap col-md-10 col-md-offset-1">
              <table class="table table-bordered stats-table">
                <thead>
                <tr>
                  <td class="col-md-2"></td>
                  <td class="col-md-2">Total</td>
                  <td class="col-md-2">Won</td>
                  <td class="col-md-2">Lost</td>
                  <td class="col-md-2">Result</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td class="stats-table-description">
                    Bets made
                  </td>
                  <td class="stats-table-numbers">
                    <animate-number
                      :from="animateNumbers.initial"
                      :to="stats.bets.total"
                      :duration="animateNumbers.duration"
                      easing="easeOutQuad"
                    >
                    </animate-number>
                    <i class="fa fa-trophy"></i>
                  </td>
                  <td
                    class="stats-table-numbers stats-table-numbers-colored"
                    :style="{ backgroundColor: colors.third.color }"
                  >
                    <animate-number
                      :from="animateNumbers.initial"
                      :to="stats.bets.won"
                      :duration="animateNumbers.duration"
                      easing="easeOutQuad"
                    >
                    </animate-number>
                    <i class="fa fa-trophy"></i>
                  </td>
                  <td
                    class="stats-table-numbers stats-table-numbers-colored"
                    :style="{ backgroundColor: colors.first.color }"
                  >
                    <animate-number
                      :from="animateNumbers.initial"
                      :to="stats.bets.lost"
                      :duration="animateNumbers.duration"
                      easing="easeOutQuad"
                    >
                    </animate-number>
                    <i class="fa fa-trophy"></i>
                  </td>
                  <td
                    class="stats-table-numbers stats-table-numbers-colored"
                    :style="{ backgroundColor: stats.bets.result > 0 ? colors.third.color : colors.first.color }"
                  >
                    <animate-number
                      :from="animateNumbers.initial"
                      :to="Math.abs(stats.bets.result)"
                      :duration="animateNumbers.duration"
                      easing="easeOutQuad"
                    >
                    </animate-number>
                    <i class="fa fa-trophy"></i>
                  </td>
                </tr>
                <tr>
                  <td class="stats-table-description">
                    Diamonds bet
                  </td>
                  <td class="stats-table-numbers">
                    <animate-number
                      :from="animateNumbers.initial"
                      :to="stats.diamonds.total"
                      :duration="animateNumbers.duration"
                      easing="easeOutQuad"
                    >
                    </animate-number>
                    <i class="fa fa-diamond"></i>
                  </td>
                  <td
                    class="stats-table-numbers stats-table-numbers-colored"
                    :style="{ backgroundColor: colors.third.color }"
                  >
                    <animate-number
                      :from="animateNumbers.initial"
                      :to="stats.diamonds.won"
                      :duration="animateNumbers.duration"
                      easing="easeOutQuad"
                    >
                    </animate-number>
                    <i class="fa fa-diamond"></i>
                  </td>
                  <td
                    class="stats-table-numbers stats-table-numbers-colored"
                    :style="{ backgroundColor: colors.first.color }"
                  >
                    <animate-number
                      :from="animateNumbers.initial"
                      :to="stats.diamonds.lost"
                      :duration="animateNumbers.duration"
                      easing="easeOutQuad"
                    >
                    </animate-number>
                    <i class="fa fa-diamond"></i>
                  </td>
                  <td
                    class="stats-table-numbers stats-table-numbers-colored"
                    :style="{ backgroundColor: stats.diamonds.result > 0 ? colors.third.color : colors.first.color }"
                  >
                    <animate-number
                      :from="animateNumbers.initial"
                      :to="Math.abs(stats.diamonds.result)"
                      :duration="animateNumbers.duration"
                      easing="easeOutQuad"
                    >
                    </animate-number>
                    <i class="fa fa-diamond"></i>
                  </td>
                </tr>
                <tr>
                  <td class="stats-table-description">
                    Maximum bet
                  </td>
                  <td class="stats-table-numbers">
                    <animate-number
                      :from="animateNumbers.initial"
                      :to="stats.max.bet || 0"
                      :duration="animateNumbers.duration"
                      easing="easeOutQuad"
                    >
                    </animate-number>
                    <i class="fa fa-diamond"></i>
                  </td>
                  <td
                    class="stats-table-numbers stats-table-numbers-colored"
                    :style="{ backgroundColor: colors.third.color }"
                  >
                    <animate-number
                      :from="animateNumbers.initial"
                      :to="stats.max.won || 0"
                      :duration="animateNumbers.duration"
                      easing="easeOutQuad"
                    >
                    </animate-number>
                    <i class="fa fa-diamond"></i>
                  </td>
                  <td
                    class="stats-table-numbers stats-table-numbers-colored"
                    :style="{ backgroundColor: colors.first.color }"
                  >
                    <animate-number
                      :from="animateNumbers.initial"
                      :to="stats.max.lost || 0"
                      :duration="animateNumbers.duration"
                      easing="easeOutQuad"
                    >
                    </animate-number>
                    <i class="fa fa-diamond"></i>
                  </td>
                  <td
                    class="stats-table-numbers stats-table-numbers-colored"
                    :style="{ backgroundColor: stats.max.result > 0 ? colors.third.color : colors.first.color }"
                  >
                    <animate-number
                      :from="animateNumbers.initial"
                      :to="Math.abs(stats.max.result)"
                      :duration="animateNumbers.duration"
                      easing="easeOutQuad"
                    >
                    </animate-number>
                    <i class="fa fa-diamond"></i>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h2 class="text-center">
            Roulette bets
          </h2>
          <div class="row">
            <div class="logs-table-wrap col-md-10 col-md-offset-1">
              <table
                class="table table-bordered logs-table"
                :class="logsLoaded ? '' : 'logs-table-loading'"
              >
                <thead>
                <tr>
                  <td
                    @click="sortBy('roll_id')"
                    class="col-md-1 sortable"
                  >
                    Roll ID
                    <span
                      class="pull-right sort-arrow"
                      v-show="sort.hasOwnProperty('roll_id') && sort.current === 'roll_id'"
                      :style="{ transform: sort.roll_id ? 'rotateX(180deg)' : 'rotateX(0deg)' }"
                    >
                    &uarr;
                  </span>
                  </td>
                  <td
                    @click="sortBy('created_at')"
                    class="col-md-2 sortable"
                  >
                    Time
                    <span
                      class="pull-right sort-arrow"
                      v-show="sort.hasOwnProperty('created_at') && sort.current === 'created_at'"
                      :style="{ transform: sort.created_at ? 'rotateX(180deg)' : 'rotateX(0deg)' }"
                    >
                    &uarr;
                  </span>
                  </td>
                  <td
                    @click="sortBy('amount')"
                    class="col-md-2 sortable"
                  >
                    Bet Amount
                    <span
                      class="pull-right sort-arrow"
                      v-show="sort.hasOwnProperty('amount') && sort.current === 'amount'"
                      :style="{ transform: sort.amount ? 'rotateX(180deg)' : 'rotateX(0deg)' }"
                    >
                    &uarr;
                  </span>
                  </td>
                  <td class="col-md-2">
                    Bet Color
                  </td>
                  <td class="col-md-2">
                    Roll Result
                  </td>
                  <td
                    @click="sortBy('profit')"
                    class="col-md-2 sortable"
                  >
                    Profit
                    <span
                      class="pull-right sort-arrow"
                      v-show="sort.hasOwnProperty('profit') && sort.current === 'profit'"
                      :style="{ transform: sort.profit ? 'rotateX(180deg)' : 'rotateX(0deg)' }"
                    >
                    &uarr;
                  </span>
                  </td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="log in logs">
                  <td>
                    {{ log.roll_id }}
                  </td>
                  <td>
                    {{ log.created_at || '2017.12.12 10:10' }}
                  </td>
                  <td class="table-amount">
                    {{ log.amount }}
                    <i class="fa fa-diamond"></i>
                  </td>
                  <td
                    class="table-roulette-color"
                    :style="{ backgroundColor: colors[log.color].color }"
                  >
                    {{ colors[log.color].diapason }}
                  </td>
                  <td
                    class="table-roulette-color"
                    :style="{ backgroundColor: colors[log.roll.color].color }"
                  >
                    {{ log.roll.number }}
                  </td>
                  <td
                    class="table-profit"
                    :style="{ color: log.income ? 'green' : 'red' }"
                  >
                    {{ log.profit > 0 ? `+${log.profit}` : log.profit }}
                    <i class="fa fa-diamond"></i>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

            <div>
              <app-pagination
                :serverData="paginateData"
                :dataLink="paginationLink"
                @pageClicked="logsLoaded = false"
                @dataReceived="logsChanged"
              ></app-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import Pagination from './../Pagination'
  import Loader from './../Loader.vue'

  export default {
    components: {
      'app-pagination': Pagination,
      'app-loader': Loader
    },

    created () {
      axios.get('/api/roulette/stats')
      .then((response) => {
        this.stats = response.data.stats
        this.logs = response.data.logs
        this.paginateData = response.data.pagination
        this.dataLoaded = true
      })
      .catch((error) => {
        console.log(error)
      })
    },

    data () {
      return {
        dataLoaded: false,
        logsLoaded: true,
        stats: null,
        logs: null,
        paginateData: null,
        paginationLink: '/api/roulette/logs',
        sort: {
          current: ''
        },
        animateNumbers: {
          initial: 0,
          duration: 500
        },
        // fetch colors data from server in the future
        colors: {
          first: {
            color: '#b04a43',
            diapason: '1 to 7'
          },
          second: {
            color: '#444',
            diapason: '8 to 14'
          },
          third: {
            color: '#6fb26b',
            diapason: '0'
          }
        }
      }
    },

    methods: {
      sortBy (prop) {
        this.sort.current = prop
        if (this.sort.hasOwnProperty(prop)) {
          this.logs.sort((a, b) => {
            return this.sort[prop] ? a[prop] > b[prop] : a[prop] < b[prop]
          })
          this.sort[prop] = !this.sort[prop]
        } else {
          this.sort[prop] = true
          this.logs.sort((a, b) => {
            return a[prop] < b[prop]
          })
        }
      },

      logsChanged (logs) {
        this.sort = {}
        this.logs = logs
        this.logsLoaded = true
      }
    }
  }
</script>

<style>
  thead td,
  .table-roulette-color,
  .table-profit,
  .table-amount,
  .stats-table-numbers,
  .stats-table-description {
    font-weight: bold;
  }

  thead td,
  .table-roulette-color {
    user-select: none;
  }

  .table-roulette-color,
  .stats-table-numbers-colored {
    color: #fff;
  }
  
  .stats-table-description {
    text-align: right;
  }

  .logs-table {
    transition: opacity .2s ease-in-out;
  }

  .logs-table-loading {
    opacity: 0.2;
    filter: blur(1px);
  }

  .sortable {
    cursor: pointer;
  }

  .sort-arrow {
    transition: transform .2s ease-in-out;
  }
</style>
