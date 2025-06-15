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
        <input
          ref="mainFileInput"
          type="file"
          multiple
          accept="image/*"
          class="hidden"
          @change="(e) => handleFileChange(e, 'main')"
        />
      </el-button>

      <draggable v-model="mainImages" item-key="id" class="grid-container">
        <template #item="{ element }">
          <div
            class="relative group border-2 border-gray-200 rounded-lg overflow-hidden transition-all draggable-item"
            :class="{
              'border-blue-500': true,
              'hover:border-blue-600': true,
            }"
          >
            <span absolute top-1 right-1 z-10 w-4 h-4>
              <i class="i-mdi-delete text-red" />
            </span>

            <el-tooltip effect="dark" :content="element.name" placement="top">
              <el-image
                :src="element.url"
                :preview-src-list="mainImages.map((img) => img.url)"
                class="w-40 h-40 object-cover"
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
        <input
          ref="subFileInput"
          type="file"
          multiple
          accept="image/*"
          class="hidden"
          @change="(e) => handleFileChange(e, 'sub')"
        />
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
              @click.stop="removeImage(element.id, 'sub')"
            >
              <i class="i-ep-delete" />
            </el-button>
            <el-tooltip effect="dark" :content="element.name" placement="top">
              <el-image
                :src="element.url"
                :preview-src-list="subImages.map((img) => img.url)"
                class="w-40 h-40 object-cover"
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
};
const imagePrefix = ref('');
const mainImages = ref<ImageItem[]>([]);
const subImages = ref<ImageItem[]>([]);
const mainFileInput = ref<HTMLInputElement | null>(null);
const subFileInput = ref<HTMLInputElement | null>(null);

const openFileDialog = (type: 'main' | 'sub') => {
  if (type === 'main') {
    mainFileInput.value?.click();
  } else {
    subFileInput.value?.click();
  }
};

const saveImages = async () => {
  if (!imagePrefix.value) {
    ElMessage.warning('请先输入图片前缀');
    return;
  }

  try {
    const { filePaths } = await window.ipcRenderer.getImagePath({
      properties: ['openDirectory'],
    });

    if (filePaths && filePaths[0]) {
      const saveDir = `${filePaths[0]}/upload`;

      // 保存主图
      mainImages.value.forEach((img, index) => {
        const newName = `${imagePrefix.value}_main_${index + 1}.${img.name
          .split('.')
          .pop()}`;
        window.ipcRenderer.saveImage({
          url: img.url,
        });
      });

      // 保存副图
      subImages.value.forEach((img, index) => {
        const newName = `${imagePrefix.value}_sub_${index + 1}.${img.name
          .split('.')
          .pop()}`;
        window.electronAPI.saveImage({
          url: img.url,
          dir: saveDir,
          filename: newName,
        });
      });

      ElMessage.success('图片保存成功');
    }
  } catch (error) {
    ElMessage.error('保存失败: ' + error.message);
  }
};

const removeImage = (id: string, type: 'main' | 'sub') => {
  const targetArray = type === 'main' ? mainImages : subImages;
  const index = targetArray.value.findIndex((img) => img.id === id);
  if (index !== -1) {
    targetArray.value.splice(index, 1);
  }
};

const handleFileChange = (event: Event, type: 'main' | 'sub') => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const targetArray = type === 'main' ? mainImages : subImages;
    Array.from(input.files).forEach((file) => {
      const url = URL.createObjectURL(file);
      targetArray.value.push({
        id: Date.now().toString(),
        url,
        name: file.name,
      });
    });
    // 重置input值以允许重复选择相同文件
    input.value = '';
  }
};
</script>

<style lang="scss" scoped>
.grid-container {
  display: grid;
  grid-auto-columns: minmax(10rem, 10rem);
  grid-auto-flow: column;
  gap: 16px;
  margin-top: 0.5rem;
}
</style>
