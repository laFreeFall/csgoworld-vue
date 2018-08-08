<template>
  <div>
    <form
      @submit.prevent="searchChanged"
      class="col-md-10 col-md-offset-1 inventory-search"
    >
      <div class="input-group">
        <input
          @input="searchChanged"
          v-model="localSearchFilter"
          type="text"
          class="form-control"
          autofocus
          placeholder="Start typing weapon name..."
        >
        <span
          @click="localSearchFilter = ''; searchChanged()"
          class="input-group-addon input-clear-addon"
        >
          <i class="fa fa-times"></i>
        </span>
      </div>
    </form>
    <br>
    <div class="inventory-items">
      <div
        v-for="item in paginated.items"
        class="col-md-5ths col-sm-3 col-xs-4"
      >
        <app-inventory-item
          v-if="mode.title === 'inventory'"
          :mode="mode"
          :item="item"
          @itemClicked="showModal"
        >
        </app-inventory-item>
        <app-inventory-item
          v-else-if="mode.title === 'contract' || mode.title === 'coinflip'"
          :mode="mode"
          :item="item"
          @itemClicked="justReturn"
        >
        </app-inventory-item>
      </div>
      <div class="clearfix"></div>
      <div v-if="!paginated.amount">
        <div class="alert alert-info col-md-10 col-md-offset-1">
          There are no items in the inventory {{ localSearchFilter === '' ? '' : `by your request (${localSearchFilter})` }}
          </div>
      </div>
    </div>
    <div class="clearfix"></div>
    <div
      v-if="paginated.amount > 0"
      class="inventory-items-pagination"
    >
      <button
        :disabled="pagination.currentPage === 1"
        @click="changePaginationPage(pagination.currentPage - 1)"
        class="btn btn-default"
      >
        <i class="fa fa-arrow-left"></i> Prev
      </button>
      <strong>{{ pagination.currentPage }}</strong> page of {{ Math.ceil(paginated.amount / pagination.perPage) }}
      <button
        :disabled="pagination.currentPage === Math.ceil(paginated.amount / pagination.perPage)"
        @click="changePaginationPage(pagination.currentPage + 1)"
        class="btn btn-default"
      >
        Next <i class="fa fa-arrow-right"></i>
      </button>
    </div>
    <app-item-modal
      @modalClosed="isModalShown = false"
      :is-modal-shown="isModalShown"
      :item-pivot="itemInModal"
      :is-new="false"
    >
    </app-item-modal>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import InventoryItem from './InventoryItem.vue'
  import ItemModal from './../ItemModal.vue'

  export default {
    components: {
      'app-inventory-item': InventoryItem,
      'app-item-modal': ItemModal
    },

    props: {
      mode: {
        type: Object,
        required: true
      }
    },

    data () {
      return {
        localSearchFilter: '',
        isModalShown: false,
        itemInModal: null
      }
    },

    computed: {
      ...mapGetters([
        'items',
        'paginated',
        'itemsPrice',
        'pagination'
      ])
    },

    methods: {
      ...mapActions([
        'changePaginationPage',
        'changeItemsSearchFilter'
      ]),

      searchChanged () {
        this.changeItemsSearchFilter(this.localSearchFilter)
      },

      showModal (item) {
        this.isModalShown = true
        this.itemInModal = item
      },

      justReturn (item) {
        this.$emit('itemClicked', item)
      }
    }
  }
</script>

<style>
  .inventory-search {
    margin-bottom: 30px;
  }

  .input-clear-addon {
    cursor: pointer;
  }
</style>