<template>
  <el-container>
    <el-aside width="300px">
      <el-row>
        <h2 align="center">BiliSC (γ)</h2>
      </el-row>
      <el-row>
        <LocaleChanger style="margin: 40px;"></LocaleChanger>
      </el-row>
      <el-row>
        <el-form
          ref="form"
          :model="form"
          label-width="150px"
          @submit.native.prevent
        >
          <el-form-item :label="$t('sc.channelid')">
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
        <p>{{ $t('sc.t1') }}</p>
        <p>{{ $t('sc.t2') }}</p>
        <p>{{ $t('sc.t3') }}</p>
        <p>http://bilisc.com/?roomid={{ form.room || $t('sc.channelid') }}</p>
        <p>
          {{ $t('sc.t4')
          }}<a href="https://faithtown.tech/" target="_blank">Il Harper</a
          >{{ $t('sc.t5') }}
        </p>
        <p>{{ $t('sc.t6') }}</p>

        <a href="https://github.com/dd-center/SuperSpider"
          ><img
            alt="Star BiliSC! "
            src="http://githubbadges.com/star.svg?user=dd-center&amp;repo=SuperSpider&amp;style=flat"
        /></a>
      </el-row>
    </el-aside>
    <el-main>
      <el-row>
        <div align="center">
          <div v-for="liveItem in scData" :key="liveItem.ts">
            <h2>
              {{ new Date(liveItem.ts).toLocaleString() + $t('sc.livets') }}
            </h2>
            <div
              v-for="item in liveItem.data"
              :key="item._id"
              style="margin: 20px;"
            >
              <!--
                              :title="
                  item.uname +
                    ($i18n.locale !== 'ja'
                      ? ''
                      : item.unamejpn
                      ? ' (' + item.unamejpn + ')'
                      : '')
                "
            -->
              <Superchat
                v-if="Number(item.hide) == 0"
                :title="
                  item.unamejpn && item.unamejpn !== ''
                    ? item.unamejpn
                    : item.uname
                "
                :price="Number(item.price)"
                :message="item.msg"
                :messagejpn="
                  $i18n.locale !== 'ja'
                    ? ''
                    : item.msgtr !== ''
                    ? item.msgtr
                    : item.msgjpn
                "
                :avatar="item.avatar"
                :contentcolor="item.bcolor"
                :headercolor="item.pcolor"
                :exrate="item.exRate"
                :hiderate="$i18n.locale == 'zh'"
                style="max-width: 700px;"
                align="left"
              ></Superchat>
            </div>
          </div>
        </div>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import Superchat from '~/components/superchat.vue'
import LocaleChanger from '~/components/localechanger.vue'
export default {
  head: {
    title: 'BiliSC'
  },
  layout: 'empty',
  components: {
    Superchat,
    LocaleChanger
  },
  data() {
    return {
      scData: [],
      form: {
        room: ''
      },
      started: false,
      interval: false
    }
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
      )
        return
      let err = false
      const scData = await this.$axios({
        url: 'https://api.bilisc.com/sc/getData',
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
