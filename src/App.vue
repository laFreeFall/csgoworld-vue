<template>
  <div id="app">
    <app-header></app-header>
    <router-view/>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import TheHeader from '@/components/TheHeader.vue'

  export default {
    name: 'app',

    components: {
      'app-header': TheHeader
    },

    computed: {
      ...mapGetters([
        'items'
      ])
    },

    created () {
      let userObj = JSON.parse(window.localStorage.getItem('user'))
      this.fetchUser(userObj)
      if (this.items.length === 0 && userObj) {
        this.fetchItems()
      }
    },

    methods: {
      ...mapActions([
        'fetchUser',
        'fetchItems'
      ])
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  .col-xs-5ths,
  .col-sm-5ths,
  .col-md-5ths,
  .col-lg-5ths {
    position: relative;
    min-height: 1px;
    padding-right: 15px;
    padding-left: 15px;
  }

  .col-xs-5ths {
    width: 20%;
    float: left;
  }

  @media (min-width: 768px) {
    .col-sm-5ths {
      width: 20%;
      float: left;
    }
  }

  @media (min-width: 992px) {
    .col-md-5ths {
      width: 20%;
      float: left;
    }
  }

  @media (min-width: 1200px) {
    .col-lg-5ths {
      width: 20%;
      float: left;
    }
  }
</style>
