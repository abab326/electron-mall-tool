<template>
  <div class="p-4">
    <el-button type="primary" class="mb-4" @click="openFileDialog">
      选择图片
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="image/*"
        class="hidden"
        @change="handleFileChange"
      />
    </el-button>

    <draggable
      v-model="images"
      item-key="id"
      class="grid grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg"
      ghost-class="dragging-item"
      chosen-class="chosen-item"
    >
      <template #item="{ element }">
        <div 
          class="relative group border-2 border-gray-200 rounded-lg overflow-hidden transition-all draggable-item"
          :class="{ 
            'border-blue-500': element.isMain,
            'hover:border-blue-300 hover:shadow-md': !element.isMain,
            'hover:border-blue-600': element.isMain
          }"
          style="width: 250px"
        >
          <el-tooltip effect="dark" :content="element.name" placement="top">
            <img :src="element.url" class="w-40 h-40 object-cover" />
          </el-tooltip>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import draggable from "vuedraggable";

type ImageItem = {
  id: string;
  url: string;
  name: string;
};

const images = ref<ImageItem[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);

const openFileDialog = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    Array.from(input.files).forEach((file) => {
      const url = URL.createObjectURL(file);
      images.value.push({
        id: Date.now().toString(),
        url,
        name: file.name,
      });
    });
    // 重置input值以允许重复选择相同文件
    input.value = "";
  }
};
</script>

<style lang="scss" scoped>
/* 保留原有样式 */
.dragging-item {
  opacity: 0.5;
  border: 2px dashed #3b82f6 !important;
}

.chosen-item {
  border: 2px solid #3b82f6 !important;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
}

.draggable-item {
  transition: all 0.3s ease;
  &:hover {
    border-color: #3b82f6;
    transform: scale(1.02);
  }
}
</style>
