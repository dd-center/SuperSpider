<template>
  <el-container :style="`height: 100vh; ${fontStyle}`">
    <sider-scrollbar tag="section" style="width: 100%;">
      <el-container align="center" style="width: 100%; overflow-y: overlay;">
        <el-container align="center" style="display: block;">
          <div v-for="liveItem in scData" :key="liveItem.ts" align="center">
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
        </el-container>
      </el-container>
    </sider-scrollbar>
  </el-container>
</template>

<script>
import SiderScrollbar from '~/components/scrollbar'
import Superchat from '~/components/superchat.vue'
export default {
  head: {
    title: 'BiliSC'
  },
  loading: false,
  layout: 'empty',
  components: {
    Superchat,
    'sider-scrollbar': SiderScrollbar
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
      addText: '',
      fontStyle: '',
      bgColor: '',
      bgColorList: ['#304156', '#473252', '#00463f']
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
    '$i18n.locale'() {
      this.fetchAdd()
    }
  },
  async mounted() {
    this.bgColor = this.bgColorList[Math.floor(Math.random() * 3)]
    for (const lang of navigator.languages) {
      if (lang.includes('ja')) {
        this.$i18n.locale = 'ja'
        break
      }
      if (lang.includes('zh')) {
        this.$i18n.locale = 'zh'
        break
      }
    }
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
        'https://bilisc.com/sc/obs?roomid=' +
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
      this.fontStyle = `font-family: ${
        this.$i18n.locale === 'ja'
          ? "'BiliSC Gothic','BiliSC YaHei'"
          : "'BiliSC YaHei'"
      };`
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
        },
        progress: false
      }).catch((e) => {
        err = true
      })
      if (err) return
      // this.$nuxt.$loading.start()
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
      // this.$nuxt.$loading.finish()
    }
  }
}
</script>
