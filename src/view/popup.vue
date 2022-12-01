<template>
  <div class="main_app">
    <h1>Let's go!</h1>
    <el-button type="primary" id="openBtn" size="small">Parse Your Json</el-button>
  </div>
</template>

<script>
export default {
  name: 'popupView',
  data () {
    return {
      msg: 'popup'
    }
  }
}

</script>

<style>
.main_app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
</style>
