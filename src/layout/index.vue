<template>
  <div class="flex h-full">
    <div class="">
      <!-- 图标和应用名称 -->

      <!-- 菜单内容 -->
      <el-menu default-active="/main/home" router>
        <el-menu-item index="/main/home">首页</el-menu-item>
        <el-menu-item index="/main/image-sort-rename">图片处理</el-menu-item>
      </el-menu>
    </div>
    <div class="flex-1 relative overflow-auto">
      <!-- 主内容区 -->
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<style scoped></style>
