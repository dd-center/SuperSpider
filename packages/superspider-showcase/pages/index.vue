<template>
  <div>
    <h1>Hi!</h1>
  </div>
</template>

<script>
export default {
  mounted() {
    if (this.$route.query.roomid)
      this.$router.push({
        path: '/utils/sc',
        query: {
          roomid: this.$route.query.roomid
        }
      })
    else this.$router.push('/utils/sc')
  }
}
</script>

<style></style>
