<template>
  <div
    class="opencase-item"
    :style="itemStyles"
  >
    <div class="opencase-item-image-wrap">
      <img
        :src="imagesUrl + 'items/' + item.image"
        :alt="item.weapon.title + ' | ' + item.pattern.title"
        class="opencase-item-image"
      >
    </div>
    <div
      class="opencase-item-title"
      :style="{ backgroundColor: item.quality.color }"
    >
      <strong>{{ item.weapon.title }}</strong><br>{{ item.pattern.title }}
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    props: {
      item: {
        type: Object
      },

      settings: {
        type: Object
      }
    },
    computed: {
      ...mapGetters([
        'imagesUrl'
      ]),

      itemStyles () {
        return {
          width: `${this.settings.width}px`,
          height: `${this.settings.height}px`
          // backgroundColor: this.item.color,
          // lineHeight: `${this.settings.height}px`
        }
      }
    }
  }
</script>

<style>
  .opencase-item {
    float: left;
    color: #fff;
    user-select: none;
    margin-right: 2px;
  }

  .opencase-item-image-wrap {
    background-color: #ccc;
  }

  .opencase-item-image {
    width: 100%;
  }

  .opencase-item-title {
    white-space: nowrap;
    overflow: hidden;
    font-size: 0.85em;
    color: #000;
  }
</style>