<template>
  <li
    class="list-group-item"
    :style="caseItemsStyles"
  >
    <span
      v-if="!isCaseItem"
      class="pull-left"
    >
      {{ item.price | money }}
    </span>
    {{ shortName }}
    <span
      v-if="isDeleteIconDisplayable"
      class="pull-right"
    >
      <button
        class="btn btn-xs"
        @click="$emit('closeButtonClicked', index, listItem)"
      >
        <i class="fa fa-remove"></i>
      </button>
    </span>
  </li>
</template>

<script>
  import { mapGetters } from 'vuex'
  import itemsColorMixin from './../../mixins/ItemsColors'

  export default {
    mixins: [itemsColorMixin],

    props: {
      listItem: {
        type: Object,
        required: true
      },

      isCaseItem: {
        type: Boolean
      },

      isPivotItem: {
        type: Boolean
      },

      isEnemyItem: {
        type: Boolean
      },

      index: {
        type: Number
      }
    },

    computed: {
      ...mapGetters([
        'imagesUrl'
      ]),

      item () {
        return this.isPivotItem ? this.listItem.item : this.listItem
      },

      caseItemsStyles () {
        return {
          backgroundColor: this.makeColorLighter(this.item.quality.color, 0.4),
          color: this.item.quality.color,
          fontWeight: 'bold'
        }
      },

      shortName () {
        if (this.isCaseItem) {
          return `${this.item.weapon.title} ${this.item.pattern.title}`
        }
        let prefix = ''
        if (this.item.stattrak) {
          prefix = 'ST'
        } else if (this.item.souvenir) {
          prefix = 'SV'
        }
        return `${prefix} ${this.item.weapon.title} ${this.item.pattern.title} ${this.item.exterior.abbr}`
      },

      isDeleteIconDisplayable () {
        if (this.isEnemyItem) {
          return false
        }
        return !this.isCaseItem
      }
    }
  }
</script>

<style scoped>
  .case-item-stattrak {
    height: 20px;
  }
  .list-group-item {
    overflow: hidden;
    transition: all .3s ease-in-out;
  }
</style>