<template>
  <div>
    <div class="container">
      <div class="row col-md-12">
        <h1 class="text-center">
          Cases Info & Stats
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
            <div class="alert alert-success stats-badge">
              <div class="stats-badge-number">
                <animate-number
                  :from="animateNumbers.initial"
                  :to="stats.total_amount"
                  :duration="animateNumbers.duration"
                  easing="easeOutQuad"
                >
                </animate-number>
              </div>
              <div class="stats-badge-description">
                contracts were made
              </div>
            </div>
            <div class="alert alert-success stats-badge">
              <div class="stats-badge-number">
                <animate-number
                  :from="animateNumbers.initial"
                  :to="stats.stattrak_amount"
                  :duration="animateNumbers.duration"
                  easing="easeOutQuad"
                >
                </animate-number>
              </div>
              <div class="stats-badge-description">
                of them were stattrak
              </div>
            </div>
            <div class="alert alert-success stats-badge">
              <div class="stats-badge-number">
                <animate-number
                  :from="animateNumbers.initial"
                  :to="stats.souvenir_amount"
                  :duration="animateNumbers.duration"
                  easing="easeOutQuad"
                >
                </animate-number>
              </div>
              <div class="stats-badge-description">
                of them were souvenir
              </div>
            </div>
          </div>
          <hr>

          <div v-if="stats.expensive_items.length">
            <h3 class="text-center">
              {{ stats.expensive_items.length }} most expensive items from contracts
            </h3>
            <div class="stats-crates-row">
              <div class="stats-crate" >
                <app-inventory-item
                  v-for="expensiveItem in stats.expensive_items"
                  :item="expensiveItem.pivot_won_item"
                  :mode="{ base: false }"
                  :key="expensiveItem.pivot_won_item.id"
                >
                </app-inventory-item>
              </div>
            </div>
          </div>
          <hr>

          <div v-if="stats.frequent_items.length">
            <h3 class="text-center">
              {{ stats.frequent_items.length }} most frequent items from contracts
            </h3>
            <app-inventory-item
              v-for="item in stats.frequent_items"
              :item="item.pivot_won_item"
              :mode="{ base: false, abstract: true }"
              :key="item.id"
            >
            </app-inventory-item>
          </div>
          <hr>

          <div v-if="stats.frequent_qualities.length">
            <h3 class="text-center">
              {{ stats.frequent_qualities.length }} most frequent qualities
            </h3>
            <div class="stats-crates-row">
              <div
                v-for="frequentQuality in stats.frequent_qualities"
                class="stats-crate"
              >
                <button
                  class="btn btn-default"
                  :style="{ backgroundColor: frequentQuality.color, color: 'white' }"
                >
                  {{ frequentQuality.title }}
                  <span class="badge">{{ frequentQuality.count }}</span>
                </button>
              </div>
            </div>
          </div>
          <hr>

          <div v-if="logs.length">
            <h3 class="text-center">
              Contracts Logs
            </h3>
            <div class="contracts-logs">
              <div
                v-for="log in logs"
                class="contracts-log"
                :class="!logsLoaded ? 'logs-table-loading' : ''"
              >
                <h4 class="text-center">
                  Log #{{ log.id }} ({{ log.created_at }})
                </h4>

                <h4 class="text-center">
                  Items which user sent
                </h4>
                <app-inventory-item
                  v-for="item in log.items"
                  :item="item.pivot_item"
                  :mode="{ base: false }"
                  :key="item.pivot_item.id"
                >
                </app-inventory-item>

                <h4 class="text-center">
                  Item what user got
                </h4>
                <app-inventory-item
                  :item="log.pivot_won_item"
                  :mode="{ base: false }"
                  :key="log.pivot_won_item.id"
                >
                </app-inventory-item>
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

  export default {
    components: {
      'app-loader': Loader,
      'app-inventory-item': InventoryItem,
      'app-pagination': Pagination
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
        exteriors: null,
        paginationLink: '/api/contracts/logs'
      }
    },

    computed: {
      stats () {
        return this.areStatsOwn ? this.statistics.own : this.statistics.common
      }
    },

    created () {
      axios.get('/api/contracts/info?coverage=all')
      .then((response) => {
        this.exteriors = response.data.stats.exteriors
        this.statistics.common = response.data.stats
        this.paginateData = response.data.pagination
        this.dataLoaded = true
        console.log(response.data.stats)
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
            axios.get('/api/contracts/info?coverage=user')
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

  .stats-crate {
    width: 200px;
  }
  .stats-crate-image {
    width: 150px;
  }

  .stats-log-image {
    height: 110px;
    width: auto;
  }

  .log-arrow-icon {
    /*outline: 1px solid gold;*/
    vertical-align: middle;
    margin-top: -125px;
    margin-left: 10px;
    line-height: 100px;
  }
</style>
