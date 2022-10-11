<template lang="pug">
button(@click="gg") Tests
</template>

<script lang="ts">
export default {
  name: 'chatView',
};
</script>

<script lang="ts" setup>

const a = 1;
console.log('gg');

function gg() {
  console.log('fuck');
}
</script>
