<template>
  <div>
    <div class="coinflip_log col-md-6">
      <div class="user_block">
        <img
          :src="imagesUrl + 'avatars/' + log.user.avatar"
          :alt="log.user.name"
          class="coinflip_log_avatar"
        >
        <h4 class="coinflip_log_username text-center">
          {{ log.user.name }}
        </h4>
        <p class="coinflip_log_info">
          {{ log.user_items.length === 1 ? `1 item` : `${log.user_items.length} items` }} for {{ log.user_items_price | money }}
          ({{ log.user_items_price / (log.user_items_price + log.bot_items_price) | percent }})
        </p>
        <button
          class="btn"
          :class="log.victory ? 'btn-success' : 'btn-warning'"
        >
          {{ log.victory ? `Won $${log.bot_items_price.toFixed(2)}` : `Lost $${log.user_items_price.toFixed(2)}` }}
        </button>
      </div>
      <app-inventory-item
        v-for="item in log.user_items"
        :mode="{ base: false }"
        :item="item.pivot_item"
        :key="item.pivot_item.id"
        class="coinflip_log_item"
      >
      </app-inventory-item>
    </div>
    <div class="coinflip_log col-md-6">
      <div class="enemy_block">
        <img
          :src="imagesUrl + 'bots/' + log.bot.avatar"
          :alt="log.bot.name"
          class="coinflip_log_avatar"
        >
        <h4 class="text-center">
          {{ log.bot.name }}
        </h4>
        <p class="coinflip_log_info">
          {{ log.bot_items.length === 1 ? `1 item` : `${log.bot_items.length} items` }} for {{ log.bot_items_price | money }}
          ({{ log.user_items_price / (log.user_items_price + log.bot_items_price) | percent }})
        </p>
        <button
          class="btn"
          :class="!log.victory ? 'btn-success' : 'btn-warning'"
        >
          {{ !log.victory ? `Won $${log.user_items_price.toFixed(2)}` : `Lost $${log.bot_items_price.toFixed(2)}` }}
        </button>
      </div>
      <app-inventory-item
        v-for="item in log.bot_items"
        :mode="{ base: false, abstract: true }"
        :item="item.item"
        :key="item.item.id"
        class="coinflip_log_item"
      >
      </app-inventory-item>
    </div>
    <hr>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import InventoryItem from './../Inventory/InventoryItem.vue'

  export default {
    components: {
      'app-inventory-item': InventoryItem
    },

    props: {
      log: {
        type: Object,
        required: true
      }
    },

    data () {
      return {
        imageSource: 'http://csgoworld.loc/storage/images/'
      }
    },

    computed: {
      ...mapGetters([
        'imagesUrl',
        'exteriors'
      ])
    }
  }
</script>

<style scoped>
  .coinflip_log_avatar {
    width: 100px;
  }
</style>