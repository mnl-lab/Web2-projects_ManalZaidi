<template>
  <div id="app">
    <!-- Navigation will show on all pages -->
    <NavBar />

    <!-- Router view renders the current page component -->
    <router-view></router-view>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';

export default {
  name: 'App',
  components: {
    NavBar
  }
}
</script>

<style>

</style>