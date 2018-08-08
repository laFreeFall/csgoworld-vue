<template>
  <div>
    <div v-if="!crates">
      <app-loader loadingText="Cases are loading..."></app-loader>
    </div>
    <div
      v-else
      class="container"
    >
      <div class="row col-md-12">
        <h1 class="text-center">
          {{ cratesToggle ? 'Collections' : 'Containers'}} list
        </h1>
        <el-switch
          style="display: block"
          v-model="cratesToggle"
          @change="cratesToggled"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="Collections"
          inactive-text="Containers">
        </el-switch>
        <div class="alert alert-info">
          If you want to learn more and view some statistics data,
          <strong><router-link :to="{ name: 'CasesInfo' }">you're welcome</router-link></strong>!
        </div>
        <app-case
          v-for="itemCase in itemsToDisplay"
          :item-case="itemCase"
          :key="itemCase.id"
        >
        </app-case>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import Case from './Case.vue'
  import Loader from './../Loader.vue'

  export default {
    components: {
      'app-case': Case,
      'app-loader': Loader
    },

    data () {
      return {
        cratesToggle: true,
        imageSource: 'http://csgoworld.loc/storage/images/cases/'
      }
    },

    computed: {
      ...mapGetters([
        'crates',
        'cratesFilter'
      ]),

      itemsToDisplay () {
        return this.crates[this.cratesFilter]
      }
    },

    created () {
      if (!this.crates) {
        this.fetchCrates()
      }
      this.cratesToggle = (this.cratesFilter === 'collections')
    },

    methods: {
      ...mapActions([
        'fetchCrates',
        'toggleCratesFilter'
      ]),

      cratesToggled () {
        this.toggleCratesFilter()
      }
    }
  }
</script>

<style scoped>
  .el-switch__label span {
    font-size: 1.5em;
  }

  .alert {
    margin-top: 15px;
  }
</style>
