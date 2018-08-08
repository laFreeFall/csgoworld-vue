<template>
  <el-dialog
    :title="isNew ? 'You\'ve got a new item!' : 'Info about your item'"
    :visible.sync="modalState"
    :before-close="handleClose"
    width="550px"
  >
    <div v-if="itemPivot">
      <h4 :style="{ color: itemPivot.item.quality.color }">
        {{ itemFullTitle }}
      </h4>
      <img
        :src="imageSource + itemPivot.item.image"
        :alt="itemFullTitle"
        :title="itemFullTitle"
        class="modal-item-image"
      >
      <div
        class="btn-group"
        style="margin-bottom: 10px"
      >
        <button
          v-if="itemPivot.item.stattrak"
          :style="{ color: stattrakColor }"
          type="button"
          class="btn btn-default"
        >
          <strong>Stattrak™</strong>
        </button>
        <button
          type="button"
          class="btn btn-default"
        >
          Weapon: <strong>{{ itemPivot.item.weapon.title }}</strong>
        </button>
        <button
          type="button"
          class="btn btn-default"
        >
          Pattern: <strong>{{ itemPivot.item.pattern.title }}</strong>
        </button>
      </div>

      <div
        class="btn-group"
        style="margin-bottom: 10px"
      >
        <button
          type="button"
          class="btn btn-default"
        >
          Received <strong>{{ itemDate }}</strong>
        </button>
        <button
          type="button"
          class="btn btn-default"
        >
          From <strong>{{ itemPivot.source.title.toLowerCase() }}</strong>
        </button>
      </div>

      <div class="btn-group modal-item-group">
        <button
          type="button"
          class="btn btn-default"
        >
          Exterior: <strong>{{ itemPivot.item.exterior.abbr }}</strong>
        </button>
        <button
          type="button"
          class="btn btn-default"
        >
          Float: <strong>{{ itemPivot.float | float }}</strong>
        </button>
        <button
          type="button"
          class="btn btn-default"
        >
          Price: <strong>{{ itemPivot.item.price | money }}</strong>
        </button>
      </div>

      <div

        class="custom-float-bar-pin"
      >
        <span :style="{ float: 'left', marginLeft: itemPivot.float * 100 + '%' }">
          <i class="fa fa-sort-desc"></i>
          {{ itemPivot.float | float }}
        </span>
      </div>
      <div class="clearfix"></div>
      <div class="custom-float-bar">
        <div
          v-for="exterior in exteriors"
          :style="{ width: (exterior.float_max - exterior.float_min) * 100 + '%', backgroundColor: makeColorLighter(exteriorBaseColor, 0.15 * exterior.id) }"
          class="custom-float-bar-item"
        >
          {{ exterior.abbr }}
        </div>
      </div>
      <div class="custom-float-bar-marks">
        <div
          v-for="exterior in exteriors"
          :style="{ width: (exterior.float_max - exterior.float_min) * 100 + '%' }"
          class="custom-float-bar-mark"
        >
          <span style="float: left">
            {{ exterior.float_min }}
          </span>
          <span
            v-if="exterior.float_max === 1.00"
            style="float: right"
          >
            {{ exterior.float_max | float }}
          </span>
        </div>
      </div>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleClose">
          <!--Close-->
          {{ isNew ? 'Store item' : 'Cancel' }}
        </el-button>
        <el-button
          v-if="itemPivot.item.price < 1"
          type="warning"
          @click="deleteItem"
        >
          Delete item
          <i class="fa fa-trash"></i>
        </el-button>
        <el-button
          v-else
          type="primary"
          @click="deleteItem"
        >
          Sell for {{ Math.floor(itemPivot.item.price) }}
          <i class="fa fa-diamond"></i>
        </el-button>
      </span>
    </div>

  </el-dialog>
</template>

<script>
  import moment from 'moment'
  import { mapActions, mapGetters } from 'vuex'
  import itemsColorMixin from './../mixins/ItemsColors'

  export default {
    mixins: [itemsColorMixin],

    props: {
      itemPivot: {
        type: Object
      },

      isModalShown: {
        type: Boolean,
        required: true
      },

      isNew: {
        type: Boolean
      }
    },

    data () {
      return {
        imageSource: 'http://csgoworld.loc/storage/images/items/',
        stattrakColor: 'rgb(207, 106, 50)',
        souvenirColor: 'rgb(255, 215, 0)',
        exteriorBaseColor: 'rgb(0,128,0)',
        modalState: this.isModalShown
      }
    },
    computed: {
      ...mapGetters([
        'exteriors'
      ]),

      itemFullTitle () {
        let title = `${this.itemPivot.item.weapon.title} ${this.itemPivot.item.pattern.title} ${this.itemPivot.item.exterior.title}`
        if (this.itemPivot.item.stattrak) {
          title = 'Stattrak™ ' + title
        } else if (this.itemPivot.item.souvenir) {
          title = 'Souvenir ' + title
        }
        return title
      },

      itemDate () {
        return this.itemPivot.created_at ? moment(this.itemPivot.created_at, 'YYYY-MM-DD H:m:s').format('Do MMM YYYY, HH:mm') : 0
      }
    },

    watch: {
      isModalShown (value) {
        this.modalState = value
      }
    },
    methods: {
      ...mapActions([
        'deleteUserItem'
      ]),

      deleteItem () {
        this.deleteUserItem({ id: this.itemPivot.id })
        this.handleClose()
      },

      handleClose () {
        this.modalState = false
        this.$emit('modalClosed')
      }
    }
  }
</script>

<style>
  .custom-float-bar-item,
  .custom-float-bar-mark {
    float: left;
  }
</style>