import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { generateProjectFileMap } from '@/utils/fileExporter'

export const useProjectStore = defineStore('project', {
  state: () => ({
    projectName: '',
    projectPath: '',
    uiLibrary: 'element-plus',
    npmRegistry: 'https://registry.npmmirror.com',
    customRegistry: '',
    autoSave: true,
    autoSaveInterval: 500,
    lastSaved: null,
    recentProjects: [],
    isDirty: false, // 是否有未保存的更改
  }),

  getters: {
    hasProject: state => !!state.projectPath,
    registryUrl: state => {
      if (state.customRegistry) return state.customRegistry
      return state.npmRegistry
    },
    projectSnapshot: state => ({
      projectName: state.projectName,
      projectPath: state.projectPath,
      uiLibrary: state.uiLibrary,
      npmRegistry: state.npmRegistry,
      customRegistry: state.customRegistry,
      autoSave: state.autoSave,
      autoSaveInterval: state.autoSaveInterval,
      lastSaved: state.lastSaved,
    }),
  },

  actions: {
    // 创建新项目
    async createProject({ name, path, uiLibrary = 'element-plus' }) {
      try {
        if (!path) {
          throw new Error('请选择项目目录')
        }

        const normalizedPath = path.replace(/[\\/]+$/, '') || path
        this.projectName = name || deriveNameFromPath(normalizedPath) || '未命名项目'
        this.projectPath = normalizedPath
        this.uiLibrary = uiLibrary
        this.lastSaved = new Date().toISOString()
        this.isDirty = false

        // 初始化画布store
        const canvasStore = useCanvasStore()
        canvasStore.reset()
        canvasStore.createPage('首页', '/')

        await this.saveProject()
        this.addToRecentProjects(path)

        ElMessage.success('项目创建成功')
      } catch (error) {
        console.error('创建项目失败:', error)
        ElMessage.error(`创建项目失败: ${error.message}`)
        throw error
      }
    },

    // 打开项目
    async loadProject(projectDir) {
      try {
        if (!projectDir) {
          throw new Error('未提供项目目录')
        }

        if (!window.electron || !window.electron.readProjectFile) {
          throw new Error('Electron API 不可用')
        }

        const normalizedDir = projectDir.replace(/[\\/]+$/, '') || projectDir
        const isLegacyFile = normalizedDir.endsWith('.vueproject')
        const metaResult = await window.electron.readProjectFile(normalizedDir, '.vuedrag/builder.project.json')
        if (!metaResult.success) {
          if (isLegacyFile) {
            throw new Error('检测到旧版 .vueproject 文件，请在欢迎页重新导出为目录格式后再打开')
          }
          throw new Error(metaResult.error || '无法读取项目配置 (.vuedrag/builder.project.json)')
        }

        const project = JSON.parse(metaResult.data)

        // 恢复项目状态
        this.$patch({
          projectName: project.projectName || deriveNameFromPath(normalizedDir),
          projectPath: normalizedDir,
          uiLibrary: project.uiLibrary,
          npmRegistry: project.npmRegistry || 'https://registry.npmmirror.com',
          customRegistry: project.customRegistry || '',
          autoSave: project.autoSave !== false,
          autoSaveInterval: project.autoSaveInterval || 500,
          lastSaved: project.lastSaved,
          isDirty: false,
        })

        // 恢复画布状态
        const canvasStore = useCanvasStore()
        canvasStore.loadFromProject(project)

        this.addToRecentProjects(projectDir)
        ElMessage.success('项目加载成功')
      } catch (error) {
        ElMessage.error(`加载项目失败: ${error.message}`)
        throw error
      }
    },

    // 保存项目
    async saveProject() {
      if (!window.electron) {
        console.error('Electron API 不可用')
        return false
      }
      
      if (!this.projectPath) {
        const folderResult = await window.electron.selectFolder()
        if (!folderResult || folderResult.canceled || !folderResult.path || folderResult.success === false) {
          return false
        }
        this.projectPath = folderResult.path.replace(/[\\/]+$/, '') || folderResult.path
      }

      try {
        if (!window.electron || !window.electron.writeProjectFiles) {
          throw new Error('Electron API 不可用')
        }

        const canvasStore = useCanvasStore()
        if (!this.projectName) {
          this.projectName = deriveNameFromPath(this.projectPath) || '未命名项目'
        }
        const payload = {
          metaVersion: 2,
          projectName: this.projectName,
          uiLibrary: this.uiLibrary,
          npmRegistry: this.npmRegistry,
          customRegistry: this.customRegistry,
          autoSave: this.autoSave,
          autoSaveInterval: this.autoSaveInterval,
          lastSaved: new Date().toISOString(),
          pages: canvasStore.pages,
          globalStyles: canvasStore.globalStyles,
        }

        const files = generateProjectFileMap(payload)
        const writeResult = await window.electron.writeProjectFiles(this.projectPath, files)

        if (!writeResult.success) {
          throw new Error(writeResult.error || '写入项目文件失败')
        }

        this.lastSaved = payload.lastSaved
        this.isDirty = false
        this.addToRecentProjects(this.projectPath)
        ElMessage.success('项目已保存')
        return true
      } catch (error) {
        ElMessage.error(`保存失败: ${error.message}`)
        return false
      }
    },

    // 加载最近项目列表
    loadRecentProjects() {
      const stored = localStorage.getItem('recentProjects')
      if (stored) {
        this.recentProjects = JSON.parse(stored)
      }
    },

    // 添加到最近项目
    addToRecentProjects(path) {
      if (!path) return
      const normalized = path.replace(/[\\/]+$/, '') || path
      this.recentProjects = [normalized, ...this.recentProjects.filter(p => p !== normalized)].slice(0, 5)
      localStorage.setItem('recentProjects', JSON.stringify(this.recentProjects))
    },

    // 切换镜像源
    switchRegistry(type) {
      const registries = {
        taobao: 'https://registry.npmmirror.com',
        npm: 'https://registry.npmjs.org',
        custom: this.customRegistry,
      }
      this.npmRegistry = registries[type] || registries.taobao
      this.markDirty()
    },

    // 标记为已修改
    markDirty() {
      this.isDirty = true
    },
  },
})

// 导入canvas store（避免循环依赖）
import { useCanvasStore } from './canvas'

function deriveNameFromPath(fullPath) {
  if (!fullPath) return ''
  const normalized = fullPath.replace(/\\/g, '/').replace(/\/$/, '')
  const segments = normalized.split('/')
  return segments[segments.length - 1]
}
