<template>
  <div>
    <div class="flex items-center p-2">
      <span>图片前缀：</span>
      <el-input class="flex-1" v-model="imagePrefix" placeholder="" clearable />
      <el-button class="ml-4" type="primary" @click="saveImages"
        >保存图片</el-button
      >
    </div>
    <!-- 主图选择 -->
    <div class="p-x-2">
      <span>主图选择</span>
      <el-button
        class="m-l-2"
        type="primary"
        size="small"
        @click="openFileDialog('main')"
      >
        选择图片
      </el-button>

      <draggable v-model="mainImages" item-key="id" class="grid-container">
        <template #item="{ element }">
          <div class="relative flex items-center">
            <span
              absolute
              top-1
              right-1
              z-10
              w-4
              h-4
              @click="removeImage(element.id, 'sub')"
            >
              <i class="i-mdi-delete text-red" />
            </span>

            <el-tooltip effect="dark" :content="element.name" placement="top">
              <el-image
                :src="element.url"
                :preview-src-list="mainImages.map((img) => img.url)"
                class="w-full h-full rounded-md object-cover"
              />
            </el-tooltip>
          </div>
        </template>
      </draggable>
    </div>

    <!-- 副图选择 -->
    <div class="p-x-2 mt-2">
      <span>副图选择</span>
      <el-button
        class="m-l-2"
        type="primary"
        size="small"
        @click="openFileDialog('sub')"
      >
        选择图片
      </el-button>

      <draggable v-model="subImages" item-key="id" class="grid-container">
        <template #item="{ element }">
          <div
            class="relative group border-2 border-gray-200 rounded-lg overflow-hidden transition-all draggable-item"
            :class="{
              'hover:border-blue-300 hover:shadow-md': true,
            }"
          >
            <el-button
              class="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
              type="danger"
              size="small"
              circle
              @click="removeImage(element.id, 'sub')"
            >
              <i class="i-ep-delete" />
            </el-button>
            <el-tooltip effect="dark" :content="element.name" placement="top">
              <el-image
                :src="element.url"
                :preview-src-list="subImages.map((img) => img.url)"
                class="w-full h-full object-cover"
              />
            </el-tooltip>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import draggable from 'vuedraggable';

type ImageItem = {
  id: string;
  url: string;
  name: string;
  path: string;
};
const imagePrefix = ref('');
const mainImages = ref<ImageItem[]>([]);
const subImages = ref<ImageItem[]>([]);

const openFileDialog = (type: 'main' | 'sub') => {
  if (type === 'main') {
    window.ipcRenderer.selectImage().then((res) => {
      if (res) {
        console.log('主图选择', res);
        mainImages.value.push(...res);
      }
    });
  } else {
    window.ipcRenderer.selectImage().then((res) => {
      if (res) {
        subImages.value.push(...res);
      }
    });
  }
};

const saveImages = async () => {
  if (!imagePrefix.value) {
    ElMessage.warning('请先输入图片前缀');
    return;
  }
  if (mainImages.value.length) {
    const options = {
      prefix: imagePrefix.value,
      suffix: 'main',
      images: mainImages.value.map((img) => img.path),
    };
    window.ipcRenderer.batchRenameImages(options);
  }
  if (subImages.value.length) {
    const options = {
      prefix: imagePrefix.value,
      suffix: 'sub',
      images: subImages.value.map((img) => img.path),
    };
    window.ipcRenderer.batchRenameImages(options);
  }
};

const removeImage = (id: string, type: 'main' | 'sub') => {
  const targetArray = type === 'main' ? mainImages : subImages;
  const index = targetArray.value.findIndex((img) => img.id === id);
  if (index !== -1) {
    targetArray.value.splice(index, 1);
  }
};
</script>

<style lang="scss" scoped>
.grid-container {
  display: grid;
  width: 100%;
  padding: 0.5rem;
  min-height: 110px;
  grid-template-columns: repeat(auto-fill, minmax(110px, 110px));
  gap: 16px;
  margin-top: 0.5rem;
  border: 1px solid #e5e7eb;
}
</style>
