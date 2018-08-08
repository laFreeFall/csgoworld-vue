<template>
  <div>
    <div class="container">
      <div class="row col-md-12">
        <h1 class="text-center">
          Coinflip Info & Stats
        </h1>
        <el-switch
          v-model="areStatsOwn"
          active-text="Your stats"
          inactive-text="Total stats"
          @change="coverageChanged"
        >
        </el-switch>
        <div v-if="!dataLoaded">
          <app-loader loadingText="Your personal data is loading..."></app-loader>
        </div>
        <div v-else>
          <div class="stats-badge-row">
            <div v-for="lg in log">
              <app-inventory-item
                v-for="item in lg.user_items"
                :mode="{ base: false }"
                :item="item.pivot_item"
                :key="item.pivot_item.id"
              >
              </app-inventory-item>
              <app-inventory-item
                v-for="item in lg.bot_items"
                :mode="{ base: false, abstract: true }"
                :item="item.item"
                :key="item.item.id"
              >
              </app-inventory-item>
            </div>

            <div class="alert alert-success stats-badge">
              <div class="stats-badge-number">
                <animate-number
                  :from="animateNumbers.initial"
                  :to="stats.games.total"
                  :duration="animateNumbers.duration"
                  easing="easeOutQuad"
                >
                </animate-number>
              </div>
              <div class="stats-badge-description">
                coinflips have been played
              </div>
            </div>
            <div class="alert alert-success stats-badge">
              <div class="stats-badge-number">
                <animate-number
                  :from="animateNumbers.initial"
                  :to="stats.games.won"
                  :duration="animateNumbers.duration"
                  easing="easeOutQuad"
                >
                </animate-number>
              </div>
              <div class="stats-badge-description">
                of them have been won
              </div>
            </div>
            <div class="alert alert-success stats-badge">
              <div class="stats-badge-number">
                <animate-number
                  :from="animateNumbers.initial"
                  :to="stats.games.lost"
                  :duration="animateNumbers.duration"
                  easing="easeOutQuad"
                >
                </animate-number>
              </div>
              <div class="stats-badge-description">
                of them have been lost
              </div>
            </div>
          </div>
          <hr>

          <div v-if="stats.greatest_wins.length">
            <h3 class="text-center">
              {{ stats.greatest_wins.length }} greatest wins
            </h3>
            <div class="stats-crates-row">
                <div
                  v-for="greatestWin in stats.greatest_wins"
                  class="row"
                >
                  <app-coinflip-log :log="greatestWin"></app-coinflip-log>
                </div>
            </div>
          </div>
          <hr>

          <div v-if="stats.greatest_losses.length">
            <h3 class="text-center">
              {{ stats.greatest_losses.length }} crushing defeats
            </h3>
            <div v-for="greatestLoss in stats.greatest_losses">
              <app-coinflip-log :log="greatestLoss"></app-coinflip-log>
            </div>
            <hr>
          </div>

          <div v-if="logs.length">
            <h3 class="text-center">
              Coinflip Logs
            </h3>
            <div class="coinflip-logs">
              <div
                v-for="log in logs"
                class="coinflip-log"
                :class="!logsLoaded ? 'logs-table-loading' : ''"
              >
                <h4 class="text-center">
                  Log #{{ log.id }} ({{ log.created_at }})
                </h4>
                <app-coinflip-log :log="log"></app-coinflip-log>
                <br><hr>
              </div>
              <app-pagination
                :serverData="paginateData"
                :dataLink="paginationLink"
                @pageClicked="logsLoaded = false"
                @dataReceived="logsChanged">
              </app-pagination>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import Loader from './../Loader.vue'
  import InventoryItem from './../Inventory/InventoryItem.vue'
  import Pagination from './../Pagination.vue'
  import Log from './Log.vue'

  export default {
    components: {
      'app-loader': Loader,
      'app-inventory-item': InventoryItem,
      'app-pagination': Pagination,
      'app-coinflip-log': Log
    },
    data () {
      return {
        dataLoaded: false,
        statistics: {
          common: null,
          own: null
        },
        logs: [],
        logsLoaded: true,
        paginateData: null,
        areStatsOwn: false,
        animateNumbers: {
          initial: 0,
          duration: 400
        },
        paginationLink: '/api/coinflip/logs',
        log: null
      }
    },

    computed: {
      stats () {
        return this.areStatsOwn ? this.statistics.own : this.statistics.common
      }
    },

    created () {
      axios.get('/api/coinflip/stats?coverage=all')
      .then((response) => {
        this.statistics.common = response.data.stats
        this.logs = response.data.logs
        this.paginateData = response.data.pagination
        this.dataLoaded = true
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
    },
    methods: {
      coverageChanged () {
        if (this.areStatsOwn) {
          if (this.statistics.own === null) {
            this.dataLoaded = false
            axios.get('/api/coinflip/stats?coverage=user')
            .then((response) => {
              this.statistics.own = response.data.stats
              this.logs = response.data.logs
              this.dataLoaded = true
            })
            .catch((error) => {
              console.log(error)
            })
          }
        }
      },

      logsChanged (logs) {
        this.logs = logs
        this.logsLoaded = true
      }
    }
  }
</script>

<style>
  .stats-badge-row {
    margin-top: 30px;
  }

  .stats-badge {
    border-radius: 50%;
    width: 150px;
    height: 150px;
  }

  .stats-badge,
  .stats-crate {
    display: inline-block;
    margin-right: 0;
  }

  .stats-badge:not(:last-child),
  .stats-crate:not(:last-child) {
    margin-right: 50px;
  }

  .stats-badge-number {
    font-size: 3em;
    margin-top: 10px;
  }

  .logs-table {
    transition: opacity .2s ease-in-out;
  }

  .logs-table-loading {
    opacity: 0.2;
    filter: blur(1px);
  }

  .coinflip_log_item {
    margin-right: 10px;
  }

</style>
