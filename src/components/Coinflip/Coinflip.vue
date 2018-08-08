<template>
  <div class="container">
    <div class="row col-md-12">
      <h2 class="text-center">
        Coin-Flip Game
      </h2>

      <div class="alert alert-info">
        If you want to learn more and view some statistics data,
        <strong><router-link :to="{ name: 'CoinflipInfo' }">you're welcome</router-link></strong>!
      </div>

      <div class="col-md-4">
        <p>
          {{ user.data.name }}
        </p>
        <div class="avatar">
          <img
            :src="imagesUrl + 'avatars/' + '1.jpg'"
            :alt="enemy.username"
            class="coinflip-avatar"
          >
          <img
            :src="coinSide ? imagesUrl + 'coinflip/coin/ct.png' : imagesUrl + 'coinflip/coin/t.png'"
            :alt="coinSide ? 'CT' : 'T'"
            @click="toggleCoinSide"
            class="coinflip-choice coinflip-choice-user"
          >
        </div>

        <div class="btn-group">
          <button class="btn btn-default">
            <strong>
              $
              <animate-number
                ref="animateUserItemsPrice"
                mode="manual"
                :from="userItemsPrice.from"
                :to="userItemsPrice.to"
                :formatter="priceFormatter"
                :duration="animateNumbers.duration"
                easing="easeOutQuad"
              >
              </animate-number>
            </strong>
          </button>
          <button class="btn btn-default">
            <strong>{{ flipItems.length }}</strong> items
          </button>
          <button class="btn btn-default">
            <strong>{{ flipItemsPercent | percent }}</strong>
          </button>
        </div>

        <transition-group
          name="list-animate"
          tag="ul"
          class="list-group flip-items-list list-animate-item"
        >
          <app-case-item
            v-for="(item, index) in flipItems"
            :list-item="item"
            :is-case-item="false"
            :is-pivot-item="true"
            :is-enemy-item="false"
            :index="index"
            :key="item.id"
            @closeButtonClicked="removeItemFromFlip"
          >
          </app-case-item>
        </transition-group>

        <div
          v-show="restartAvailable && victory"
          class="alert alert-success"
        >
          <strong>{{ user.data.name }}</strong> won <strong>{{ enemyItemsPrice | money }}</strong>
          with <strong>{{ flipItemsPercent | percent}}</strong> chance!
        </div>

        <div
          v-show="restartAvailable && !victory"
          class="alert alert-danger"
        >
          <strong>{{ user.data.name }}</strong> lost <strong>{{ flipItemsPrice | money }}</strong>
          with <strong>{{ flipItemsPercent | percent}}</strong> chance!
        </div>
      </div>

      <div class="col-md-4">
        <div class="coin-container">
          <div
            v-show="!waitingBeforeFlip"
            class="coin-card"
            :style="isFlipping ? coinFlipStyles : {transform: 'rotateY(0deg)'}"
          >
            <div class="coin front-coin">
              <img
                :src="imagesUrl + 'coinflip/coin/ct.png'"
                width="200px"
                height="200px"
                alt="CT"
              >
            </div>
            <div
              class="coin back-coin"
              style="transform: rotateY(180deg)"
            >
              <img
                :src="imagesUrl + 'coinflip/coin/t.png'"
                width="200px"
                height="200px"
                alt="T"
              >
            </div>
          </div>
          <div
            v-show="waitingBeforeFlip"
            :style="previewCoinStyles"
            class="coin coin-preview"
          >
            <img
              :src="imagesUrl + 'coinflip/coin/mix.png'"
              width="200px"
              height="200px"
              alt="Preview Coin"
            >
          </div>
        </div>
        <button
          :disabled="!buttonAvailable"
          @click="flip"
          class="btn btn-primary flip-button"
        >
          {{ buttonText }}
        </button>
      </div>
      <div class="col-md-4">
        <p>{{ enemy.username }}</p>
        <div class="avatar">
          <div
            v-show="searchEnemySpinner"
            class="spinner"
          >
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
          </div>
          <img
            :src="imagesUrl + 'bots/' + enemy.avatar"
            :alt="enemy.username"
            class="coinflip-avatar"
          >
          <img
            :src="coinSide ? imagesUrl + 'coinflip/coin/t.png' : imagesUrl + 'coinflip/coin/ct.png'"
            :alt="coinSide ? 'T' : 'CT'"
            class="coinflip-choice coinflip-choice-enemy"
          >
        </div>
        <div class="btn-group">
          <button class="btn btn-default">
            <strong>{{ enemyItemsPrice | twoDecimals }}</strong>
          </button>
          <button class="btn btn-default">
            <strong>{{ enemy.items.length }}</strong> items
          </button>
          <button class="btn btn-default">
            <strong>{{ enemyItemsPercent | percent }}</strong>
          </button>
        </div>
        <ul class="list-group flip-items-list">
          <app-case-item
            v-for="(item, index) in enemy.items"
            :list-item="item"
            :is-case-item="false"
            :is-pivot-item="true"
            :is-enemy-item="true"
            :index="index"
            :key="item.id"
            @closeButtonClicked="removeItemFromFlip"
          >
          </app-case-item>
        </ul>
        <div
          v-show="restartAvailable && !victory"
          class="alert alert-success"
        >
          <strong>{{ enemy.username }}</strong> won <strong>{{ flipItemsPrice | money }}</strong>
          with <strong>{{ enemyItemsPercent | percent }}</strong> chance!
        </div>
        <div
          v-show="restartAvailable && victory"
          class="alert alert-danger"
        >
          <strong>{{ enemy.username }}</strong> lost <strong>{{ enemyItemsPrice | money }}</strong>
          with <strong>{{ enemyItemsPercent | percent }}</strong> chance!
        </div>
      </div>
    </div>

    <div class="row col-md-12">
      <br>
      <div
        class="alert"
        :class="victory === null ? 'alert-info' : victory ? 'alert-success' : 'alert-danger'"
      >
        <strong>Status: </strong> {{ status.body }}
        <i
          v-if="status.loading"
          class="fa fa-spinner fa-spin"
        >
        </i>
      </div>
      <app-inventory-items
        :mode="{ title: 'coinflip', base: false }"
        @itemClicked="addItemToFlip"
      >
      </app-inventory-items>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import { mapActions, mapGetters } from 'vuex'
  import InventoryItems from './../Inventory/InventoryItems.vue'
  import CaseItem from './../Cases/PopoverCaseItem'

  export default {
    components: {
      'app-inventory-items': InventoryItems,
      'app-case-item': CaseItem
    },
    data () {
      return {
        options: {
          coinFlipDuration: 3
        },
        coinSide: true,
        flipItems: [],
        amount: {
          min: 1,
          max: 10
        },
        enemy: {
          username: 'Random opponent',
          avatar: 'no-avatar.png',
          items: []
        },
        status: {
          body: 'Skins are taking...',
          loading: true
        },
        animateNumbers: {
          duration: 300
        },
        coinFlips: 10,
        isFlipping: false,
        restartAvailable: false,
        flipAvailable: true,
        waitingBeforeFlip: true,
        victory: null,
        searchEnemySpinner: false,
        buttonText: 'Flip!',
        userItemsPriceFrom: 0,
        userItemsPriceTo: 0,
        userItemsPrice: {
          from: 0,
          to: 0,
          diff: 0
        }
      }
    },
    computed: {
      ...mapGetters([
        'user',
        'paginated',
        'imagesUrl'
      ]),

      flipItemsPrice () {
        return this.flipItems.length > 0 ? this.flipItems.reduce((a, b) => { return a + b.item['price'] }, 0) : 0
      },

      flipItemsPercent () {
        return this.totalItemsPrice === 0 ? 0 : this.flipItemsPrice / this.totalItemsPrice
      },

      enemyItemsPrice () {
        return this.enemy.items.length > 0 ? this.enemy.items.reduce((a, b) => { return a + b.item['price'] }, 0) : 0
      },

      enemyItemsPercent () {
        return this.totalItemsPrice === 0 ? 0 : this.enemyItemsPrice / this.totalItemsPrice
      },

      totalItemsPrice () {
        return this.flipItemsPrice + this.enemyItemsPrice
      },

      enoughItems () {
        return this.flipItems.length >= this.amount.min && this.flipItems.length <= this.amount.max
      },

      previewCoinStyles () {
        return {
          transform: !this.coinSide ? 'none' : 'scale(-1,1)'
        }
      },

      coinFlipStyles () {
        return {
          transform: `rotateY(${180 * this.coinFlips}deg)`,
          transition: this.restartAvailable ? 'none' : `transform ${this.options.coinFlipDuration}s cubic-bezier(0.215, 0.61, 0.355, 1)`
        }
      },

      buttonAvailable () {
        if (this.restartAvailable) {
          return true
        } else {
          return (this.enoughItems && this.flipAvailable)
        }
      }
    },

    beforeRouteLeave (to, from, next) {
      this.paginated.items.forEach((item) => {
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

      priceFormatter (num) {
        return num.toFixed(2)
      },

      addItemToFlip (item) {
        if (this.flipItems.length < this.amount.max && !item.isChosen && !this.restartAvailable) {
          this.flipItems.push(item)
          item.isChosen = true
          this.userItemsPriceTo = item.item.price
          this.userItemsPrice.from = this.userItemsPrice.to
          this.userItemsPrice.to += item.item.price
          this.userItemsPrice.diff = item.item.price
          this.$refs.animateUserItemsPrice.reset(this.userItemsPrice.from, this.userItemsPrice.to)
          this.$refs.animateUserItemsPrice.start()
        }
      },

      removeItemFromFlip (id, item) {
        if (this.waitingBeforeFlip) {
          item.isChosen = null
          this.flipItems.splice(id, 1)
          this.userItemsPriceTo = Math.abs(item.item.price) * -1
          this.userItemsPrice.from = this.userItemsPrice.to
          this.userItemsPrice.to -= Math.abs(item.item.price)
          this.userItemsPrice.diff = Math.abs(item.item.price) * -1
          this.$refs.animateUserItemsPrice.reset(this.userItemsPrice.from, this.userItemsPrice.to)
          this.$refs.animateUserItemsPrice.start()
        }
      },

      flip () {
        // restart
        if (this.restartAvailable) {
          this.flipItems.forEach((item) => {
            item.isChosen = null
          })
          this.$refs.animateUserItemsPrice.reset(this.userItemsPrice.to, 0)
          this.$refs.animateUserItemsPrice.start()
          this.status.body = 'Skins are taking...'
          this.buttonText = 'Flip!'
          this.status.loading = true
          this.isFlipping = false
          this.restartAvailable = false
          this.flipAvailable = true
          this.waitingBeforeFlip = true
          this.victory = null
          this.flipItems = []
          this.enemy.username = 'Random opponent'
          this.enemy.avatar = 'no-avatar.png'
          this.enemy.items = []
          // flip
        } else if (this.enoughItems) {
          this.searchEnemySpinner = true
          this.flipAvailable = false
          this.waitingBeforeFlip = false
          this.status.body = 'Looking for an opponent...'
          let data = this.flipItems.map(a => a.id)

          axios.post('/api/coinflip/flip', { ids: data })
          .then(response => {
            console.log(response.data.victory)
            console.log(response.data.bot.items)
            this.searchEnemySpinner = false
            this.enemy.username = response.data.bot.name
            this.enemy.avatar = response.data.bot.image
            this.enemy.items = response.data.bot.items
            if (response.data.victory) {
              this.coinFlips = this.coinSide ? 10 : 11
            } else {
              this.coinFlips = this.coinSide ? 11 : 10
            }
            this.isFlipping = true
            this.buttonText = 'Flipping...'
            this.status.body = 'Coin is flipping...'
            setTimeout(() => {
              this.victory = response.data.victory
              this.restartAvailable = true
              this.status.loading = false
              this.buttonText = 'Try more?'
              if (this.victory) {
                this.enemy.items.forEach(item => { this.addItemToUser(item) })
                this.increaseUserBalance(this.enemyItemsPrice)
                let itemWord = this.enemy.items.length === 1 ? 'item' : 'items'
                this.status.body = `You won ${this.enemy.items.length} ${itemWord} ($${this.enemyItemsPrice}) with ${(this.flipItemsPercent * 100).toFixed(2)}% chance!`
              } else {
                this.removeItemsFromUser({ ids: data })
                // let usersItemsPrice = this.flipItems.reduce((a, b) => { return a + b['price'] }, 0)
                this.increaseUserBalance(-Math.abs(this.flipItemsPrice))
                let itemWord = this.flipItems.length === 1 ? 'item' : 'items'
                this.status.body = `You lost ${this.flipItems.length} ${itemWord} ($${this.flipItemsPrice.toFixed(2)}) with ${(this.flipItemsPercent * 100).toFixed(2)}% chance!`
              }
            }, this.options.coinFlipDuration * 1000)
          })
          .catch(error => {
            console.log(error)
          })
        }
      },

      toggleCoinSide () {
        if (this.waitingBeforeFlip) {
          this.coinSide = !this.coinSide
        }
      }
    }
  }
</script>

<style>
  .coinflip-avatar {
    width: 150px;
    border-radius: 10px;
    display: block;
    margin: 0 auto 20px;
  }

  .coin-container {
    position: relative;
    margin: 10px auto;
    width: 200px;
    height: 200px;
    z-index: 1;
    perspective: 1000px;
  }

  .coin-card {
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
  }

  .coin {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
  }

  .coin-preview {
    top: 0;
    transition: transform .2s ease-in-out;
  }

  .flip-items-list {
    margin-top: 20px;
  }

  .back-coin {
    display: block;
  }

  .flip-button {
    z-index: 10000;
  }

  .coinflip-choice {
    width: 50px;
    height: 50px;
    margin-top: -70px;
  }

  .coinflip-choice-user {
    margin-left: -140px;
    cursor: pointer;
  }

  .coinflip-choice-enemy {
    margin-right: -140px;
  }

  .spinner {
    margin-left:  145px;
    margin-top: 60px;
    position: absolute;
    width: 50px;
    height: 40px;
    text-align: center;
    font-size: 10px;
  }

  .spinner > div {
    background-color: #333;
    height: 100%;
    width: 6px;
    display: inline-block;

    -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
    animation: sk-stretchdelay 1.2s infinite ease-in-out;
  }

  .spinner .rect2 {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
  }

  .spinner .rect3 {
    -webkit-animation-delay: -1.0s;
    animation-delay: -1.0s;
  }

  .spinner .rect4 {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
  }

  .spinner .rect5 {
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
  }

  @-webkit-keyframes sk-stretchdelay {
    0%, 40%, 100% { -webkit-transform: scaleY(0.4) }
    20% { -webkit-transform: scaleY(1.0) }
  }

  @keyframes sk-stretchdelay {
    0%, 40%, 100% {
      transform: scaleY(0.4);
      -webkit-transform: scaleY(0.4);
    }  20% {
         transform: scaleY(1.0);
         -webkit-transform: scaleY(1.0);
       }
  }

  .list-animate-enter
  {
    opacity: 0;
    transform: translateY(-10px);
  }
  .list-animate-leave-to
  {
    opacity: 0;
    transform: translateY(10px);
  }
  .list-animate-leave-active {
    /*position: absolute;*/
  }
</style>