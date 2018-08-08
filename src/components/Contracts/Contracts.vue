<template>
  <div>
    <div v-if="!qualities.length">
      <app-loader loadingText="Qualities are loading..."></app-loader>
    </div>
    <div
      v-else
      class="container"
    >
      <div class="row col-md-12">
        <h2 class="text-center">
          Trade-Up Contracts
        </h2>
        <div class="alert alert-info">
          If you want to learn more and view some statistics data,
          <strong><router-link :to="{ name: 'ContractsInfo' }">you're welcome</router-link></strong>!
        </div>
        <div class="qualities">
          <div class="qualities-row qualities-default">
            <router-link
              v-for="(quality, index) in qualities"
              v-if="index !== qualities.length - 1"
              :to="{ name: 'Contract', params: { 'qualityId': quality.id } }"
              :key="quality.id"
              :style="{ backgroundColor: quality.color }"
              class="btn btn-default quality-btn"
            >
              {{ quality.title }}
            </router-link>
          </div>

          <div class="qualities-row qualities-stattrak">
            <router-link
              v-for="(quality, index) in qualities"
              v-if="quality.stattrak && index !== qualities.length - 1"
              :to="{ name: 'Contract', params: { 'qualityId': quality.id }, query: { stattrak: 'yes' } }"
              :key="quality.id"
              :style="{ backgroundColor: quality.color }"
              class="btn btn-default quality-btn"
            >
              <span :style="{ color: 'gold' }">
                Stattrak
              </span>
              {{ quality.title }}
            </router-link>
          </div>

          <div class="qualities-row qualities-souvenir">
            <router-link
              v-for="(quality, index) in qualities"
              v-if="quality.souvenir && index !== qualities.length - 1"
              :to="{ name: 'Contract', params: { 'qualityId': quality.id }, query: { souvenir: 'yes' } }"
              :key="quality.id"
              :style="{ backgroundColor: quality.color }"
              class="btn btn-default quality-btn"
            >
              <span :style="{ color: 'yellow' }">
                Souvenir
              </span>
              {{ quality.title }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import Loader from './../Loader.vue'

  export default {
    components: {
      'app-loader': Loader
    },

    created () {
      if (!this.qualities.length) {
        this.fetchQualities()
      }
    },

    computed: {
      ...mapGetters([
        'qualities'
      ])
    },

    methods: {
      ...mapActions([
        'fetchQualities'
      ])
    }
  }
</script>

<style>
  .qualities-row {
    margin-bottom: 15px;
  }
  .quality-btn {
    margin-right: 10px;
    color: #fff;
  }
</style>