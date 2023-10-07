<template>
<div class="row" v-for="row of props.grid">
  <div class="field" v-for="(field, index) of row">
    <span v-if="field !== null">{{ field }}</span>
    <input type="text" v-else />
  </div>
</div>
</template>
<script lang='ts' setup>
const props = defineProps(['grid'])

</script>
<style lang='sass' scoped></style>
