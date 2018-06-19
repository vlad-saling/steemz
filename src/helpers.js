import store from './store.js'

export const steemPower = function (vestinShares) {
  // making sure we have data
  if ((store.state.steemGlobal.total_vesting_fund_steem !== undefined) && (store.state.steemGlobal.total_vesting_shares !== undefined)) {
    return Number(store.state.steemGlobal.total_vesting_fund_steem.split(' ')[0] * (vestinShares.split(' ')[0] / store.state.steemGlobal.total_vesting_shares.split(' ')[0])).toFixed(3)
  }
}
