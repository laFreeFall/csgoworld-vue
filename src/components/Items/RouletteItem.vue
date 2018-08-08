<template>
  <div
    class="item"
    :style="itemStyles"
  >
    {{ item.title }}
  </div>
</template>

<script>
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
      itemStyles () {
        return {
          width: `${this.settings.width}px`,
          height: `${this.settings.height}px`,
          backgroundColor: this.item.color,
          lineHeight: `${this.settings.height}px`
        }
      }
    }
  }
</script>

<style>
  .item {
    float: left;
    /*outline: 1px solid black;*/
    color: #fff;
    font-size: 1.2em;
    user-select: none;
  }
</style>