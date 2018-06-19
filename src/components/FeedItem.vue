<template>
  <div class="feed-item">
    <div v-html="formatedFeedItem(type, data, currentAccount)"></div>
  </div>
</template>

<script>
import { steemPower } from '../helpers.js'

export default {
  name: 'FeedItem',
  props: {
    type: String,
    data: Object,
    currentAccount: String
  },
  methods: {
    steemPower: steemPower,
    createSteemitPostLink: function (author, permlink) {
      return '<a href=\'https://steemit.com/@' +
      author +
      '/' +
      permlink +
      '\'>' +
      permlink +
      '</a>'
    },
    createSteemitAuthorLink: function (author) {
      return '<a href=\'https://steemit.com/@' +
      author +
      '/' +
      '\'>' +
      author +
      '</a>'
    },
    formatedFeedItem: function (type, data, currentAccount) {
      if (type === 'custom_json') {
        const OBJ = JSON.parse(data.json)
        if (OBJ[0] === 'reblog') {
          return '<span class=\'reblog\'>' +
          OBJ[0] +
          '</span> ' +
          this.createSteemitPostLink(OBJ[1].author, OBJ[1].permlink)
        } else if (OBJ[0] === 'follow') {
          return '<span class=\'follow\'>' +
          this.createSteemitAuthorLink(OBJ[0]) +
          '</span> ' +
          OBJ[1].following
        }
      } else if (type === 'vote') {
        if ((currentAccount === data.voter) && (data.author === data.voter)) {
          return '<span class=\'self-vote\'>vote ◻</span> ' +
          this.createSteemitAuthorLink(data.voter) +
          ' upvoted ' +
          this.createSteemitPostLink(data.author, data.permlink)
        } else if ((currentAccount === data.voter)) {
          return '<span class=\'outgoing-vote\'>vote ◹</span> ' +
          this.createSteemitAuthorLink(data.voter) +
          ' upvoted ' +
          this.createSteemitPostLink(data.author, data.permlink)
        } else {
          return '<span class=\'incoming-vote\'>vote ◺</span> ' +
          data.voter +
          ' upvoted ' +
          this.createSteemitPostLink(data.author, data.permlink)
        }
      } else if (type === 'comment') {
        if (data.parent_author === '') {
          return '<span class=\'post\'>post</span> ' +
          this.createSteemitAuthorLink(data.author) +
          ' posted ' +
          this.createSteemitPostLink(data.author, data.permlink)
        } else {
          return '<span class=\'comment\'>commnet</span> ' +
          this.createSteemitAuthorLink(data.author) +
          ' commneted on ' +
          this.createSteemitPostLink(data.author, data.permlink)
        }
      } else if (type === 'claim_reward_balance') {
        return '<span class=\'reward\'>claimed reward</span> ' +
        data.reward_sbd +
        ', ' +
        this.steemPower(data.reward_vests) +
        ' SP'
      } else if (type === 'author_reward') {
        return '<span class=\'reward\'>reward</span> ' +
        data.sbd_payout +
        ', ' +
        this.steemPower(data.vesting_payout) +
        ' SP for ' +
        this.createSteemitPostLink(data.author, data.permlink)
      } else if (type === 'curation_reward') {
        return '<span class=\'reward\'>curation reward</span> ' +
        this.steemPower(data.reward) +
        ' SP'
      } else if ((type === 'transfer') || (type === 'transfer_to_vesting')) {
        return '<span class=\'reward\'>transfer</span> ' +
        data.amount +
        ' from ' +
        data.from +
        ' to ' +
        data.to
      } else if (type === 'delegate_vesting_shares') {
        return '<span class=\'delegated\'>delegated</span> ' +
        this.steemPower(data.vesting_shares) +
        ' SP' +
        ' from ' +
        this.createSteemitAuthorLink(data.delegator) +
        ' to ' +
        this.createSteemitAuthorLink(data.delegatee)
      } else if (type === 'account_update') {
        return '<span class=\'update\'>account_update</span>'
      } else {
        console.log(type, data)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.reblog,
.follow,
.self-vote,
.outgoing-vote,
.incoming-vote,
.comment,
.post,
.reward,
.update,
.delegated {
  padding: 0px 3px;
  border: 1px solid #ffffff45;
}

.reblog {
  background-color: #72f7d6;
  color: black
}

.follow {
  background-color: white;
  color: black
}

.self-vote {
  background-color: blue;
  color: white
}

.outgoing-vote {
  background-color: #7f41b9;
  color: white
}

.incoming-vote {
  background-color: green;
  color: white
}

.comment {
  background-color: gray;
  color: white
}

.post {
  background-color: #830000;
  color: white
}

.reward {
  background-color: gold;
  color: black
}

.update {
  background-color: black;
  color: white
}

.delegated {
  background-color: skyblue;
  color: black
}
</style>
