<template>
  <div class="col-md-4 col-sm-3 col-xs-2 col-m case">
    <br>
    <router-link
      :to="{ name: 'OpenCase', params: { type: caseType, id: itemCase.id } }"
      class="itemcase-title"
    >
      {{ itemCase.title }}
    </router-link>
    <br>
    <template v-if="itemCase.base_items.length">
      <el-popover
        ref="popover1"
        placement="right-start"
        :title="itemCase.title"
        width="300"
        trigger="hover"
      >
        <router-link
          :to="{ name: 'OpenCase', params: { type: caseType, id: itemCase.id } }"
          tag="img"
          :src="imagesUrl + 'cases/' + itemCase.image"
          :alt="itemCase.title"
          slot="reference"
          class="itemcase-image"
        >
        </router-link>
        <div>
          <strong>
            {{ itemCase.base_items.length }} Items in the case
          </strong>
          <ul class="list-group">
            <app-case-item
              v-for="caseItem in itemCase.base_items"
              :list-item="caseItem"
              :is-case-item="true"
              :is-pivot-item="false"
              :key="caseItem.id"
            >
            </app-case-item>
            <li
              v-if="itemCase.series"
              class="list-group-item"
              :style="rareItemStyles"
            >
              {{ itemCase.rare.title }}
            </li>
          </ul>
        </div>
      </el-popover>
    </template>
    <template v-else>
      <router-link
        :to="{ name: 'OpenCase', params: { type: caseType, id: itemCase.id } }"
        :src="imagesUrl + 'cases/' + itemCase.image"
        tag="img"
        :alt="itemCase.title"
        class="itemcase-image"
      >
      </router-link>
    </template>
    <hr>
    <div class="clearfix"></div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import PopoverCaseItem from './PopoverCaseItem.vue'
  import itemsColorMixin from './../../mixins/ItemsColors'

  export default {
    components: {
      'app-case-item': PopoverCaseItem
    },

    mixins: [itemsColorMixin],

    props: {
      itemCase: {
        type: Object,
        required: true
      }
    },

    computed: {
      ...mapGetters([
        'imagesUrl'
      ]),

      caseType () {
        return this.itemCase.series ? 'container' : 'collection'
      },

      rareItemStyles () {
        return {
          backgroundColor: this.makeColorLighter('rgb(207, 167, 13)', 0.4),
          color: 'rgb(207, 167, 13)',
          fontWeight: 'bold'
        }
      }
    }
  }
</script>

<style scoped>
  .itemcase-image {
    cursor: pointer;
    height: 170px;
    /*opacity: 0.8;*/
    transition: opacity .3s ease-in-out;
  }

  .itemcase-image:hover {
    /*opacity: 1;*/
    /*transition: opacity .3s ease-in-out;*/
  }

  .itemcase-title {
    font-size: 1.1em;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
  }

  .fade-hover-link::after {
    content: '';
    display: block;
    width: 0;
    height: 2px;
    background: #000;
    transition: width .3s;
  }

  .fade-hover-link:hover::after {
    width: 100%;
    transition: width .3s;
  }
</style>