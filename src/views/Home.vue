<template>
  <div class="home">
      <div class="container">

      <button v-on:click="refresh">Refresh</button> {{ message }}<br /><br />

      <form v-on:submit.prevent="addUser">
        <label>Steem username: </label><br />
        <input v-model.lazy="newUser" type="text" placeholder="username" /><button type="submit">Add user</button>  {{ actionResult }}
      </form>

      <div class="flex pt20">
      <div v-for="user in users" class="user" v-bind:key="user.id">
        <span class="avatar" v-bind:style="{ backgroundImage: 'url(' + userImage(user.json_metadata) + ')' }">avatar image</span>

        <h3 class="mt0 mb0">
          {{ user.name }} <span style="font-weight: normal">({{ reputationParser(user.reputation) }})</span>
          <button class="remove" v-on:click="removeUser(user.name)">x</button>
        </h3>

        <p class="mt0" style="overflow: hidden">
          {{ user.post_count }} <small>posts</small><br />
          {{ votingPower(user.name, user.last_vote_time , user.voting_power) }}% <small>voting power</small><br />
          {{ followers[user.name] }} <small>followers</small><br />
          <!-- steem -->
          {{ steemPower(user.vesting_shares) }} SP<br />
          {{ user.sbd_balance }}<br />
          {{ user.balance }}
        </p>

        <span>Activity: </span>
        <ul class="feed">
          <li v-for="record in accountsHistory[user.name]" v-bind:key="record.id">
            <FeedItem :type="record[1].op[0]" :data="record[1].op[1]" :currentAccount="user.name" />
          </li>
        </ul>

      </div>
    </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import FeedItem from '@/components/FeedItem.vue'
import store from '../store.js'
import { steemPower } from '../helpers.js'
// steem is loaded from CDN cause build fail if it's pull from NPM due to crypto.randomBytes issue
const STEEM = window.steem

export default {
  store,
  data: function () {
    return {
      message: 'app status',
      actionResult: '',
      newUser: '',
      users: [],
      userList: [],
      followers: {},
      accountsHistory: {}
    }
  },
  name: 'home',
  components: {
    FeedItem
  },
  computed: {
    steemGlogal: function () {
      return this.$store.getters.steemGlobal
    }
  },
  created: function () {
    if (window.localStorage.getItem('steem-zero-userlist') !== undefined) {
      this.userList = window.localStorage.getItem('steem-zero-userlist').split(',')
      this.loadUsername()
    }

    STEEM.api.getDynamicGlobalProperties((err, result) => {
      if (err) {
        console.log(err)
        return
      }

      store.dispatch({
        type: 'steemGlobal',
        data: result
      })
    })
  },
  methods: {
    addUser () {
      if (this.userList.indexOf(this.newUser) >= 0) {
        this.actionResult = 'user already exists'
      } else {
        this.userList.push(this.newUser)
        // save user to local storage
        window.localStorage.setItem('steem-zero-userlist', this.userList)
        this.refresh()
      }
    },
    removeUser (userName) {
      let newUserList = this.userList.filter(user => user !== userName)
      this.userList = newUserList
      window.localStorage.setItem('steem-zero-userlist', this.userList)
      this.refresh()
    },
    refresh () {
      this.loadUsername()
    },
    loadUsername () {
      let vm = this
      STEEM.api.getAccounts(this.userList, function (err, response) {
        if (err) {
          console.log(err)
          return
        }
        vm.users = response

        vm.users.forEach(function (user) {
          STEEM.api.getFollowCount(user.name, function (err, result) {
            if (err) {
              console.log(err)
              return
            }
            vm.$set(vm.followers, user.name, result.follower_count)
          })

          STEEM.api.getAccountHistory(user.name, -1, 25, function (err, result) {
            if (err) {
              console.log(err)
              return
            }
            // before storing feed we have to flip it for latest to oldest order
            vm.$set(vm.accountsHistory, user.name, result.slice().reverse())
            // console.log(vm.accountsHistory[user.name])
          })
        })
      })
    },
    reputationParser (reputation) {
      let log = Math.log(reputation) / Math.log(10)
      log = log - 9
      log = log * 9
      log = log + 25

      if (log <= 25) {
        return 25
      } else {
        return Number(log).toFixed(3)
      }
    },
    votingPower (user, lastVote, currentVotingPower) {
      const secondsago = (new Date().getTime() - new Date(lastVote + 'Z').getTime()) / 1000
      const realVotingPower = currentVotingPower + (10000 * secondsago / 432000)

      if (realVotingPower >= 10000) {
        // notify user if they one of the accounts has 100% voting power
        // TODO: think about preventing multiple push notifs on full power or provide way to remove notifs per account
        // if (Notification.permission === "granted") {
        //     const NOTIFICATION = new Notification(user + "'s voting power is full");
        // }
        return 100
      } else {
        return Number(realVotingPower / 100).toFixed(2)
      }
    },
    steemPower: steemPower,
    userImage (jsonData) {
      const OBJ = JSON.parse(jsonData)

      if ((OBJ.profile !== undefined) && (OBJ.profile.profile_image !== undefined)) {
        return (OBJ.profile.profile_image)
      } else {
        return 'i/steemit.png'
      }
    },
    parseCustomJson (jsonData) {
      const OBJ = JSON.parse(jsonData)
      return (OBJ[0])
    }
  }
}
</script>

<style lang="scss">
.user {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: auto;
  background-color: #0f364c;
  padding: 8px 10px;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 15px;
}

@media only screen and (min-width: 480px) {
  .user {
    flex-basis: 49%;
    max-width: 49%;
    margin-right: 1%;
  }
}

@media only screen and (min-width: 1024px) {
  .user {
    flex-basis: 32%;
    max-width: 32%;
    margin-right: 1%;
  }
}

.remove {
  background: black;
  border: 1px solid #ffffff45;
  color: #a7c2d2;
  border-radius: 50%;
  height: 23px;
  width: 23px;
  text-align: center;
  float: right
}

.feed {
  padding-left: 0px;
  font-size: 12px;
  list-style: none;
  line-height: 1.5em;
  word-break: break-word;
}

.feed li {
  margin-bottom: 10px;
}

.avatar {
  float: left;
  margin-right: 10px;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background-size: cover;
  background-repeat: no-repeat;
  font-size: 0;
}
</style>
