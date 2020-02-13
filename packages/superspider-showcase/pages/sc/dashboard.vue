<template>
  <el-container>
    <el-main>
      <el-row>
        <div align="center">
          <div v-for="liveItem in scData" :key="liveItem.ts">
            <h2>{{ new Date(liveItem.ts).toLocaleString() }}时开始的直播</h2>
            <div
              v-for="item in liveItem.data"
              :key="item._id"
              style="margin: 20px;"
            >
              <Superchat
                v-if="Number(item.sc) == 1"
                :title="item._id + (item.hide > 0 ? '（隐藏）' : '')"
                :price="Number(item.price)"
                :message="item.msg"
                :messagejpn="item.msgtr !== '' ? item.msgtr : item.msgjpn"
                avatar="https://static.hdslb.com/images/member/noface.gif"
                :contentcolor="item.bcolor"
                :headercolor="item.pcolor"
                :exrate="item.exRate"
                style="max-width: 700px;"
                align="left"
                @click.native="submitForm.id = item._id"
              ></Superchat>
            </div>
          </div>
        </div>
      </el-row>
    </el-main>
    <el-aside width="600px" style="margin-right: 80px;">
      <el-row>
        <div
          align-center
          style="text-align: center; margin: 0 auto; padding: 30px; "
        >
          <img
            src="~/assets/Logo.png"
            height="150px"
            width="150px"
            style="text-align: center; margin: 0 auto; "
          />
        </div>
        <!-- <h2 align="center">BiliSC/Dash (δ)</h2> -->
      </el-row>
      <!-- <el-row>
        <LocaleChanger></LocaleChanger>
      </el-row> -->
      <el-row>
        <el-form
          ref="form"
          :model="form"
          label-width="150px"
          @submit.native.prevent
        >
          <!-- <el-form-item label="语言">
            <LocaleChanger></LocaleChanger>
          </el-form-item> -->
          <el-form-item label="房间号">
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
      <el-row>
        <el-form
          ref="submitForm"
          :model="submitForm"
          label-width="150px"
          @submit.native.prevent
        >
          <el-form-item label="用户名">
            <el-input v-model="submitForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="submitForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="消息ID">
            <el-input v-model="submitForm.id"></el-input>
          </el-form-item>
          <el-form-item label="翻译">
            <el-input v-model="submitForm.tr"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="startHide">隐藏消息</el-button>
            <el-button type="primary" @click="startSubmit">提交翻译</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <p>{{ status }}</p>
      </el-row>
      <el-row style="margin: 30px;">
        <a target="_blank" href="https://github.com/dd-center/SuperSpider"
          ><img
            alt="Star BiliSC! "
            src="http://githubbadges.com/star.svg?user=dd-center&amp;repo=SuperSpider&amp;style=flat"
        /></a>
      </el-row>
    </el-aside>
  </el-container>
</template>

<script>
import qs from 'qs'
import Superchat from '~/components/superchat.vue'
// import LocaleChanger from '~/components/localechanger.vue'
export default {
  head: {
    title: 'BiliSC/Dash'
  },
  layout: 'empty',
  components: {
    Superchat
    // LocaleChanger
  },
  data() {
    return {
      scData: [],
      form: {
        room: ''
      },
      submitForm: {
        username: '',
        password: '',
        id: '',
        tr: ''
      },
      started: false,
      timer: false,
      status: ''
    }
  },
  beforeDestroy() {
    if (this.timer) clearTimeout(this.timer)
  },
  async mounted() {
    if (this.$route.query.roomid) {
      this.form.room = this.$route.query.roomid
      await this.startFetchData()
    }
  },
  methods: {
    async startFetchData() {
      await this.fetchData()
      if (this.started === this.form.room) return
      if (this.timer) clearTimeout(this.timer)
      this.timer = this.setTimeoutLoop(async () => {
        await this.fetchData()
      }, 8000)
      this.started = this.form.room
    },
    setTimeoutLoop(call, time) {
      this.timer = setTimeout(async function fn() {
        await call()
        this.timer = setTimeout(fn, time)
      }, time)
    },
    async fetchData() {
      if (
        !this.form.room ||
        isNaN(Number(this.form.room)) ||
        this.form.room === ''
      )
        return
      let err = false
      const scData = await this.$axios({
        url: 'https://api.bilisc.com/sc/getData',
        method: 'POST',
        data: 'roomid=' + this.form.room + '&filter=on',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).catch((e) => {
        err = true
      })
      if (err) return
      this.scData = scData.data
    },
    async startSubmit() {
      if (
        this.submitForm.username === '' ||
        this.submitForm.password === '' ||
        this.submitForm.id === '' ||
        this.submitForm.tr === ''
      )
        return
      let err = false
      const res = await this.$axios({
        url: 'https://api.bilisc.com/sc/submit',
        method: 'POST',
        data: qs.stringify({
          username: this.submitForm.username,
          password: this.submitForm.password,
          id: this.submitForm.id,
          tr: this.submitForm.tr
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).catch((e) => {
        err = true
      })
      if (err) {
        this.status = '提交失败'
        return
      }
      this.status =
        Number(res.data) === 0
          ? '提交成功'
          : '权限更高的翻译者已经锁定了这条消息的翻译。'
    },
    async startHide() {
      if (
        this.submitForm.username === '' ||
        this.submitForm.password === '' ||
        this.submitForm.id === ''
      )
        return
      let err = false
      const res = await this.$axios({
        url: 'https://api.bilisc.com/sc/hide',
        method: 'POST',
        data: qs.stringify({
          username: this.submitForm.username,
          password: this.submitForm.password,
          id: this.submitForm.id
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).catch((e) => {
        err = true
      })
      if (err) {
        this.status = '隐藏失败'
        return
      }
      this.status =
        Number(res.data) === 0
          ? '隐藏成功'
          : '权限更高的翻译者已经隐藏了这条消息。'
    }
  }
}
</script>

<style></style>
