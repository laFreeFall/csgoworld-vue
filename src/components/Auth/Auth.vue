<template>
  <div class="container">
    <div class="row col-md-8 col-md-offset-2">
      <h2>{{ action }} page</h2>
      <form v-show="!isUserLogged">
        <div class="form-group" v-if="action === 'register'">
          <label for="username">Username:</label>
          <input
            v-model.lazy="userData.name"
            type="text"
            class="form-control"
            id="username"
          >
        </div>
        <div class="form-group">
          <label for="email">Email address:</label>
          <input
            v-model.lazy="userData.email"
            type="email"
            class="form-control"
            id="email"
          >
        </div>
        <div class="form-group">
          <label for="pwd">Password:</label>
          <input
            v-model.lazy="userData.password"
            type="password"
            class="form-control"
            id="pwd"
          >
        </div>
        <div class="form-group" v-if="action === 'register'">
          <label for="pwd-confirmation">Password confirmation:</label>
          <input
            v-model.lazy="userData.password_confirmation"
            type="password"
            class="form-control"
            id="pwd-confirmation"
          >
        </div>
        <button
          @click.prevent="login"
          class="btn btn-primary"
        >
          {{ action }}
        </button>
        <hr>
      </form>
      <div
        v-if="registrationResult.status === 'Success'"
        class="alert alert-success"
      >
        You have successfully registered. Log in with your data now!
      </div>
      <div
        v-else-if="registrationResult.status === 'Error'"
        class="alert alert-warning"
      >
        There was an error during your registration: {{ registrationResult.message }}<br>
        Detailed information below:
        <ul
          v-if="registrationResult.errors"
          class="list-group"
        >
          <li
            v-for="(error, field) in registrationResult.errors"
            class="list-group-item"
          >
            {{ field }}: {{ error[0] }}
          </li>
        </ul>
      </div>
      <hr>
      <div
        v-if="isUserLogged"
        class="alert alert-success"
      >
        You have successfully logged in as {{ user.data.name }} ({{ user.data.email }})!<br>
        <button
          @click="logUserOut"
          class="btn btn-warning"
        >
          Log Out</button>
      </div>
      <div
        v-else
        class="alert alert-danger"
      >
        You are currently not logged in.
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import { mapGetters, mapActions } from 'vuex'
  import { clientId, clientSecret } from '../../env'

  export default {
    props: ['action'],

    data () {
      return {
        userData: {
          name: 'chikabuf',
          email: 'chikabuf@gmail.com',
          password: 'password',
          password_confirmation: 'password'
          // email: 'chikaldirick@gmail.com',
          // password: 'password'
        },
        tempUser: {
          auth: {},
          data: {}
        },
        registrationResult: {
          status: 'Before',
          message: '',
          errors: {}
        }
      }
    },

    computed: {
      ...mapGetters([
        'user',
        'isUserLogged'
      ])
    },

    beforeRouteLeave (to, from, next) {
      this.registrationResult = {
        status: 'Before',
        message: '',
        errors: {}
      }
      next()
    },

    methods: {
      ...mapActions([
        'fetchUserAuth',
        'fetchUserData',
        'logOut',
        'clearItems',
        'fetchItems'
      ]),

      logUserOut () {
        this.clearItems()
        this.logOut()
      },

      login () {
        if (this.action === 'register') {
          if (this.userData.name !== '' && this.userData.email !== '' && this.userData.password !== '') {
            this.registrationResult.status = 'Loading'
            axios.post('/register', this.userData)
            .then((response) => {
              if (response.status === 200) {
                this.registrationResult.status = 'Success'
              }
            })
            .catch((error) => {
              this.registrationResult.status = 'Error'
              this.registrationResult.message = error.response.data.message
              this.registrationResult.errors = error.response.data.errors
            })
          }
        } else if (this.action === 'login') {
          if (this.userData.email !== '' && this.userData.password !== '') {
            let postData = {
              grant_type: 'password',
              client_id: clientId,
              client_secret: clientSecret,
              username: this.userData.email,
              password: this.userData.password,
              scope: ''
            }
            let self = this // TAKE A LOOK HERE, THIS ASSIGN IS NOT NECESSARY, USE LET ES6 FEATURE

            axios.post('/oauth/token', postData)
            .then(function (response) {
              if (response.status === 200) {
                let userAuth = {
                  access_token: response.data.access_token,
                  refresh_token: response.data.refresh_token
                }
                self.fetchUserAuth(userAuth)
                let header = {
                  'Accept': 'application/json',
                  'Authorization': 'Bearer ' + response.data.access_token
                }
                axios.get('/api/user', { headers: header })
                .then(function (response) {
                  if (response.status === 200) {
                    self.tempUser.data = response.data
                    self.fetchUserData(self.tempUser.data)
                    window.localStorage.setItem('user', JSON.stringify(self.user))
                    axios.defaults.headers.common['Authorization'] = self.user.auth.access_token
                    this.fetchItems()
                  }
                })
                .catch(function (error) {
                  console.log(error)
                })
              }
            })
            .catch(function (error) {
              console.log(error)
            })
          }
        }
      }
    }
  }
</script>

<style>
  .btn:hover {
    cursor: pointer;
  }
</style>