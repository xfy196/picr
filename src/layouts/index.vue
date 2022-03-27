<template>
  <a-layout style="min-height: 100vh">
    <Header></Header>
    <a-layout>
      <Slider />
      <Main />
    </a-layout>
  </a-layout>
</template>
<script setup>
import Main from "./main.vue";
import Slider from "./slider.vue";
import Header from "./header.vue";
</script>
<style lang=""></style>
