<template>
  <el-container :style="`height: 100vh; ${fontStyle}`">
    <section
      class="sider-label"
      :style="`background-color: ${bgColor}; height: 100vh; width: 450px;`"
    >
      <sider-scrollbar tag="div" style="height: 100vh;" :block-style="true">
        <el-row class="sider-scrollbar-item">
          <div align-center style="text-align: center;">
            <img
              src="~/assets/Logo_Trans.png"
              height="150px"
              width="150px"
              style="text-align: center;"
            />
            <p style="margin: 0;">v1.0.6</p>
          </div>
        </el-row>
        <el-row class="sider-scrollbar-item">
          <el-button-group class="sider-scrollbar-item">
            <el-button
              size="small"
              type="primary"
              plain
              :style="fontStyle"
              @click="openLink('https://docs.bilisc.com')"
              >{{ $t('common.tutorial') }}</el-button
            >
            <el-button
              size="small"
              type="primary"
              plain
              :style="fontStyle"
              @click="openLink('http://chat.bilisc.com')"
              >{{ $t('common.chat') }}</el-button
            >
          </el-button-group>
        </el-row>
        <el-row class="sider-scrollbar-item">
          <el-form
            ref="form"
            label-width="170px"
            size="mini"
            label-position="left"
            @submit.native.prevent
          >
            <el-form-item :label="$t('common.lang')">
              <el-select v-model="$i18n.locale">
                <el-option label="日本語" value="ja"></el-option>
                <el-option label="中文" value="zh"></el-option>
              </el-select>
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
                @keyup.enter.native="startFetchData"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                plain
                icon="el-icon-s-promotion"
                @click="startFetchData"
                @keyup.enter.native="startFetchData"
                >Go</el-button
              >
            </el-form-item>
          </el-form>
        </el-row>
        <el-row class="sider-scrollbar-item">
          <el-button-group class="sider-scrollbar-item">
            <el-button
              size="small"
              type="primary"
              plain
              :style="fontStyle"
              @click="openLink(addText, true)"
              >{{ $t('common.standalone') }}</el-button
            >
            <el-button
              size="small"
              type="primary"
              plain
              :style="fontStyle"
              @click="copyText"
              >{{ $t('common.copy') }}</el-button
            >
          </el-button-group>
        </el-row>
        <el-row class="sider-scrollbar-item">
          <p>{{ $t('sc.t1') }}</p>
          <p>{{ $t('sc.t2') }}</p>
          <p>{{ $t('sc.t3') }}</p>
          <p>
            {{ $t('sc.t4')
            }}<a href="https://faithtown.tech/" target="_blank">Il Harper</a
            >{{ $t('sc.t5') }}
          </p>
          <p>{{ $t('sc.t6') }}</p>

          <a target="_blank" href="https://github.com/dd-center/SuperSpider"
            ><img
              alt="Star BiliSC! "
              src="https://img.shields.io/github/stars/dd-center/superspider?color=brightgreen&label=github%20stars&style=flat-square"
          /></a>
        </el-row>
      </sider-scrollbar>
    </section>
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
        this.$i18n.locale === 'ja' ? "'MS UI Gothic'," : ''
      }'Microsoft YaHei UI','Segoe UI',Tahoma,Geneva,Verdana,sans-serif !important;`
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
    },
    openLink(link, extra) {
      if (extra)
        window.open(
          link,
          'BiliSC for OBS',
          'menubar=0,location=0,scrollbars=0,toolbar=0,width=600,height=600'
        )
      else window.open(link)
    }
  }
}
</script>

<style>
.el-menu-item,
.el-submenu__title {
  height: auto;
}

.sider-scrollbar-item {
  margin: 10px 24px;
}

.el-form-item__label,
.el-switch__label,
.el-link,
.el-link--default,
.el-link.el-link--default,
.sider-label {
  color: white;
  /* font-size: 14px; */
}

.el-button--primary.is-plain {
  color: white;
  background: none;
  border-color: white;
}

.el-input__inner {
  background: none;
  color: white;
}

.el-form-item__content > .el-switch {
  float: right;
}

.el-button-group {
  float: initial;
}
</style>
