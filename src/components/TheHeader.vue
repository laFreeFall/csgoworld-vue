<template>
  <nav class="navbar navbar-default">
    <div class="container">
      <div class="navbar-header">
        <button
          type="button"
          class="navbar-toggle collapsed"
          data-toggle="collapse"
          data-target="#header-navbar-collapse"
          aria-expanded="false"
        >
          <span class="sr-only">
            Toggle navigation
          </span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <!--<a class="navbar-brand" href="#">CS:GO world</a>-->
        <router-link
          :to="{ name: 'Home' }"
          class="navbar-brand"
        >
          CS:GO world
        </router-link>
      </div>

      <div
        class="collapse navbar-collapse"
        id="header-navbar-collapse"
      >
        <ul class="nav navbar-nav">
          <router-link
            :to="{ name: 'Cases' }"
            activeClass="'active'"
            tag="li"
          >
            <a>Cases</a>
          </router-link>

          <router-link
            :to="{ name: 'Inventory' }"
            activeClass="'active'"
            tag="li"
          >
            <a>Inventory</a>
          </router-link>

          <router-link
            :to="{ name: 'Roulette' }"
            activeClass="'active'"
            tag="li"
          >
            <a>Roulette</a>
          </router-link>

          <router-link
            :to="{ name: 'Contracts' }"
            activeClass="'active'"
            tag="li"
          >
            <a>Contracts</a>
          </router-link>

          <router-link
            :to="{ name: 'Coinflip' }"
            activeClass="'active'"
            tag="li"
          >
            <a>Coinflip</a>
          </router-link>
          <!--Upgrade-->
        </ul>

        <ul class="nav navbar-nav navbar-right">
          <template v-if="isUserLogged">
            <li class="dropdown">
              <a
                @click.prevent="isDropdownShown = !isDropdownShown"
                href=""
                class="dropdown-toggle"
                data-toggle="dropdown"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {{ user.data.name }} ({{ user.data.balance | money }} | {{ user.data.diamonds | diamonds }} <i class="fa fa-diamond"></i>)
                <span class="caret"></span>
              </a>
              <ul
                v-show="isDropdownShown"
                @click="isDropdownShown = !isDropdownShown"
                class="dropdown-menu"
              >
                <li>
                  <a href="#">
                    <i class="fa fa-user fa-fw"></i> Profile
                  </a>
                </li>
                <li
                  role="separator"
                  class="divider">
                </li>
                <li>
                  <a @click="logUserOut">
                    <i class="fa fa-user-times fa-fw"></i> Logout
                  </a>
                </li>
              </ul>
            </li>

          </template>
          <template v-else>
            <li>
              <router-link
                :to="{ name: 'Auth', params: { action: 'login' } }"
                activeClass="active"
              >
                Login
              </router-link>
            </li>
            <li>
              <router-link
                :to="{ name: 'Auth' , params: { action: 'register' } }"
                activeClass="active"
              >
                Register
              </router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data () {
      return {
        isDropdownShown: false
      }
    },

    computed: {
      ...mapGetters([
        'user',
        'isUserLogged'
      ])
    },

    methods: {
      ...mapActions([
        'logOut',
        'clearItems'
      ]),
      logUserOut () {
        this.clearItems()
        this.logOut()
        this.$router.push({ name: 'Auth', params: { action: 'login' } })
        // router push
        // :to="{ name: 'Auth', params: { action: 'login' } }"
      }
    }
  }
</script>

<style>
  .dropdown-menu {
    display: block;
  }

  li {
    cursor: pointer;
  }
</style>