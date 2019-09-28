<template>
  <div id="card" class="style-scope yt-live-chat-paid-message-renderer">
    <div
      id="header"
      class="style-scope yt-live-chat-paid-message-renderer"
      :style="{ 'background-color': headercolor }"
    >
      <img
        id="author-photo"
        referrerpolicy="no-referer"
        rel="no-referer"
        class="style-scope yt-img-shadow no-transition style-scope yt-live-chat-paid-message-renderer"
        height="40"
        width="40"
        :src="avatar"
      />
      <div
        id="header-content"
        class="style-scope yt-live-chat-paid-message-renderer"
      >
        <div
          id="header-content-primary-column"
          class="no-transition style-scope yt-live-chat-paid-message-renderer"
        >
          <div
            id="author-name"
            class="style-scope yt-live-chat-paid-message-renderer"
          >
            {{ title }}
          </div>
          <div
            id="purchase-amount"
            class="style-scope yt-live-chat-paid-message-renderer"
            style="transform:scale(0.9);transform-origin: left;"
          >
            {{ '￥' + price + ' = ' + price * exrate + '円' }}
          </div>
        </div>
      </div>
    </div>
    <div
      id="content"
      class="style-scope yt-live-chat-paid-message-renderer"
      :style="{ 'background-color': contentcolor }"
    >
      <div
        id="message"
        dir="auto"
        class="style-scope yt-live-chat-paid-message-renderer"
      >
        {{ message }}
      </div>
      <div
        id="message"
        dir="auto"
        class="style-scope yt-live-chat-paid-message-renderer"
      >
        {{ messagejpn }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '（获取失败）'
    },
    price: {
      type: Number,
      default: 0
    },
    message: {
      type: String,
      default: '（获取失败）'
    },
    messagejpn: {
      type: String,
      default: '（获取失败）'
    },
    avatar: {
      type: String,
      default: 'https://static.hdslb.com/images/member/noface.gif'
    },
    contentcolor: {
      type: String,
      default: '#1565c0'
    },
    headercolor: {
      type: String,
      default: '#125aac'
    },
    exrate: {
      type: Number,
      default: 14.7
    }
  }
  // data() {
  //   return {
  //     imgsrc: ''
  //   }
  // },
  // mounted() {
  //   new Buffer(await this.$axios.$get(this.avatar)).toString('base64')
  // },
}
</script>

<style>
#card.yt-live-chat-paid-message-renderer {
  border-radius: 4px;
  display: flex;
  -ms-flex-direction: column;
  -webkit-flex-direction: column;
  flex-direction: column;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -2px rgba(0, 0, 0, 0.2);
}

#header.yt-live-chat-paid-message-renderer {
  position: relative;
  background-color: var(
    --yt-live-chat-paid-message-header-background-color,
    #125aac
  );
  color: var(--yt-live-chat-paid-message-header-color, #fff);
  font-weight: 500;
  padding: 8px 16px;
  min-height: 20px;
  display: flex;
  -ms-flex-direction: row;
  -webkit-flex-direction: row;
  flex-direction: row;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.no_content {
  border-radius: 4px;
}

#author-photo.yt-live-chat-paid-message-renderer {
  width: 40px;
  height: 40px;
}

#author-photo.yt-live-chat-paid-message-renderer {
  display: block;
  margin-right: 16px;
  overflow: hidden;
  border-radius: 50%;
  -ms-flex: none;
  -webkit-flex: none;
  flex: none;
}

#header-content.yt-live-chat-paid-message-renderer {
  display: flex;
  -ms-flex-direction: row;
  -webkit-flex-direction: row;
  flex-direction: row;
  -ms-flex-pack: justify;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  -ms-flex: 1 1 0.000000001px;
  -webkit-flex: 1;
  flex: 1;
  -webkit-flex-basis: 0.000000001px;
  flex-basis: 0.000000001px;
  -ms-flex-align: baseline;
  -webkit-align-items: baseline;
  align-items: baseline;
}

#header-content-primary-column.yt-live-chat-paid-message-renderer {
  display: flex;
  -ms-flex-direction: column;
  -webkit-flex-direction: column;
  flex-direction: column;
  -ms-flex-pack: justify;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  -ms-flex: 1 1 0.000000001px;
  -webkit-flex: 1;
  flex: 1;
  -webkit-flex-basis: 0.000000001px;
  flex-basis: 0.000000001px;
}

#author-name.yt-live-chat-paid-message-renderer {
  color: var(
    --yt-live-chat-paid-message-author-name-color,
    rgba(255, 255, 255, 0.7)
  );
  font-size: 14px;
  margin-bottom: 2px;
}

#content.yt-live-chat-paid-message-renderer {
  background-color: var(--yt-live-chat-paid-message-background-color, #1565c0);
  color: var(--yt-live-chat-paid-message-color, #fff);
  padding: 8px 16px;
  word-wrap: break-word;
  word-break: break-word;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

#message.yt-live-chat-paid-message-renderer:empty,
#author-name.yt-live-chat-paid-message-renderer:empty:not([is-deleted]).yt-live-chat-paid-message-renderer,
#deleted-state.yt-live-chat-paid-message-renderer:empty {
  display: none;
}

html,
body {
  scroll-behavior: smooth;
}
body {
  margin: 0;
  /* overflow-y: hidden; */
  /* overflow-x: hidden; */
}

html:not(.style-scope) {
  --yt-live-chat-background-color: hsl(0, 0%, 100%);
  --yt-live-chat-action-panel-background-color: hsla(0, 0%, 93.3%, 0.4);
  --yt-live-chat-action-panel-background-color-transparent: hsla(
    0,
    0%,
    97%,
    0.8
  );
  --yt-live-chat-mode-change-background-color: hsla(0, 0%, 93.3%, 0.4);
  --yt-live-chat-primary-text-color: hsl(0, 0%, 6.7%);
  --yt-live-chat-secondary-text-color: hsla(0, 0%, 6.7%, 0.6);
  --yt-live-chat-tertiary-text-color: hsla(0, 0%, 6.7%, 0.4);
  --yt-live-chat-text-input-field-inactive-underline-color: #b8b8b8;
  --yt-live-chat-text-input-field-placeholder-color: hsla(0, 0%, 6.7%, 0.6);
  --yt-live-chat-icon-button-color: hsla(0, 0%, 6.7%, 0.4);
  --yt-live-chat-enabled-send-button-color: #4285f4;
  --yt-live-chat-disabled-icon-button-color: hsla(0, 0%, 6.7%, 0.2);
  --yt-live-chat-picker-button-color: hsla(0, 0%, 6.7%, 0.4);
  --yt-live-chat-picker-button-active-color: hsla(0, 0%, 6.7%, 0.8);
  --yt-live-chat-picker-button-disabled-color: var(
    --yt-live-chat-disabled-icon-button-color
  );
  --yt-live-chat-picker-button-hover-color: hsla(0, 0%, 6.7%, 0.6);
  --yt-live-chat-mention-background-color: #ff5722;
  --yt-live-chat-mention-text-color: hsl(0, 0%, 100%);
  --yt-live-chat-deleted-message-color: rgba(0, 0, 0, 0.5);
  --yt-live-chat-deleted-message-bar-color: rgba(11, 11, 11, 0.2);
  --yt-live-chat-disabled-button-background-color: hsl(0, 0%, 93.3%);
  --yt-live-chat-disabled-button-text-color: hsla(0, 0%, 6.7%, 0.4);
  --yt-live-chat-sub-panel-background-color: hsl(0, 0%, 93.3%);
  --yt-live-chat-sub-panel-background-color-transparent: hsla(0, 0%, 93%, 0.7);
  --yt-live-chat-header-background-color: hsla(0, 0%, 93.3%, 0.4);
  --yt-live-chat-header-button-color: hsl(0, 0%, 6.7%);
  --yt-live-chat-error-message-color: hsl(10, 51%, 49%);
  --yt-live-chat-reconnect-message-color: hsla(0, 0%, 7%, 0.2);
  --yt-live-chat-moderator-color: hsl(225, 84%, 66%);
  --yt-live-chat-owner-color: hsl(40, 76%, 55%);
  --yt-live-chat-author-chip-owner-text-color: rgba(0, 0, 0, 0.87);
  --yt-live-chat-author-chip-verified-background-color: #cccccc;
  --yt-live-chat-author-chip-verified-text-color: #606060;
  --yt-live-chat-message-highlight-background-color: #f8f8f8;
  --yt-live-chat-sponsor-color: #107516;
  --yt-live-chat-overlay-color: hsla(0, 0%, 0%, 0.6);
  --yt-live-chat-dialog-background-color: hsl(0, 0%, 100%);
  --yt-live-chat-dialog-text-color: hsla(0, 0%, 6.7%, 0.6);
  --yt-live-chat-moderation-mode-hover-background-color: hsla(0, 0%, 6.7%, 0.2);
  --yt-live-chat-additional-inline-action-button-color: hsl(0, 0%, 100%);
  --yt-live-chat-additional-inline-action-button-background-color: hsla(
    0,
    0%,
    26%,
    0.8
  );
  --yt-live-chat-additional-inline-action-button-background-color-hover: hsla(
    0,
    0%,
    26%,
    1
  );
  --yt-formatted-string-emoji-size: 24px;
  --yt-live-chat-emoji-size: 24px;
  --yt-live-chat-text-input-field-suggestion-background-color: hsl(0, 0%, 100%);
  --yt-live-chat-text-input-field-suggestion-background-color-hover: #eee;
  --yt-live-chat-text-input-field-suggestion-text-color: #666;
  --yt-live-chat-text-input-field-suggestion-text-color-hover: #333;
  --yt-live-chat-ticker-arrow-background: hsl(0, 0%, 97.3%);
  --yt-emoji-picker-category-background-color: var(
    --yt-live-chat-action-panel-background-color-transparent
  );
  --yt-emoji-picker-category-color: var(--yt-live-chat-secondary-text-color);
  --yt-emoji-picker-category-button-color: var(
    --yt-live-chat-picker-button-color
  );
  --yt-emoji-picker-search-background-color: hsla(0, 0%, 100%, 0.6);
  --yt-emoji-picker-search-color: hsla(0, 0%, 6.7%, 0.8);
  --yt-emoji-picker-search-placeholder-color: hsla(0, 0%, 6.7%, 0.6);
  --yt-live-chat-slider-active-color: #2196f3;
  --yt-live-chat-slider-container-color: #c8c8c8;
  --yt-live-chat-slider-markers-color: #505050;
  --yt-live-chat-toast-background-color: hsl(0, 0%, 20%);
  --yt-live-chat-toast-text-color: hsl(0, 0%, 100%);
  --yt-live-chat-automod-button-background-color: hsl(0, 0%, 93.3%);
  --yt-live-chat-automod-button-background-color-hover: hsla(0, 0%, 6.7%, 0.2);
  --yt-live-chat-countdown-opacity: 0.3;
  --yt-live-chat-shimmer-background-color: rgba(136, 136, 136, 0.2);
  --yt-live-chat-shimmer-linear-gradient: linear-gradient(
    0deg,
    rgba(255, 255, 255, 0) 40%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0) 65%
  );
  --yt-live-chat-vem-background-color: hsl(0, 0%, 93.3%);
  --yt-live-chat-upsell-dialog-renderer-button-padding: 10px 16px;
  --yt-live-chat-product-picker-icon-color: rgba(17, 17, 17, 0.6);
  --yt-live-chat-product-picker-hover-color: rgba(17, 17, 16, 0.1);
  --yt-live-chat-product-picker-disabled-icon-color: rgba(17, 17, 17, 0.4);
  --yt-pdg-paid-stickers-tab-selection-bar-color: #065fd4;
  --yt-pdg-paid-stickers-author-name-font-size: 13px;
  --yt-pdg-paid-stickers-author-subtext-display: inline-block;
  --yt-pdg-paid-stickers-author-subtext-font-size: 13px;
  --yt-pdg-paid-stickers-margin-left: 38px;
}

yt-img-shadow.no-transition {
  opacity: 1;
  transition: none;
}

yt-img-shadow[loaded] {
  opacity: 1;
}

yt-img-shadow {
  display: inline-block;
  opacity: 0;
  transition: opacity 0.2s;
  -ms-flex: none;
  -webkit-flex: none;
  flex: none;
}

img.yt-img-shadow {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
}

img.yt-img-shadow {
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-height: 100%;
  max-width: 100%;
  border-radius: none;
}
</style>
