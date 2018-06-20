<template>
  <div id="app">
    <div class="header">
        <div class="container">
          <h1 id="message">SteemZ</h1>
          <p>Multiple steem account at a glance</p>

          <div id="nav">
            <router-link to="/">Home</router-link> |
            <router-link to="/about">About</router-link>
          </div>
        </div>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
#nav {
  a {
    font-weight: bold;
    color: #42b983;
    &.router-link-exact-active {
      color: #dbffef;
    }
  }
}

/* style.css
 * This file provides css styles.
 */

body,html {
  background-color: #0c2c3e; width : 100%;
  height: 100%;
  margin: 0 auto;
  font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
  color: #ddd;
}

a {
  text-decoration: none;
  color: #fff;
}

a:hover {
  text-decoration: underline;
}

.header {
  background-color: #1f6892;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  margin-bottom: 20px;
  padding: 10px 0 5px;
}

h1 {
  font-weight: bold;
  font-size: 2em;
  margin: 0;
}

h1 + p {
  margin-top: 0
}

.container {
  width: 90vw;
  margin: 0 auto;
}

.flex {
  display: flex;
  flex-wrap: wrap;
}

.mt0 {
  margin-top: 0;
}

.mb0 {
  margin-bottom: 0;
}

.pt20 {
  padding-top: 20px;
}

</style>
