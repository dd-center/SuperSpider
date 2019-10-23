<template>
  <div>
    <h1></h1>
  </div>
</template>

<script>
export default {
  head: {
    title: 'BiliSC'
  },
  mounted() {
    this.$router.push({
      path: '/sc',
      query: {
        ...this.$route.query,
        roomid: this.$route.query.roomid || '',
        lang: this.$route.query.lang || 'ja'
      }
    })
  }
}
</script>

<style></style>
