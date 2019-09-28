<template>
  <el-container>
    <el-aside width="300px">
      <el-row>
        <h2 align="center">BiliSC (Beta)</h2>
      </el-row>
      <el-row>
        <el-form ref="form" :rules="rules" :model="form" label-width="150px">
          <el-form-item label="チャンネル">
            <el-input v-model="form.room"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="fetchData">Go</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-aside>
    <el-container>
      <!-- <el-header>Header</el-header> -->
      <el-main>
        <el-row>
          <div align="center">
            <div v-for="ts in scData" :key="ts.ts">
              <h2>{{ new Date(ts.ts).toLocaleString() }} にライブ</h2>
              <div v-for="item in ts.data" :key="item.id" style="margin: 20px;">
                <Superchat
                  :title="item.user_info.uname"
                  :price="Number(item.price)"
                  :message="item.message"
                  :messagejpn="item.message_jpn"
                  :avatar="item.user_info.face"
                  :contentcolor="item.background_bottom_color"
                  :headercolor="item.background_price_color"
                  :exrate="exRate"
                  style="max-width: 700px;"
                  align="left"
                ></Superchat>
              </div>
            </div>
          </div>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Superchat from '~/components/superchat.vue'
export default {
  head: {
    title: 'BiliSC'
  },
  layout: 'empty',
  components: {
    Superchat
  },
  data() {
    return {
      scData: [],
      exRate: 0,
      form: {
        room: ''
      },
      rules: {
        room: [
          { required: true, message: 'Room ID is Required', trigger: 'blur' }
        ]
      }
    }
  },
  async mounted() {
    this.exRate = Number(
      await this.$axios.$get('http://47.100.44.125:2162/sc/getExRate')
    )
  },
  methods: {
    async fetchData() {
      if (
        !this.form.room ||
        isNaN(Number(this.form.room)) ||
        this.form.room === ''
      ) {
        this.$refs.form.validate()
        return
      }
      const scData = (await this.$axios({
        url: 'http://47.100.44.125:2162/sc/getFullList',
        method: 'POST',
        data: 'roomid=' + this.form.room,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })).data
      this.scData = scData
    }
  }
}
</script>

<style></style>
