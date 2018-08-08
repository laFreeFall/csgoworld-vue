<template>
  <div class="container">
    <div class="row col-md-10 col-md-offset-1">
      <div v-if="!caseItems">
        <app-loader loadingText="Loading items from the case..."></app-loader>
      </div>
      <div v-else>
        <h1>
          {{ crate.title }}
          <span
            v-if="crate.price"
            class="badge"
          >
            {{ crate.price | money }}
          </span>
        </h1>
        <img
          :src="imagesUrl + 'cases/' + crate.image"
          :alt="crate.title"
          class="opencase-crate-image"
        >
        <hr>
        <app-spin-roulette
          v-if="this.caseItems"
          :items="rouletteItems"
          :items-component="'app-opencase-item'"
          :index="index"
          :settings="rouletteSettings"
          :isSpinning="isSpinning"
          @spinned="finishSpin"
        >
        </app-spin-roulette>
        <br>
        <button
          :disabled="isSpinning"
          @click="startSpin"
          class="btn btn-info"
        >
          Spin!</button>
        <hr>
        <h3 class="text-center">
          Items you might get
        </h3>
          <div class="case-items">
            <app-inventory-item
              v-for="item in caseItems"
              :item="item"
              :mode="{ case: true, base: true }"
              :key="item.id"
              class="case-item col-md-5ths col-sm-3 col-xs-4"
            >
            </app-inventory-item>
            <app-inventory-item
              v-if="caseRare"
              :item="caseRare"
              :mode="{ case: true, base: true, rare: true }"
              class="case-item col-md-5ths col-sm-3 col-xs-4  "
            >
            </app-inventory-item>
          </div>

      <app-item-modal
        @modalClosed="isModalShown = false"
        :is-modal-shown="isModalShown"
        :item-pivot="wonItem"
        :is-new="true"
      >
      </app-item-modal>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import { mapGetters, mapActions } from 'vuex'
  import itemsColorMixin from './../../mixins/ItemsColors'
  import ItemModal from './../ItemModal.vue'
  import Loader from './../Loader.vue'
  import SpinRoulette from './../SpinRoulette.vue'
  import InventoryItem from './../Inventory/InventoryItem'

  export default {
    components: {
      'app-item-modal': ItemModal,
      'app-loader': Loader,
      'app-spin-roulette': SpinRoulette,
      'app-inventory-item': InventoryItem
    },

    mixins: [itemsColorMixin],

    data () {
      return {
        rouletteItems: [],
        isModalShown: false,
        wonItem: null,
        caseItems: null,
        caseRare: null,
        crate: null,
        isSpinning: false,
        rouletteSettings: {
          item: {
            width: 90,
            height: 100
          },
          roulette: {
            widthInItems: 8,
            spin: {
              time: 5000,
              delay: 500
            }
          }
        },
        isLoading: false,
        index: null
      }
    },

    created () {
      axios.get(`/api/case?type=${this.$route.params.type}&id=${this.$route.params.id}`)
      .then((response) => {
        this.caseItems = response.data.items
        this.crate = response.data.crate
        if (response.data.rare) {
          // this.caseRare = {
          //   image: response.data.rare.image,
          //   weapon: {
          //     title: response.data.rare.title
          //   },
          //   pattern: {
          //     title: '★'
          //   },
          //   quality: {
          //     color: 'rgb(207, 167, 13)'
          //   }
          // }
          this.caseRare = response.data.rare
          for (let i = 0; i <= this.rouletteSettings.roulette.widthInItems; i++) {
            this.rouletteItems.push(this.caseRare)
          }
        } else {
          console.log('there are no rare items ):')
        }
      })
      .catch((error) => {
        console.log(error)
      })
    },

    computed: {
      ...mapGetters([
        'imagesUrl'
      ])
    },

    methods: {
      ...mapActions([
        'increaseUserBalance',
        'addItemToUser'
      ]),

      startSpin () {
        this.isLoading = true
        axios.get(`/api/spin?type=${this.$route.params.type}&id=${this.$route.params.id}`)
        .then((response) => {
          this.rouletteItems = response.data.items
          this.wonItem = response.data.item
          this.index = response.data.index
          this.isLoading = false
          this.isSpinning = true
        })
        .catch((error) => {
          console.log(error)
        })
      },

      finishSpin () {
        this.isSpinning = false
        this.isModalShown = true
        this.addItemToUser(this.wonItem)
        this.increaseUserBalance(this.wonItem.item.price)
      }
    }
  }
</script>

<style>
  .container {
    z-index: 5;
  }

  .case-item {
    user-select: none;
  }

  .case-item {
    /*margin-left: 20px;*/
    /*margin-right: 20px;*/
  }

  /*.case-item {*/
    /*margin-right: 40px;*/
  /*}*/

  /*.case-item:nth-last-child(2) {*/
    /*margin-right: 0;*/
  /*}*/

  /*.case-item:nth-last-child(1) {*/
    /*margin-left: 40px;*/
  /*}*/

  .opencase-crate-image {
    height: 150px;
  }

  .piece {
    width: 10em; height: 8.66em;
    background: rgba(0,0,0,.5);
    transition: .5s;
    cursor: pointer;
  }
  .piece {
    position: relative;
    margin: 4em auto;
    transform: rotate(-30deg) skewX(30deg);
  }
  .piece:before, .piece:after {
    position: absolute;
    width: inherit; height: inherit;
    background: inherit;
    content: '';
  }
  .piece:before {
    left: 0;
    transform: skewX(-30deg) skewX(-30deg);
  }
  .piece:after {
    left: 0;
    transform: skewX(-30deg) rotate(-60deg) skewX(-30deg);
  }
  .piece:hover { background: rgba(255,0,0,.5); }

  .opencase-popup-image {
    width: 350px;
    position: relative;
  }

  .opencase-popup-star {
    font-size: 20em;
/*instead of standard fa-spin because of speed control*/
    animation-name: spin;
    animation-duration: 10000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    position: absolute;
    top: 31%;
    left: 27%;
  }

  .opencase-popup-alert {
    font-weight: bold;
  }

  .popup-star {
    /*margin: 20px;*/
    /*width: 100px;*/
    /*height: 100px;*/
    /*background: #f00;*/

    /*animation-name: spin;*/
    /*animation-duration: 4000ms;*/
    /*animation-iteration-count: infinite;*/
    /*animation-timing-function: linear;*/
  }

  @-ms-keyframes spin {
    from { -ms-transform: rotate(0deg); }
    to { -ms-transform: rotate(360deg); }
  }
  @-moz-keyframes spin {
    from { -moz-transform: rotate(0deg); }
    to { -moz-transform: rotate(360deg); }
  }
  @-webkit-keyframes spin {
    from { -webkit-transform: rotate(0deg); }
    to { -webkit-transform: rotate(360deg); }
  }
  @keyframes spin {
    from {
      transform:rotate(0deg);
    }
    to {
      transform:rotate(360deg);
    }
  }

  .wrapper {
    padding-left: 1em;
    padding-right: 1em;
    margin: auto;
    display: block;
    width: 195px;
    margin-top: -25px;
  }
</style>
