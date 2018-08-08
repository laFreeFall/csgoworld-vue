<template>
  <div v-if="!itemsLoaded">
    <app-loader loadingText="Items are loading..."></app-loader>
  </div>
  <div
    v-else
    class="container"
  >
    <div class="row col-md-12">
      <h1 class="text-center">
        Inventory - {{ items.length || 0 }} items ({{ itemsPrice | money }})
      </h1>
      <app-inventory-items
        :mode="{ title: 'inventory', item: 'detailed' }"
      >
      </app-inventory-items>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import InventoryItems from './InventoryItems.vue'
  import Loader from './../Loader.vue'

  export default {
    components: {
      'app-inventory-items': InventoryItems,
      'app-loader': Loader
    },

    computed: {
      ...mapGetters([
        'items',
        'itemsPrice',
        'itemsLoaded'
      ])
    },

    created () {
      if (!this.items.length) {
        this.fetchItems()
      }
    },

    methods: {
      ...mapActions([
        'fetchItems'
      ])
    }
  }
</script>

<style>

</style>
