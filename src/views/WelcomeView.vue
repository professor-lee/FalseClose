<template>
  <div class="welcome-view">
    <div class="welcome-header">
      <h1>VueDrag Builder</h1>
      <p>零配置的Vue3可视化开发平台</p>
    </div>

    <div class="welcome-content">
      <el-card class="action-card">
        <template #header>
          <span>开始使用</span>
        </template>

        <div class="actions">
          <el-button type="primary" size="large" @click="handleNewProject">
            <el-icon><Plus /></el-icon>
            新建项目
          </el-button>

          <el-button size="large" @click="handleOpenProject">
            <el-icon><FolderOpened /></el-icon>
            打开项目
          </el-button>
        </div>
      </el-card>

      <el-card v-if="recentProjects.length > 0" class="recent-card">
        <template #header>
          <span>最近打开</span>
        </template>

        <div class="recent-list">
          <div
            v-for="(project, index) in recentProjects"
            :key="index"
            class="recent-item"
            @click="handleOpenRecentProject(project)"
          >
            <el-icon><Document /></el-icon>
            <span class="project-path">{{ project }}</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 新建项目对话框 -->
    <el-dialog
      v-model="newProjectDialog"
      title="新建项目"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="newProjectForm" label-width="100px">
        <el-form-item label="项目名称">
          <el-input v-model="newProjectForm.name" placeholder="请输入项目名称" />
        </el-form-item>

        <el-form-item label="UI 库">
          <el-select v-model="newProjectForm.uiLibrary">
            <el-option label="Element Plus" value="element-plus" />
            <el-option label="Naive UI" value="naive-ui" />
            <el-option label="自定义" value="custom" />
          </el-select>
        </el-form-item>

        <el-form-item label="项目目录">
          <el-input
            v-model="newProjectForm.path"
            placeholder="请选择或新建一个空目录"
            readonly
          >
            <template #append>
              <el-button @click="handleSelectFolder">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="newProjectDialog = false">取消</el-button>
        <el-button type="primary" @click="handleCreateProject" :disabled="!canCreate">
          创建
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/project'
import { ElMessage } from 'element-plus'
import { Plus, FolderOpened, Document } from '@element-plus/icons-vue'

const router = useRouter()
const projectStore = useProjectStore()

// 菜单事件清理函数
let cleanupFunctions = []

// 加载最近项目
onMounted(() => {
  projectStore.loadRecentProjects()
  
  // 监听菜单事件
  if (window.electron) {
    cleanupFunctions.push(window.electron.onMenuNewProject(() => {
      handleNewProject()
    }))
    cleanupFunctions.push(window.electron.onMenuOpen(() => {
      handleOpenProject()
    }))
    cleanupFunctions.push(window.electron.onMenuOpenProject(() => {
      handleOpenProject()
    }))
  }
})

onUnmounted(() => {
  // 清理 Electron 监听器
  cleanupFunctions.forEach(cleanup => cleanup && cleanup())
  cleanupFunctions = []
})

const recentProjects = computed(() => projectStore.recentProjects)

// 新建项目
const newProjectDialog = ref(false)
const newProjectForm = ref({
  name: '',
  uiLibrary: 'element-plus',
  path: '',
})

const canCreate = computed(() => {
  return newProjectForm.value.name && newProjectForm.value.path
})

const handleNewProject = () => {
  newProjectDialog.value = true
  newProjectForm.value = {
    name: '',
    uiLibrary: 'element-plus',
    path: '',
  }
}

const handleSelectFolder = async () => {
  try {
    const result = await window.electron.selectFolder()
    if (result && !result.canceled && result.path && result.success !== false) {
      newProjectForm.value.path = result.path
    }
  } catch (error) {
    console.error('选择文件夹失败:', error)
    ElMessage.error('选择文件夹失败')
  }
}

const handleCreateProject = async () => {
  try {
    await projectStore.createProject(newProjectForm.value)
    newProjectDialog.value = false
    router.push('/editor')
  } catch (error) {
    ElMessage.error(`创建项目失败: ${error.message}`)
  }
}

// 打开项目
const handleOpenProject = async () => {
  try {
    const result = await window.electron.selectFolder()
    if (result && !result.canceled && result.path && result.success !== false) {
      await projectStore.loadProject(result.path)
      router.push('/editor')
    }
  } catch (error) {
    console.error('打开项目失败:', error)
    ElMessage.error(`打开项目失败: ${error.message}`)
  }
}

const handleOpenRecentProject = async path => {
  if (!path) return
  
  try {
    await projectStore.loadProject(path)
    router.push('/editor')
  } catch (error) {
    console.error('打开项目失败:', error)
    ElMessage.error(`打开项目失败: ${error.message}`)
  }
}
</script>

<style scoped>
.welcome-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--vscode-bg);
  padding: 40px;
}

.welcome-header {
  text-align: center;
  color: var(--vscode-fg);
  margin-bottom: 60px;
}

.welcome-header h1 {
  font-size: 48px;
  font-weight: 300;
  margin-bottom: 16px;
  letter-spacing: -0.5px;
}

.welcome-header p {
  font-size: 18px;
  color: var(--vscode-fg-muted);
  font-weight: 300;
}

.welcome-content {
  display: flex;
  gap: 24px;
  max-width: 1000px;
}

.action-card,
.recent-card {
  min-width: 400px;
  background-color: var(--vscode-sidebar-bg);
  border: 1px solid var(--vscode-border);
}

.action-card :deep(.el-card__header),
.recent-card :deep(.el-card__header) {
  background-color: transparent;
  border-bottom: 1px solid var(--vscode-border);
  padding: 16px 20px;
  font-weight: 500;
  font-size: 14px;
  color: var(--vscode-fg);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.actions .el-button {
  width: 100%;
  height: 48px;
  font-size: 14px;
  font-weight: 400;
  justify-content: flex-start;
  padding: 0 20px;
}

.actions .el-button .el-icon {
  margin-right: 12px;
  font-size: 18px;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 300px;
  overflow-y: auto;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 0;
  cursor: pointer;
  transition: background-color 0.1s;
  font-size: 13px;
}

.recent-item:hover {
  background-color: var(--vscode-list-hover);
}

.recent-item .el-icon {
  font-size: 16px;
  color: var(--vscode-fg-muted);
}

.project-path {
  font-size: 13px;
  color: var(--vscode-fg);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}
</style>
