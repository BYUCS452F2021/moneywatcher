<template>
  <div id="app">
    <div id="header">
      <p>
        Money Watcher
      </p>
    </div>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/budget">Budget</router-link> |
      <router-link to="/review">Review</router-link>
    </div>
    <div id="content">
      <router-view />
    </div>
    <div id="footer">
      <div class="link" id="review">
        <router-link to="/review">
          <img src="/icons/money.svg" height="50px">
        </router-link>
      </div>
      <div class="link" id="home">
        <router-link to="/">
          <img src="/icons/add.svg" height="50px">
        </router-link>
      </div>
      <div class="link" id="track">
        <router-link to="/budget">
          <img src="/icons/edit.svg" height="60px">
        </router-link>
      </div>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#header {
  height: 70px;
  background-color: #EEEEEE;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

#nav {
  padding: 30px;
  display: none;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#content {
  padding-bottom: 70px;
  margin: 0 5px;
}

#footer {
  display: flex;
  width: 100%;
  height: 70px;
  position: fixed;
  bottom: 0;
  background-color: #EEEEEE;
  margin: 0;
  padding: 0;
  align-items: center;
}

.link {
  width: 33%;
  margin-top: 10px;
}
</style>
