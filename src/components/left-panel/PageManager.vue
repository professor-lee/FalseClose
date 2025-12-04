<template>
  <div class="page-manager">
    <div class="page-list">
      <div
        v-for="page in canvasStore.pages"
        :key="page.id"
        :class="['page-item', { active: page.id === canvasStore.currentPageId }]"
        @click="handleSelectPage(page.id)"
      >
        <span class="page-icon">🏠</span>
        <span class="page-name">{{ page.name }}</span>
        <span class="page-route">{{ page.route }}</span>
      </div>
    </div>

    <el-button class="add-page-btn" type="primary" @click="handleAddPage">
      <el-icon><Plus /></el-icon>
      新建页面
    </el-button>

    <!-- 新建页面对话框 -->
    <el-dialog v-model="newPageDialog" title="新建页面" width="400px">
      <el-form :model="newPageForm" label-width="80px">
        <el-form-item label="页面名称">
          <el-input v-model="newPageForm.name" placeholder="如：关于我们" />
        </el-form-item>

        <el-form-item label="路由路径">
          <el-input v-model="newPageForm.route" placeholder="如：/about">
            <template #prepend>/</template>
          </el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="newPageDialog = false">取消</el-button>
        <el-button type="primary" @click="handleCreatePage">创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCanvasStore } from '@/stores/canvas'
import { Plus } from '@element-plus/icons-vue'

const canvasStore = useCanvasStore()

const newPageDialog = ref(false)
const newPageForm = ref({
  name: '',
  route: '',
})

const handleSelectPage = pageId => {
  canvasStore.switchPage(pageId)
}

const handleAddPage = () => {
  newPageDialog.value = true
  newPageForm.value = { name: '', route: '' }
}

const handleCreatePage = () => {
  const { name, route } = newPageForm.value
  if (name && route) {
    canvasStore.createPage(name, `/${route.replace(/^\//, '')}`)
    newPageDialog.value = false
  }
}
</script>

<style scoped>
.page-manager {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.page-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
}

.page-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: var(--vscode-sidebar-bg);
  border: 1px solid transparent;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--vscode-fg);
}

.page-item:hover {
  background-color: var(--vscode-list-hover);
}

.page-item.active {
  background-color: var(--vscode-list-active);
  color: var(--vscode-fg);
  border-color: var(--vscode-focusBorder);
}

.page-icon {
  font-size: 16px;
}

.page-name {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
}

.page-route {
  font-size: 12px;
  color: var(--vscode-fg-muted);
}

.add-page-btn {
  width: 100%;
}
</style>
