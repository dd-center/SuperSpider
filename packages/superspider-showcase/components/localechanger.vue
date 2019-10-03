<template>
  <el-select v-model="$i18n.locale">
    <el-option label="日本語" value="ja"></el-option>
    <el-option label="中文" value="zh"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'LocaleChanger'
}
</script>
