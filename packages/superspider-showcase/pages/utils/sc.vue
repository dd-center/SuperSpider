<template>
  <el-container>
    <el-aside width="300px">
      <el-row>
        <h2 align="center">BiliSC (Beta)</h2>
      </el-row>
      <el-row>
        <el-form
          ref="form"
          :rules="rules"
          :model="form"
          label-width="150px"
          @submit.native.prevent
        >
          <el-form-item label="チャンネル">
            <el-input
              v-model="form.room"
              autofocus
              @keyup.enter.native="startFetchData"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="startFetchData"
              @keyup.enter.native="startFetchData"
              >Go</el-button
            >
          </el-form-item>
        </el-form>
      </el-row>
      <el-row style="margin: 30px;">
        <p>
          取得が成功すると、ページの上部に青いバーが表示され、SCがロードされます。
        </p>
        <p>取得に失敗すると、ページの上部に赤いバーが表示されます。</p>
        <p>時限更新は自動です。OBSに次のリンクを表示できます。</p>
        <p>http://bilisc.com/?roomid={{ form.room || 'チャンネルID' }}</p>
        <p>
          ご質問がある場合は、<a href="https://faithtown.tech/" target="_blank"
            >Il Harper</a
          >までご連絡ください。
        </p>
        <!-- <p style="font-size: 8px;">
          想要捐助的小伙伴也可以点击上面的链接。捐助将会被用于服务器的维护。
        </p> -->

        <a href="https://github.com/dd-center/SuperSpider"
          ><img
            alt="Star BiliSC! "
            src="http://githubbadges.com/star.svg?user=dd-center&amp;repo=SuperSpider&amp;style=flat"
        /></a>
        <!--
          取得が成功すると、ページの上部に青いバーが表示され、SCがロードされます。
取得に失敗すると、ページの上部に赤いバーが表示されます。
BiliSCは、roomidのクエリパラメーターによってOBSに配置できます。
OBSに次のリンクを表示できます。
ご質問がある場合は、Il Harperまでご連絡ください。

如果获取成功，页面顶端将会显示蓝条并加载SC。
如果获取失败，页面顶端将会显示红条。
可以通过roomid的query参数将BiliSC置入OBS中显示。
可以将下面的链接放入OBS中显示。
如有问题请联系Il Harper。

        -->
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
      },
      started: false,
      interval: false
    }
  },
  async mounted() {
    this.exRate = Number(
      await this.$axios.$get('http://47.100.44.125:2162/sc/getExRate')
    )
    if (this.$route.query.roomid) {
      this.form.room = this.$route.query.roomid
      await this.startFetchData()
    }
  },
  methods: {
    async startFetchData() {
      await this.fetchData()
      if (this.started === this.form.room) return
      if (this.interval) clearInterval(this.interval)
      this.interval = setInterval(async () => {
        await this.fetchData()
      }, 8000)
      this.started = this.form.room
    },
    async fetchData() {
      if (
        !this.form.room ||
        isNaN(Number(this.form.room)) ||
        this.form.room === ''
      ) {
        this.$refs.form.validate()
        return
      }
      let err = false
      const scData = await this.$axios({
        url: 'http://47.100.44.125:2162/sc/getFullList',
        method: 'POST',
        data: 'roomid=' + this.form.room,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).catch((e) => {
        err = true
      })
      if (err) return
      this.scData = scData.data
    }
  }
}
</script>

<style></style>
