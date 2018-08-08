<template>
  <div class="container">
    <div class="row col-md-12">
      <h2 class="text-center">
        <i class="fa fa-diamond"></i> Diamond Roulette
      </h2>
      <div class="alert alert-info">
        <strong>Status: </strong>
        {{ status.body }}
        <i
          v-show="status.loading"
          class="fa fa-spinner fa-spin"
        >
        </i>
    </div>
      <div class="recent-spins-wrapper">
        <h4 class="text-center">
          Recent spins <router-link :to="{ name: 'RouletteInfo' }" class="badge">logs</router-link>
        </h4>
        <div v-if="!recentSpins">
          <app-loader
            loadingText="Getting last roulette spins..."
            :small="true"
          >
          </app-loader>
        </div>
        <div
          v-else-if="recentSpins.length > 0"
          class="recent-spins"
        >
          <div v-for="recentSpin in recentSpins"
               :style="[recentSpinStyles, { backgroundColor: recentSpin.color }]"
               class="recent-spin"
          >
            {{ recentSpin.title }}
          </div>
        </div>
        <div v-else>
          <div class="alert alert-info">
            There are no previous spins in our history. Make the first one!
          </div>
        </div>
      </div>
      <app-spin-roulette
        :items="items"
        :items-component="'app-roulette-item'"
        :index="index"
        :settings="settings"
        :isSpinning="isSpinning"
        @spinned="finishSpin"
      >
      </app-spin-roulette>
      <div class="control-buttons">
        <button
          class="btn btn-default control-item control-item-balance"
          :style="{ backgroundColor: this.colors.first.color, border: `2px solid ${this.colors.first.color}` }"
        >
          Balance:
           {{ user.data.diamonds | diamonds}}
           <i class="fa fa-diamond"></i>
        </button>

        <input
          type="number"
          min="0"
          step="1"
          max="1000000"
          class="form-control control-input control-item"
          :style="{ backgroundColor: this.colors.second.color }"
          title=""
          placeholder="Bet amount..."
          v-model.lazy="bet.amount"
        >

        <button
          class="btn btn-default control-item control-item-button"
          :style="{ border: `2px solid ${this.colors.first.color}`, color: this.colors.first.color }"
          @click="bet.amount = 0"
        >
          <span>Clear</span>
        </button>

        <button
          class="btn btn-default control-item control-item-button"
          :style="{ border: `2px solid ${this.colors.second.color}`, color: this.colors.second.color }"
          @click="bet.amount = parseInt(bet.amount) + 10"
          :data-color="this.colors.second.color"
        >
          <span>+10</span>
        </button>

        <button
          class="btn btn-default control-item control-item-button"
          :style="{ border: `2px solid ${this.colors.second.color}`, color: this.colors.second.color }"
          @click="bet.amount = parseInt(bet.amount) + 100"
        >
          <span>+100</span>
        </button>

        <button
          class="btn btn-default control-item control-item-button"
          :style="{ border: `2px solid ${this.colors.second.color}`, color: this.colors.second.color }"
          @click="bet.amount = parseInt(bet.amount) + 1000"
        >
          <span>+1000</span>
        </button>

        <button
          class="btn btn-default control-item control-item-button"
          :style="{ border: `2px solid ${this.colors.second.color}`, color: this.colors.second.color }"
          @click="bet.amount = Math.floor(parseInt(bet.amount) / 2)"
        >
          <span>1/2</span>
        </button>

        <button
          class="btn btn-default control-item control-item-button"
          :style="{ border: `2px solid ${this.colors.second.color}`, color: this.colors.second.color }"
          @click="bet.amount = parseInt(bet.amount) * 2"
        >
          <span>x2</span>
        </button>

        <button
          class="btn btn-default control-item control-item-button"
          :style="{ border: `2px solid #337ab7`, color: '#337ab7' }"
          @click="bet.amount = parseInt(user.data.diamonds)"
          data-color="#337ab7"
        >
          <span>Max</span>
        </button>
      </div>
      <div class="clearfix"></div>
      <button
        :disabled="isSpinning"
        @click="startSpin"
        class="btn btn-primary"
      >
        Spin</button>
    </div>
    <div class="row col-md-12">
      <div
        v-for="color in colors"
        class="col-md-4"
      >
        <button
          :style="{ backgroundColor: color.color }"
          @click="makeBet(color)"
          class="btn btn-block bet-color-btn"
        >
          {{ color.diapason }}
        </button>
        <div
          :style="{ color: color.fontColor }"
          class="bet-color-value"
        >
          {{ color.bets | diamonds }} <i class="fa fa-diamond"></i>
        </div>
        <div class="bet-color-value">
          <small>Total bet:</small> {{ color.bets | diamonds }} <i class="fa fa-diamond"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import { mapGetters, mapActions } from 'vuex'
  import SpinRoulette from './../SpinRoulette.vue'
  import Loader from './../Loader.vue'

  export default {
    components: {
      'app-spin-roulette': SpinRoulette,
      'app-loader': Loader
    },
    data () {
      return {
        settings: {
          item: {
            width: 70,
            height: 70
          },
          roulette: {
            widthInItems: 15,
            spin: {
              time: 5000,
              delay: 500
            }
          }
        },
        colors: {
          first: {
            role: 'first',
            title: 'red',
            color: '#b04a43',
            fontColor: '#000',
            diapason: '1 to 7',
            bets: 0
          },
          third: {
            role: 'third',
            title: 'green',
            color: '#6fb26b',
            fontColor: '#000',
            diapason: '0',
            bets: 0
          },
          second: {
            role: 'second',
            title: 'black',
            color: '#444',
            fontColor: '#000',
            diapason: '8 to 14',
            bets: 0
          }
        },
        isSpinning: false,
        items: [],
        index: null,
        item: null,
        status: {
          body: 'Bets are taking...',
          loading: true
        },
        recentSpins: null,
        recentSpinsLimit: 10,
        bet: {
          amount: 0
        },
        betsResults: {},
        profit: 0
      }
    },
    computed: {
      ...mapGetters([
        'user'
      ]),

      recentSpinStyles () {
        return {
          width: `${Math.ceil(this.settings.item.width / 1.5)}px`,
          height: `${Math.ceil(this.settings.item.height / 1.5)}px`,
          lineHeight: `${Math.ceil(this.settings.item.height / 1.5)}px`
        }
      }
    },

    watch: {
      bet: {
        handler (value) {
          if (value.amount > this.user.data.diamonds) {
            this.bet.amount = this.user.data.diamonds
          }
          if (value.amount > 1000000) {
            this.bet.amount = 1000000
          }
          if (value.amount < 0) {
            this.bet.amount = 0
          }
        },
        deep: true
      }
    },
    created () {
      axios.get('/api/roulette')
      .then((response) => {
        let spins = response.data
        this.recentSpins = []
        for (let spin of spins) {
          this.recentSpins.push({
            title: spin.number,
            color: this.colors[spin.color].color,
            group: this.color
          })
        }
      })
      .catch(function (error) {
        console.log(error)
      })
      this.items = this.generateRouletteLine(1)
    },

    methods: {
      ...mapActions([
        'increaseUserDiamonds'
      ]),

      startSpin () {
        let betsData = {
          first: this.colors.first.bets,
          second: this.colors.second.bets,
          third: this.colors.third.bets
        }
        axios.post('/api/roulette/spin', { bets: betsData })
        .then((response) => {
          this.profit = response.data.profit
          this.betsResults = response.data.bets
          this.items = this.generateRouletteLine(response.data.linesAmount)
          this.index = response.data.index
          this.item = this.items[this.index]
          this.isSpinning = true
          this.status.body = 'Spinning...'
        })
        .catch(function (error) {
          console.log(error)
        })
      },

      finishSpin () {
        this.isSpinning = false
        if (this.recentSpins.unshift(this.item) > this.recentSpinsLimit) {
          this.recentSpins.pop()
        }
        if (this.profit > 0) {
          this.increaseUserDiamonds(this.profit)
        }
        for (const key of Object.keys(this.colors)) {
          if (this.colors[key].bets > 0) {
            if (this.betsResults[key]) {
              this.colors[key].bets = `+${this.betsResults[key]}`
              this.colors[key].fontColor = 'green'
            } else {
              this.colors[key].bets = -Math.abs(this.colors[key].bets)
              this.colors[key].fontColor = 'red'
            }
          }
        }
        this.status.body = `Rolled ${this.item.title}, ${this.item.group}!`
        this.status.body = this.item.group === 'green' ? 'Rare thing! ' + this.status.body : this.status.body
        this.status.loading = false
      },

      generateRouletteLine (linesAmount) {
        let iterationsAmount = linesAmount * 7
        let limit = 15
        let resetAt = 8
        let currentIndex = 1
        let itemsArray = []
        for (let i = 0; i < iterationsAmount; i++, currentIndex++) {
          if (currentIndex === resetAt) {
            currentIndex = 1
          }
          itemsArray.push({
            title: currentIndex,
            color: this.colors.first.color,
            group: this.colors.first.title
          })
          if (currentIndex === 4) {
            itemsArray.push({
              title: 0,
              color: this.colors.third.color,
              group: this.colors.third.title
            })
          }
          itemsArray.push({
            title: limit - currentIndex,
            color: this.colors.second.color,
            group: this.colors.second.title
          })
        }
        return itemsArray
      },

      makeBet (color) {
        let bet = parseInt(this.bet.amount)
        if (bet > 0) {
          if (!this.status.loading) {
            for (const key of Object.keys(this.colors)) {
              if (this.colors[key].bets !== 0) {
                this.colors[key].bets = 0
                this.colors[key].fontColor = '#000'
              }
            }
            color.bets = bet
            this.status.body = 'Bets are taking...'
            this.status.loading = true
          } else {
            color.bets += bet
          }
          this.increaseUserDiamonds(-Math.abs(bet))
        }
      }
    }
  }
</script>

<style>
  .recent-spins-wrapper {
    margin-bottom: 15px;
  }

  .recent-spins {
    margin: 0 auto;
    display: inline-block;
  }

  .recent-spin {
    float: left;
    margin-right: 10px;
    border-radius: 50%;
    color: #fff;
    font-size: 1.2em;
    user-select: none;
  }

  .control-buttons {
    margin-top: 20px;
    display: inline-block;
  }

  .control-item-button:hover {
    /*background: attr(data-color, #d6d6d6);*/
    background-color: currentColor;
  }
  .control-item-button span {
    /*.control-item-button span:hover {*/
    color: #000;
  }
  .control-item-button:hover span {
  /*.control-item-button span:hover {*/
    color: #fff;
  }

  .control-item {
    float: left;
    margin-right: 5px;
    border-radius: 10px;
  }

  .control-item-balance {
    cursor: default;
  }

  /*.control-item-balance:active:focus,*/
  /*.control-item-balance:focus,*/
  /*.control-item-balance:active,*/
  /*.control-item-balance:visited,*/
  /*.bet-color-btn:hover:active:focus,*/
  /*.bet-color-btn:hover:focus,*/
  /*.bet-color-btn:hover:hover,*/
  /*.bet-color-btn:hover:visited,*/
  /*.bet-color-btn:hover:active {*/
    /*color: #fff;*/
  /*}*/

  .control-input {
    width: 130px;
    text-align: center;
  }

  .btn-primary {
    margin: 20px auto 30px;
  }

  .control-item-balance,
  .control-item-balance:hover,
  .control-input {
    color: #fff;
  }

  .bet-color-btn {
    color: #fff;
  }

  .bet-color-btn,
  .bet-color-value {
    padding: 10px 0;
    font-weight: bold;
    font-size: 1.2em;
    border-radius: 5px;
  }

  .bet-color-btn:hover {
    opacity: 0.8;
  }

  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }

  .bet-color-value {
    margin: 20px auto;
    background-color: #f0f0f0;
  }

</style>