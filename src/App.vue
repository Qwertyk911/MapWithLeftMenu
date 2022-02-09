<template>
  <div id="app">
    <LeftMenu />
  </div>
</template>

<script>
import LeftMenu from "./components/LeftMenu.vue";

export default {
  name: "App",
  components: {
    LeftMenu,
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
  width: 100%;
  height: 100%;
}
* {
  margin: 0;
  padding: 0;
}
</style>
