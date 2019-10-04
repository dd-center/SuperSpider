<template>
  <!-- <el-select v-model="$i18n.locale">
    <el-option label="日本語" value="ja"></el-option>
    <el-option label="中文" value="zh"></el-option>
  </el-select> -->
  <el-switch
    v-model="$i18n.locale"
    active-text="日本語"
    active-value="ja"
    inactive-text="中文"
    inactive-value="zh"
  ></el-switch>
</template>

<script>
export default {
  name: 'LocaleChanger'
}
</script>
