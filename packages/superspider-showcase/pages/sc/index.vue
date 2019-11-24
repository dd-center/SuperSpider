<template>
  <el-container>
    <el-aside width="300px">
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
          <p style="color: #606266; font-size: 14px;">
            v1.0.2
          </p>
        </div>
        <!-- <h2 align="center">BiliSC (δ)</h2> -->
      </el-row>
      <!-- <el-row>
        <el-link
          href="https://docs.bilisc.com"
          target="_blank"
          type="primary"
          >{{ $t('common.tutorial') }}</el-link
        >
      </el-row> -->
      <el-row>
        <el-form ref="form" label-width="150px" @submit.native.prevent>
          <el-form-item>
            <el-link
              href="https://docs.bilisc.com"
              target="_blank"
              type="primary"
              >{{ $t('common.tutorial') }}</el-link
            >
          </el-form-item>
          <el-form-item>
            <el-link
              href="https://chat.bilisc.com"
              target="_blank"
              type="primary"
              >{{ $t('common.chat') }}</el-link
            >
          </el-form-item>
          <el-form-item :label="$t('common.lang')">
            <LocaleChanger></LocaleChanger>
          </el-form-item>
          <el-form-item :label="$t('common.showTime')">
            <el-switch v-model="showTimeNative"></el-switch>
          </el-form-item>
          <el-form-item :label="$t('common.showGift')">
            <el-switch v-model="showGiftNative"></el-switch>
          </el-form-item>
          <el-form-item :label="$t('common.giftFilter')">
            <el-switch v-model="giftFilterNative"></el-switch>
          </el-form-item>
          <el-form-item :label="$t('common.showKana')">
            <el-switch
              v-if="$i18n.locale == 'ja'"
              v-model="showKanaNative"
            ></el-switch>
            <el-switch
              v-if="$i18n.locale !== 'ja'"
              :value="false"
              disabled
            ></el-switch>
          </el-form-item>
          <el-form-item :label="$t('common.channelid')">
            <el-input
              v-model="room"
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
        <el-link
          style="word-wrap: break-word; word-break: break-all; white-space: pre-wrap; "
          @click="copyText"
        >
          {{ addText }}
        </el-link>
        <el-link @click="copyText">{{ $t('common.copy') }}</el-link>
        <p>{{ $t('sc.t1') }}</p>
        <p>{{ $t('sc.t2') }}</p>
        <p>{{ $t('sc.t3') }}</p>
        <p>
          {{ $t('sc.t4')
          }}<a href="https://faithtown.tech/" target="_blank">Il Harper</a
          >{{ $t('sc.t5') }}
        </p>
        <p>{{ $t('sc.t6') }}</p>

        <a href="https://github.com/dd-center/SuperSpider"
          ><img
            alt="Star BiliSC! "
            src="//githubbadges.com/star.svg?user=dd-center&amp;repo=SuperSpider&amp;style=flat"
        /></a>
      </el-row>
    </el-aside>
    <el-main>
      <el-row>
        <div align="center">
          <div v-for="liveItem in scData" :key="liveItem.ts">
            <h2 v-if="showTimeNative">
              {{ new Date(liveItem.ts).toLocaleString() + $t('sc.livets') }}
            </h2>
            <p
              v-if="!showTimeNative && liveItem.history"
              style="color: #606266; font-size: 14px;"
            >
              {{ $t('sc.history') }}
            </p>
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
                v-if="
                  Number(item.hide) == 0 &&
                    (Number(item.sc) == 1 ||
                      (Number(item.sc) == 0 && showGiftNative))
                "
                :title="
                  $i18n.locale !== 'ja' || !showKanaNative
                    ? item.uname
                    : item.unamejpn && item.unamejpn !== ''
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
      room: '',
      started: false,
      timer: false,
      showTimeNative: true,
      showKanaNative: true,
      showGiftNative: true,
      giftFilterNative: true,
      addText: ''
    }
  },
  computed: {
    showTime() {
      return this.$route.query.showTime
        ? this.$route.query.showTime === 'true'
        : false // This controls the default value
    },
    showKana() {
      return this.$route.query.showKana
        ? this.$route.query.showKana === 'true'
        : true
    },
    showGift() {
      return this.$route.query.showGift
        ? this.$route.query.showGift === 'true'
        : true
    },
    giftFilter() {
      return this.$route.query.giftFilter
        ? this.$route.query.giftFilter === 'true'
        : true
    },
    lang() {
      return this.$i18n.locale || (this.$route.query.lang || 'ja')
    }
  },
  watch: {
    showTimeNative() {
      this.fetchAdd()
    },
    showKanaNative() {
      this.fetchAdd()
    },
    showGiftNative() {
      this.fetchAdd()
    },
    giftFilterNative() {
      this.fetchAdd()
    },
    room() {
      this.fetchAdd()
    },
    $i18n() {
      this.fetchAdd()
    }
  },
  async mounted() {
    this.showTimeNative = this.showTime
    this.showKanaNative = this.showKana
    this.showGiftNative = this.showGift
    this.giftFilterNative = this.giftFilter
    if (this.$route.query.roomid) {
      this.room = this.$route.query.roomid
      if (this.room && this.room !== '') await this.startFetchData()
    }
    this.fetchAdd()
  },
  methods: {
    fetchAdd() {
      this.addText =
        'https://bilisc.com/?roomid=' +
        (this.room || this.$t('common.channelid')) +
        '&showTime=' +
        this.showTimeNative +
        '&showKana=' +
        this.showKanaNative +
        '&showGift=' +
        this.showGiftNative +
        '&giftFilter=' +
        this.giftFilterNative +
        '&lang=' +
        this.$i18n.locale
    },
    copyText() {
      this.$copyText(this.addText).then(
        () => {
          this.$message(this.$t('common.copySucceed'))
        },
        () => {
          this.$message(this.$t('common.copyFailed'))
        }
      )
    },
    beforeDestroy() {
      if (this.timer) clearTimeout(this.timer)
    },
    async startFetchData() {
      if (!this.room) return
      await this.fetchData()
      if (this.started === this.room) return
      if (this.timer) clearTimeout(this.timer)
      this.timer = this.setTimeoutLoop(async () => {
        await this.fetchData()
      }, 8000)
      this.started = this.room
    },
    setTimeoutLoop(call, time) {
      this.timer = setTimeout(async function fn() {
        await call()
        this.timer = setTimeout(fn, time)
      }, time)
    },
    async fetchData() {
      if (!this.room || isNaN(Number(this.room)) || this.room === '') return
      let err = false
      const scData = await this.$axios({
        url: 'https://api.bilisc.com/sc/getData',
        method: 'POST',
        data:
          'roomid=' + this.room + (this.giftFilterNative ? '&filter=on' : ''),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).catch((e) => {
        err = true
      })
      if (err) return
      this.$nuxt.$loading.start()
      // this.scData = scData.data
      for (const item of scData.data) {
        item.data.sort((a, b) => Number(b.ts) - Number(a.ts))
      }
      scData.data.sort((a, b) => Number(b.ts) - Number(a.ts))
      this.scData = []
      let his = 0
      for (const item of scData.data) {
        his++
        if (his === 2) this.scData.push({ ...item, history: true })
        else this.scData.push(item)
      }
      this.$nuxt.$loading.finish()
    }
  }
}
</script>

<style></style>
