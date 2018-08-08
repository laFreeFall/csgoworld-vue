<template>
  <el-popover
    ref="popover1"
    placement="right-start"
    :title="'Additional info'"
    width="300"
    v-model="isPopoverVisible"
    trigger="hover"
  >
    <div
      @click="isPopoverVisible = false"
      slot="reference"
      class="inventory-item-border"
      :style="itemBorderStyles"
    >
      <div
        v-if="!mode.base"
        @click="test"
        class="inventory-item"
        :class="item.isChosen ? 'chosen-item' : ''"
      >
        <div class="inventory-item-image-wrap">
          <img
            :src="imagesUrl + 'items/' + plainItem.image"
            :alt="plainItem.weapon.title + ' ' + plainItem.pattern.title"
            class="inventory-item-image"
          >
          <span class="inventory-item-pill inventory-item-exterior">
            {{ plainItem.exterior.abbr }} {{ mode.abstract ? '' : $options.filters.float(item.float) }}
          </span>
          <span
            v-if="!mode.case"
            class="inventory-item-pill inventory-item-stattrak"
          >
            ST
          </span>
          <span
            v-if="!mode.case"
            class="inventory-item-pill inventory-item-price"
          >
            {{ plainItem.price | money }}
          </span>
          <span
            v-if="!mode.case"
            class="inventory-item-pill inventory-item-amount"
          >
            {{ mode.abstract ? item.count ? 'x' + parseInt(item.count) : '' : $options.filters.float(item.float) }}
          </span>
        </div>
        <div
          class="inventory-item-title"
          :style="{ backgroundColor:  plainItem.quality.color }"
        >
          <div class="inventory-item-weapon">
            {{ itemWeaponTitle }}
          </div>
          <div class="inventory-item-pattern">
            {{ plainItem.pattern.title }}
          </div>
        </div>
      </div>
      <div
        v-else
        class="inventory-item"
      >
        <div class="inventory-item-image-wrap inventory-item-default-image-wrap">
          <!-- remove v-else use plainItem instead-->
          <img :src="imagesUrl + 'items/' + plainItem.image" :alt="plainItem.weapon.title + ' ' + plainItem.pattern.title" class="inventory-item-default-image">
          <span v-if="item.probability">
            {{ item.probability | percent }}
          </span>
        </div>
        <div
          class="inventory-item-title"
          :style="{ backgroundColor: plainItem.quality.color }"
        >
          <div class="inventory-item-weapon">
            {{ plainItem.weapon.title }}
          </div>
          <div class="inventory-item-pattern">
            {{plainItem.pattern.title }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="mode.title === 'contract'">
      <p>Item you might get after trade-up:</p>
      <ul class="list-group">
        <app-case-item
          v-for="potentialItem in potentialItems"
          :list-item="potentialItem"
          :key="potentialItem.id"
          :is-case-item="true"
          :is-pivot-item="false"
        >
        </app-case-item>
      </ul>
    </div>
    <div v-else-if="mode.title === 'inventory' || mode.title === 'coinflip'">
      <p
        class="popup-title"
        :style="{ color: this.plainItem.quality.color }"
      >
        {{ itemFullTitle }}
      </p>
      <img
        :src="imagesUrl + 'items/' + plainItem.image"
        :alt="plainItem.image"
        class="popup-image"
      >
      <div class="popup-button-row">
        <button class="btn btn-default">
          Exterior: <strong>{{ plainItem.exterior.title }}</strong>
        </button>
      </div>
      <div class="popup-button-row">
        <button class="btn btn-default">
          Float: <strong>{{ this.item.float | float }}</strong>
        </button>
        <button class="btn btn-default">
          Price: <strong>{{ plainItem.price | money }}</strong>
        </button>
      </div>
    </div>
    <div v-else-if="(mode.case === true && mode.base === true) || mode.title === 'contract_probability'">
      <p
        class="popup-title"
        :style="{ color: this.plainItem.quality.color }"
      >
        {{ this.plainItem.weapon.title + ' ' + this.plainItem.pattern.title }}
      </p>
      <img
        :src="imagesUrl + 'items/' + plainItem.image"
        :alt="plainItem.image"
        class="popup-image"
      >
      <div v-if="mode.title === 'contract_probability'">
        <div class="popup-button-row">
          <button
            class="btn btn-default"
            :style="{ backgroundColor: makeColorLighter(plainItem.quality.color, 0.4) }"
          >
            Quality: <strong>{{ plainItem.quality.title }}</strong>
          </button>
        </div>
      </div>
      <div v-else-if="!mode.rare">
        <div class="popup-button-row">
          <button
            class="btn btn-default"
            :style="{ backgroundColor: makeColorLighter(plainItem.quality.color, 0.4) }"
          >
            Quality: <strong>{{ plainItem.quality.title }}</strong>
          </button>
        </div>
        <div class="popup-button-row">
          <button class="btn btn-default">
            Min float: <strong>{{ plainItem.min_float | float }}</strong>
          </button>
          <button class="btn btn-default">
            Max float: <strong>{{ plainItem.max_float | float }}</strong>
          </button>
        </div>
        <div
          v-if="availableExteriors.length"
          class="popup-button-row">
          Available:
          <div class="btn-group btn-group-sm">
            <button
              v-for="availableExterior in availableExteriors"
              class="btn btn-default"
            >
              <strong>{{ availableExterior.abbr }}</strong>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>There is no item currently, pick one!</p>
    </div>
  </el-popover>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import itemsColorMixin from './../../mixins/ItemsColors'
  import PopoverCaseItem from './../Cases/PopoverCaseItem'

  export default {
    components: {
      'app-case-item': PopoverCaseItem
    },

    mixins: [itemsColorMixin],

    props: {
      item: {
        type: Object,
        required: true
      },

      mode: {
        type: Object
      }
    },

    data () {
      return {
        stattrakColor: 'rgb(207, 106, 50)',
        souvenirColor: 'rgb(255, 215, 0)',
        exteriorBaseColor: 'rgb(0,128,0)',
        itemModal: false,
        isPopoverVisible: false
      }
    },

    computed: {
      ...mapGetters([
        'imagesUrl',
        'exteriors'
      ]),

      plainItem () {
        if ((this.mode.abstract && !this.mode.frequent) || this.mode.case) {
          return this.item
        }
        return this.mode.base ? this.item : this.item.item
      },

      itemBorderStyles () {
        if (this.item.probability || this.mode.case) {
          return {
            backgroundColor: this.plainItem.quality.color
          }
        }
        let styles = {}
        if (this.plainItem.stattrak) {
          styles = {
            background: `linear-gradient(to bottom, ${this.stattrakColor}, ${this.plainItem.quality.color})`
          }
        } else if (this.plainItem.souvenir) {
          styles = {
            background: `linear-gradient(to bottom, ${this.souvenirColor}, ${this.plainItem.quality.color})`
          }
        } else {
          styles = {
            backgroundColor: this.plainItem.quality.color
          }
        }
        return styles
      },

      itemWeaponTitle () {
        let title = this.plainItem.weapon.title
        if (this.plainItem.stattrak) {
          title = 'Stattrak™ ' + title
        } else if (this.plainItem.souvenir) {
          title = 'Souvenir ' + title
        }
        return title
      },

      itemFullTitle () {
        return `${this.itemWeaponTitle} ${this.plainItem.pattern.title}`
      },

      isVisible () {
        if (this.hidden) {
          return false
        }
        if (!this.id) {
          return true
        }
        if (this.contract) {
          return true
        }
      },

      potentialItems () {
        if (this.plainItem.base_item_id) {
          if (this.plainItem.base_item.stattrak !== 0) {
            let itemContainerId = this.mode.potentialItems.itemables.find(itemable => {
              return itemable.item_id === this.plainItem.base_item.id && itemable.itemable_type === 'container'
            })
            let container = this.mode.potentialItems.containers.filter(currentItem => { return currentItem.id === itemContainerId.itemable_id })
            return container[0].base_items
          } else {
            let itemCollectionId = this.mode.potentialItems.itemables.find(itemable => {
              return itemable.item_id === this.item.item.base_item.id && itemable.itemable_type === 'collection'
            })
            let collection = this.mode.potentialItems.collections.filter(currentItem => { return currentItem.id === itemCollectionId.itemable_id })
            return collection[0].base_items
          }
        }
        return []
      },

      availableExteriors () {
        if (this.plainItem.quality.id === 7) {
          return []
        }
        let availableExts = []
        this.exteriors.forEach(exterior => {
          if (this.plainItem.min_float <= exterior.float_max && this.plainItem.max_float >= exterior.float_min) {
            availableExts.push(exterior)
          }
        })
        return availableExts
      }
    },

    methods: {
      ...mapActions([
        'deleteUserItem',
        'sellUserItem'
      ]),

      test () {
        this.$emit('itemClicked', this.item)
      }
    }
  }
</script>

<style scoped>
  .inventory-item-border {
    border-radius: 10px;
    margin-bottom: 30px;
    display: inline-block;
    padding: 4px;
  }

  .inventory-item-image-wrap {
    padding-top: 10px;
    position: relative;
    background: #ADA996;  /* fallback for old browsers */
    background: linear-gradient(to bottom, #EAEAEA, #DBDBDB, #F2F2F2, #ADA996);
    border-top-right-radius: 7px;
    border-top-left-radius: 7px;
  }

  .inventory-item-default-image-wrap {
    padding-top: 0;
  }

  .inventory-item-image-wrap,
  .inventory-item-image,
  .inventory-item-title {
    width: 117px;
  }

  .inventory-item-default-image {
    width: 117px;
    height: 98px;
  }

  .inventory-item {
    cursor: pointer;
    transition: all .3s ease-in-out;
    user-select: none;
  }

  .inventory-item-title {
    font-size: .85em;
    color: #fff;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  .inventory-item-weapon,
  .inventory-item-pattern {
    white-space: nowrap;
    overflow: hidden;
  }

  .inventory-item-weapon {
    font-weight: bold;
  }

  .inventory-item-pill {
    position: absolute;
    padding: 2px;
    font-size: .85em;
  }

  .inventory-item-exterior {
    top: 0;
    left: 0;
    border-top-left-radius: 6px;
    border-bottom-right-radius: 6px;
    background-color: lightblue;
  }

  .inventory-item-price {
    bottom: 0;
    left: 0;
    border-top-right-radius: 6px;
    background-color: lightgreen;
  }

  .inventory-item-stattrak {
    top: 0;
    right: 0;
    border-top-right-radius: 6px;
    border-bottom-left-radius: 6px;
    background-color: lightyellow;
  }

  .inventory-item-amount {
    bottom: 0;
    right: 0;
    border-top-left-radius: 6px;
    background-color: lightcyan;
  }

  .modal-item-image {
    width: 400px;
  }

  .exterior-progress-pin {
    height: 100%;
    outline: 2px solid green;
    position: relative;
    top: 0;
  }

  .custom-float-bar,
  .custom-float-bar-item {
    height: 20px;
  }

  .custom-float-bar-item {
    font-weight: bold;
    line-height: 20px;
  }

  .custom-float-bar-marks {
    height: 10px;
  }

  .custom-float-bar-mark {
    float: left;
    text-align: left;
    font-size: .8em;
    font-weight: bold;
    line-height: 100%;
  }

  .custom-float-bar-item {
    float: left;
  }

  .custom-float-bar-pin {
    text-align: left;
    font-weight: bold;
  }
  .custom-float-bar-pin span {
    font-size: .8em;
  }

  .modal-item-group {
    margin-bottom: 20px;
  }

  .chosen-item {
    opacity: 0.3;
    filter: blur(1px);
    transition: all .3s ease-in-out;
    cursor: not-allowed;
  }

  .popup-image {
    width: 250px;
  }

  .popup-title {
    text-align: center;
    font-size: 1.2em;
    font-weight: bold;
    overflow: hidden;
  }

  .popup-button-row {
    text-align: center;
    margin-bottom: 10px;
  }

</style>