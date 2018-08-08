<template>
  <div class="container">
    <div class="col-md-12">
      <h2 class="text-center">
        Trade up for {{ this.$route.params.qualityId }}rd quality
      </h2>
      <h3 class="text-center">
        Contract items {{ this.contractItemsAmount }}/{{ this.contractItemsMaxAmount }}
      </h3>
      <div class="contract-items">
        <div
          v-for="item in contractItems"
          class="contract-item-wrap"
        >
          <div class="contract-item col-md-5ths">
            <app-inventory-item
              :item="item"
              :mode="{ title: item.contract ? 'contract' : 'absent', base: !item.contract, potentialItems: item.contract ? potentialItems : null }"
              @itemClicked="itemWasClicked"
            >
            </app-inventory-item>
          </div>
        </div>
      </div>
      <button
        :disabled="this.contractItemsAmount < this.contractItemsMaxAmount"
        @click="sendContract"
        class="btn btn-primary"
      >
        Trade Up!
      </button>
      <div class="row">
        <button
          v-show="contractItemsAmount > 0"
          @click="showProbabilities = !showProbabilities"
          class="btn btn-default"
        >
          Show trade-up probabilities
        </button>
        <div v-show="showProbabilities">
          <p>Trade-Up Probabilities:</p>
          <div
            v-for="potentialItem in currentPotentialItems"
            class="col-md-5ths"
          >
            <app-inventory-item
              :item="potentialItem"
              :key="potentialItem.id"
              :mode="{ title: 'contract_probability', base: true }"
            >
            </app-inventory-item>
          </div>
        </div>
      </div>
      <div
        v-if="potentialItems"
        class="row"
      >
        <h3 class="text-center">
          Your items
        </h3>
        <app-inventory-items
          :mode="{ title: 'contract', item: 'detailed', base: false, potentialItems: potentialItems }"
          @itemClicked="itemWasClicked"
        >
        </app-inventory-items>
      </div>
    </div>
    <app-item-modal
      :is-modal-shown="isModalShown"
      :item-pivot="wonItem"
      :is-new="true"
      @modalClosed="isModalShown = false"
    >
    </app-item-modal>
  </div>
</template>

<script>
  import axios from 'axios'
  import { mapActions, mapGetters } from 'vuex'
  import Vue from 'vue'
  import InventoryItems from './../Inventory/InventoryItems.vue'
  import InventoryItem from './../Inventory/InventoryItem.vue'
  import ItemModal from './../ItemModal.vue'

  export default {
    components: {
      'app-inventory-items': InventoryItems,
      'app-inventory-item': InventoryItem,
      'app-item-modal': ItemModal
    },

    props: ['qualityId'],

    data () {
      return {
        contractItems: [],
        defaultContractItem: {
          image: 'no_image.jpg',
          weapon: {
            title: 'No item'
          },
          pattern: {
            title: 'Is selected'
          },
          quality: {
            color: 'gray'
          }
        },
        contractItemsMaxAmount: 10,
        potentialItems: null,
        showProbabilities: false,
        isModalShown: false,
        wonItem: null
      }
    },

    computed: {
      ...mapGetters([
        'paginated'
      ]),

      contractItemsFilled () {
        return this.contractItems.filter(item => { return item.id })
      },

      contractItemsAmount () {
        return this.contractItemsFilled.length
      },

      currentPotentialItems () {
        let containersIds = {}
        let collectionsIds = {}
        let finalItems = []
        let totalAmount = 0
        this.contractItemsFilled.forEach(contractItem => {
          if (contractItem.item.base_item.stattrak !== 0) {
            let itemContainer = this.potentialItems.itemables.find(itemable => {
              return itemable.item_id === contractItem.item.base_item.id && itemable.itemable_type === 'container'
            })
            let itemContainerId = itemContainer.itemable_id
            if (!containersIds.hasOwnProperty(itemContainerId)) {
              let container = this.potentialItems.containers.find(container => { return container.id === parseInt(itemContainerId) })
              let count = 0
              container.base_items.forEach(item => {
                item.relation_id = container.id
                item.relation_type = 'container'
                finalItems.push(item)
                count++
              })
              totalAmount += count
              Vue.set(containersIds, itemContainerId, { count: count, amount: 1 })
            } else {
              containersIds[itemContainerId].amount++
              totalAmount += containersIds[itemContainerId].count
            }
          } else {
            let itemCollection = this.potentialItems.itemables.find(itemable => {
              return itemable.item_id === contractItem.base_item.id && itemable.itemable_type === 'collection'
            })
            let itemCollectionId = itemCollection.itemable_id
            if (!collectionsIds.hasOwnProperty(itemCollectionId)) {
              let collection = this.potentialItems.collections.find(collection => { return collection.id === parseInt(itemCollectionId) })
              let count = 0
              collection.base_items.forEach(item => {
                item.relation_id = collection.id
                item.relation_type = 'collection'
                finalItems.push(item)
                count++
              })
              totalAmount += count
              Vue.set(collectionsIds, itemCollectionId, { count: count, amount: 1 })
            } else {
              collectionsIds[itemCollectionId].amount++
              totalAmount += collectionsIds[itemCollectionId].count
            }
          }
        })
        finalItems.forEach(item => {
          let amount = 1
          if (item.relation_type === 'container') {
            amount = containersIds[item.relation_id].amount
          } else if (item.relation_type === 'collection') {
            amount = collectionsIds[item.relation_id].amount
          }
          item.probability = amount / totalAmount
        })
        return finalItems
      }
    },
    created () {
      for (let i = 0; i < this.contractItemsMaxAmount; i++) {
        this.contractItems.push(this.defaultContractItem)
      }
      let qualityFilter = {
        qualityId: this.$route.params.qualityId,
        stattrak: this.$route.query.stattrak === 'yes',
        souvenir: this.$route.query.souvenir === 'yes'
      }
      this.changeItemsQualityFilter(qualityFilter)
      axios.post('/api/before-contract', { quality_id: this.$route.params.qualityId })
      .then((response) => {
        this.potentialItems = {
          containers: response.data.containers,
          collections: response.data.collections,
          itemables: response.data.itemables
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    },

    beforeRouteLeave (to, from, next) {
      this.paginated.items.forEach((item) => {
        item.hidden = null
        item.isChosen = null
      })
      this.changeItemsQualityFilter(null)
      this.changeItemsSearchFilter('')
      next()
    },

    methods: {
      ...mapActions([
        'changeItemsQualityFilter',
        'changeItemsSearchFilter',
        'increaseUserBalance',
        'addItemToUser',
        'removeItemsFromUser'
      ]),

      itemWasClicked (item) {
        if (item.contract) {
          let userItem = this.paginated.items.find((currentItem) => { return currentItem.id === item.id })
          userItem.contract = null
          userItem.hidden = null
          let ind = this.contractItems.findIndex((currentItem) => { return currentItem.id === item.id })
          this.contractItems.splice(ind, 1)
          this.contractItems.push(this.defaultContractItem)
          userItem.isChosen = null
        } else {
          if (!item.isChosen) {
            let ind = this.contractItems.findIndex((currentItem) => { return !currentItem.id })
            Vue.set(item, 'hidden', true)
            let localItem = Object.assign({}, item)
            localItem.contract = true
            item.isChosen = true
            Vue.set(this.contractItems, ind, localItem)
          }
        }
      },

      sendContract () {
        if (this.contractItemsAmount === 10) {
          let data = this.contractItems.map(a => a.id)
          axios.post('/api/contract', { ids: data })
          .then(response => {
            this.wonItem = response.data.item
            this.isModalShown = true
            let usersItemsPrice = this.contractItems.reduce((a, b) => { return a + b.item['price'] }, 0)
            this.contractItems = []
            for (let i = 0; i < this.contractItemsMaxAmount; i++) {
              this.contractItems.push(this.defaultContractItem)
            }
            this.removeItemsFromUser({ ids: data })
            this.addItemToUser(this.wonItem)
            this.increaseUserBalance(this.wonItem.item.price - usersItemsPrice)
          })
          .catch(error => {
            console.log(error)
          })
        }
      }
    }
  }
</script>

<style>

</style>