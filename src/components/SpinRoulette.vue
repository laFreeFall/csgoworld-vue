<template>
  <div
    :style="rouletteStyles"
    class="spin-roulette"
  >
    <div
      :style="containerStyles"
      class="spin-roulette-line"
    >
      <component
        v-for="(item, index) in items"
        :is="itemsComponent"
        :item="item"
        :settings="settings.item"
        :key="index"
      >
      </component>
    </div>
    <div
      class="spin-roulette-pointer"
      :style="pointerStyles"
    >
    </div>
  </div>
</template>

<script>
  import RouletteItem from './Items/RouletteItem.vue'
  import OpencaseItem from './Items/OpencaseItem.vue'

  export default {
    components: {
      'app-roulette-item': RouletteItem,
      'app-opencase-item': OpencaseItem
    },

    props: {
      settings: {
        type: Object,
        required: true
      },

      items: {
        type: Array,
        required: true
      },

      itemsComponent: {
        type: String,
        required: true
      },

      index: {
        type: Number
      },

      isSpinning: {
        type: Boolean,
        required: true
      }
    },

    data () {
      return {
        containerStyles: {
          marginLeft: '0',
          transition: 'none',
          width: `${this.settings.item.width * this.items.length}px`
        }
      }
    },

    computed: {
      windowWidth () {
        return this.settings.roulette.widthInItems * this.settings.item.width
      },

      rouletteStyles () {
        return {
          width: `${this.windowWidth}px`,
          height: `${this.settings.item.height}px`
        }
      },

      pointerStyles () {
        return {
          height: `${this.settings.item.height}px`,
          marginLeft: `${this.windowWidth / 2 + 1}px`
        }
      },

      marginToSpin () {
        if (this.itemsComponent === 'app-opencase-item') {
          let spaceBetweenItems = 2
          return this.index * (this.settings.item.width) +
            (this.index + 1) * spaceBetweenItems -
            (this.windowWidth) / 2 +
            this.randomInteger(this.settings.item.width * 0.1, this.settings.item.width)
        } else {
          return this.index * this.settings.item.width -
            (this.windowWidth) / 2 +
            this.randomInteger(this.settings.item.width * 0.1, this.settings.item.width)
        }
      }
    },

    watch: {
      isSpinning (value) {
        if (value) {
          this.containerStyles.width = `${this.settings.item.width * this.items.length}px`
          this.containerStyles.marginLeft = '0'
          this.containerStyles.transition = 'none'
          setTimeout(() => {
            this.containerStyles.marginLeft = `-${this.marginToSpin}px`
            this.containerStyles.transition = `margin-left ${this.settings.roulette.spin.time / 1000}s cubic-bezier(0.215, 0.61, 0.355, 1)`
          }, 50)
          setTimeout(() => {
            this.$emit('spinned')
          }, this.settings.roulette.spin.time + this.settings.roulette.spin.delay)
        }
      }
    },

    methods: {
      randomInteger (min, max) {
        return Math.floor(min + Math.random() * (max + 1 - min))
      }
    }
  }
</script>

<style>
  .spin-roulette {
    margin: 0 auto;
    overflow: hidden;
    border-radius: 3px;
  }

  .spin-roulette-pointer {
    outline: 2px solid gold;
    /*transition: all .5s ease-in-out;*/
  }

  /*.spin-roulette:after {*/
    /*content:"";*/
    /*position: absolute;*/
    /*!*z-index: 10;*!*/
    /*top: 0;*/
    /*bottom: 0;*/
    /*left: 50%;*/
    /*border-left: 3px solid gold;*/
    /*transform: translate(-50%);*/
    /*height: 70px;*/
  /*}*/

</style>