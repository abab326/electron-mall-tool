<template>
  <div class="flex h-full">
    <el-button type="primary" size="default" @click="selectExcel">
      选择Excel文件
    </el-button>
  </div>
</template>

<script setup lang="ts">
const selectExcel = async () => {
  const excelPath = await window.ipcRenderer.selectExcel();
  if (excelPath) {
    console.log('选择的Excel文件路径:', excelPath);
  }
  const data = await window.ipcRenderer.parseExcel(excelPath);
  if (data) {
    console.log('Excel数据:', data);
  }
};
</script>

<style lang="scss" scoped></style>
