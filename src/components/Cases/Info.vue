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
                  :to="stats.opened_containers + stats.opened_collections"
                  :duration="animateNumbers.duration"
                  easing="easeOutQuad"
                >
                </animate-number>
              </div>
              <div class="stats-badge-description">
                crates were opened
              </div>
            </div>
            <div class="alert alert-success stats-badge">
              <div class="stats-badge-number">
                <animate-number
                  :from="animateNumbers.initial"
                  :to="stats.opened_containers"
                  :duration="animateNumbers.duration"
                  easing="easeOutQuad"
                >
                </animate-number>
              </div>
              <div class="stats-badge-description">
                containers were opened
              </div>
            </div>
            <div class="alert alert-success stats-badge">
              <div class="stats-badge-number">
                <animate-number
                  :from="animateNumbers.initial"
                  :to="stats.opened_collections"
                  :duration="animateNumbers.duration"
                  easing="easeOutQuad">
                </animate-number>
              </div>
              <div class="stats-badge-description">
                collections were opened
              </div>
            </div>
            <hr>
          </div>

          <div v-if="stats.opened_containers > 0">
            <h3 class="text-center">
              {{ stats.top_containers.length }} most popular containers
            </h3>
            <div class="stats-crates-row">
              <div
                v-for="container in stats.top_containers"
                class="stats-crate"
              >
                <img
                  :src="imagesUrl + 'cases/' + container.image"
                  alt="container.title"
                  class="stats-crate-image"
                >
                <div class="stats-crate-title">
                <span class="badge">
                  {{ container.count }}
                </span>
                  {{ container.title }}
                  <span class="label label-default">
                  {{ container.price | money }}
                </span>
                </div>
              </div>
            </div>
            <hr>
          </div>

          <div v-if="stats.opened_collections > 0">
            <h3 class="text-center">
              {{ stats.top_collections.length }} most popular collections
            </h3>
            <div class="stats-crates-row">
              <div
                v-for="collection in stats.top_collections"
                class="stats-crate"
              >
                <img
                  :src="imagesUrl + 'cases/' + collection.image"
                  alt="collection.title"
                  class="stats-crate-image"
                >
                <div class="stats-crate-title">
                <span class="badge">
                  {{ collection.count }}
                </span>
                  {{ collection.title }}
                </div>
              </div>
            </div>
            <hr>
          </div>

          <div v-if="stats.most_expensive_item">
            <h3 class="text-center">
              {{ stats.most_expensive_item.length }} most expensive item received from crates opening
            </h3>
            <app-inventory-item
              v-for="item in stats.most_expensive_item"
              :mode="{ base: false }"
              :item="item.pivot_item"
              :key="item.id"
              class="stats-inventory-item"
            >
            </app-inventory-item>
            <hr>
          </div>

          <div v-if="stats.most_frequent_item">
            <h3 class="text-center">
              {{ stats.most_frequent_item.length }} most frequently opened item
            </h3>
            <app-inventory-item
              v-for="item in stats.most_frequent_item"
              :mode="{ base: false, abstract: true, frequent: true }"
              :item="item"
              :key="item.id"
              class="stats-inventory-item"
            >
            </app-inventory-item>
            <hr>
          </div>

          <div v-if="logs.length">
            <h3 class="text-center">
              Your last opencases
            </h3>
            <div class="opencase-logs">
              <div
                v-for="log in logs"
                class="opencase-log col-md-6 logs-table"
                :class="!logsLoaded ? 'logs-table-loading' : ''"
              >
                <app-inventory-item
                  :mode="{ base: false }"
                  :item="log.pivot_item"
                  :key="log.id"
                >
                </app-inventory-item>
                <i class="fa fa-2x fa-arrow-circle-o-left log-arrow-icon"></i>
                <div class="stats-crate">
                  <img
                    :src="imagesUrl + 'cases/' + log.itemable.image"
                    alt="container.title"
                    class="stats-crate-image stats-log-image"
                  >
                  <div class="stats-crate-title">
                    {{ log.itemable.title }}
                  </div>
                </div>
              </div>
              <br>
              <app-pagination
                :serverData="paginateData"
                :dataLink="paginationLink"
                @pageClicked="logsLoaded = false"
                @dataReceived="logsChanged"
                class="col-md-12">
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
  import { mapGetters } from 'vuex'
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
        paginationLink: '/api/cases/logs'
      }
    },

    computed: {
      ...mapGetters([
        'imagesUrl'
      ]),

      stats () {
        return this.areStatsOwn ? this.statistics.own : this.statistics.common
      }
    },

    created () {
      axios.get('/api/cases/info?coverage=all')
      .then((response) => {
        this.exteriors = response.data.exteriors
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
            axios.get('/api/cases/info?coverage=user')
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
    vertical-align: middle;
    margin-top: -125px;
    margin-left: 10px;
    line-height: 100px;
  }

  .stats-inventory-item {
    margin-right: 30px;
  }
</style>
