<template>
  <div>
    <h1></h1>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$router.push({
      path: '/sc',
      query: {
        roomid: this.$route.query.roomid || '',
        lang: this.$route.query.lang || 'ja'
      }
    })
  }
}
</script>

<style></style>
