<template>
  <div class="code-editor">
    <div class="editor-tabs-container">
      <div class="file-tabs">
        <button
          v-for="tab in fileTabs"
          :key="tab.key"
          class="tab-button"
          :class="{ active: activeSection === tab.key }"
          @click="jumpToSection(tab)"
        >
          <span class="tab-icon" :class="tab.iconClass">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </div>
      
      <div class="editor-actions">
        <button class="action-btn" @click="formatCode" title="格式化代码">
          <el-icon><MagicStick /></el-icon>
        </button>
        <button class="action-btn" @click="copyCode" title="复制代码">
          <el-icon><CopyDocument /></el-icon>
        </button>
        <button class="action-btn" @click="syncFromCanvas" title="从画布同步">
          <el-icon><RefreshRight /></el-icon>
        </button>
        <button class="action-btn" @click="syncToCanvas" title="同步到画布 (实验性)">
          <el-icon><RefreshLeft /></el-icon>
        </button>
        <div class="view-toggle">
          <button 
            class="toggle-btn" 
            :class="{ active: viewMode === 'split' }" 
            @click="viewMode = 'split'"
            title="分屏"
          >
            <el-icon><Reading /></el-icon>
          </button>
          <button 
            class="toggle-btn" 
            :class="{ active: viewMode === 'code' }" 
            @click="viewMode = 'code'"
            title="仅代码"
          >
            <el-icon><Document /></el-icon>
          </button>
          <button 
            class="toggle-btn" 
            :class="{ active: viewMode === 'preview' }" 
            @click="viewMode = 'preview'"
            title="仅预览"
          >
            <el-icon><Monitor /></el-icon>
          </button>
        </div>
      </div>
    </div>

    <div class="editor-content" :class="`view-mode-${viewMode}`">
      <!-- Monaco 编辑器 -->
      <div v-show="viewMode !== 'preview'" class="editor-panel">
        <div ref="monacoContainer" class="monaco-container"></div>
      </div>

      <!-- 预览面板 -->
      <div v-show="viewMode !== 'code'" class="preview-panel">
        <div class="preview-header">
          <span>Preview</span>
        </div>
        <iframe
          ref="previewFrame"
          class="preview-iframe"
          sandbox="allow-scripts allow-same-origin allow-modals"
          :srcdoc="previewSrcDoc"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useCanvasStore } from '@/stores/canvas'
import { useProjectStore } from '@/stores/project'
import { useEditorStore } from '@/stores/editor'
import { generateVueSFC } from '@/utils/codeGenerator'
import { ElMessage, ElMessageBox } from 'element-plus'
import { MagicStick, CopyDocument, RefreshRight, RefreshLeft, Reading, Document, Monitor } from '@element-plus/icons-vue'
import * as monaco from 'monaco-editor'
import { cloneDeep } from 'lodash-es'
import { v4 as uuidv4 } from 'uuid'

// 配置 Monaco Editor 的工作线程
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  }
}

const canvasStore = useCanvasStore()
const projectStore = useProjectStore()
const editorStore = useEditorStore()

const viewMode = ref('split')
const activeSection = ref('template')
const monacoContainer = ref(null)
const previewFrame = ref(null)
let editor = null
let unsubscribeCanvas = null
const lastSyncedCode = ref('')
const previewSrcDoc = ref('')

const fileTabs = [
  { key: 'template', label: 'template', token: '<template>', icon: '< >', iconClass: 'icon-blue' },
  { key: 'script', label: 'script', token: '<script setup>', icon: 'JS', iconClass: 'icon-yellow' },
  { key: 'style', label: 'style', token: '<style', icon: '#', iconClass: 'icon-pink' },
]

const basePreviewStyle = `body {
  margin: 0;
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #ffffff;
  color: #1f1f1f;
}

#app {
  min-height: 100vh;
  box-sizing: border-box;
}
`

const extractSfcSections = (code) => {
  if (!code) {
    return { template: '', script: '', style: '' }
  }

  const templateMatch = code.match(/<template>([\s\S]*?)<\/template>/)
  const scriptMatch = code.match(/<script setup>([\s\S]*?)<\/script>/)
  const styleMatch = code.match(/<style[^>]*>([\s\S]*?)<\/style>/)

  return {
    template: templateMatch ? templateMatch[1].trim() : '',
    script: scriptMatch ? scriptMatch[1].trim() : '',
    style: styleMatch ? styleMatch[1].trim() : '',
  }
}

const sanitizeScriptContent = (scriptContent) => {
  if (!scriptContent) {
    return {
      code: '',
      exportsStatement: 'return {}',
      usesRouter: false,
    }
  }

  const vueHelpers = new Set()
  const elementHelpers = new Set()
  let usesRouterImport = false
  const bodyLines = []

  const parseHelperNames = segment => {
    return segment
      .split(',')
      .map(name => name.trim())
      .filter(Boolean)
      .map(name => name.replace(/\sas\s.+$/, ''))
  }

  scriptContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (!trimmed.startsWith('import')) {
      bodyLines.push(line)
      return
    }

    const vueMatch = trimmed.match(/import\s+{([^}]+)}\s+from\s+['"]vue['"]/)
    if (vueMatch) {
      parseHelperNames(vueMatch[1]).forEach(name => vueHelpers.add(name))
      return
    }

    const elementMatch = trimmed.match(/import\s+{([^}]+)}\s+from\s+['"]element-plus['"]/)
    if (elementMatch) {
      parseHelperNames(elementMatch[1]).forEach(name => elementHelpers.add(name))
      return
    }

    const routerMatch = trimmed.match(/from\s+['"]vue-router['"]/)
    if (routerMatch) {
      usesRouterImport = true
      return
    }
  })

  const injectedHelpers = []
  if (vueHelpers.size > 0) {
    injectedHelpers.push(`const { ${Array.from(vueHelpers).join(', ')} } = Vue`)
  }
  if (elementHelpers.size > 0) {
    injectedHelpers.push(`const { ${Array.from(elementHelpers).join(', ')} } = ElementPlus`)
  }
  const cleaned = [...injectedHelpers, ...bodyLines].join('\n')
  const bindingRegex = /\b(?:const|let|var|function)\s+([A-Za-z0-9_]+)/g
  const bindings = new Set()
  const macroNames = new Set([
    'useRouter',
    'defineProps',
    'defineEmits',
    'defineExpose',
    'defineSlots',
    'defineModel',
    'defineOptions',
  ])
  let match
  while ((match = bindingRegex.exec(cleaned)) !== null) {
    const name = match[1]
    if (macroNames.has(name)) continue
    bindings.add(name)
  }

  const bindingList = Array.from(bindings)
  const exportsStatement = bindingList.length
    ? `return { ${bindingList.join(', ')} }`
    : 'return {}'

  return {
    code: cleaned,
    exportsStatement,
    usesRouter: usesRouterImport,
  }
}

const buildPreviewDocument = (code) => {
  const { template, script, style } = extractSfcSections(code)
  const scriptMeta = sanitizeScriptContent(script)
  const safeTemplate = template || '<div>当前暂无内容</div>'
  const combinedStyle = `${basePreviewStyle}\n${style || ''}`

  const sanitizedStyle = combinedStyle
    .replace(/<\/style>/gi, '<\\/style>')
    .replace(/`/g, '\\`')

  // 使用 npmmirror CDN 替代 unpkg，提高国内访问速度
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>预览</title>
  <link rel="stylesheet" href="https://registry.npmmirror.com/element-plus/2.4.4/files/dist/index.css">
  <style>${sanitizedStyle}</style>
</head>
<body>
  <div id="app"></div>
  <script src="https://registry.npmmirror.com/vue/3.3.4/files/dist/vue.global.prod.js"><\/script>
  <script src="https://registry.npmmirror.com/element-plus/2.4.4/files/dist/index.full.min.js"><\/script>
  <script src="https://registry.npmmirror.com/@element-plus/icons-vue/2.3.1/files/dist/index.iife.min.js"><\/script>
  <script>
    const template = ${JSON.stringify(safeTemplate)}
    const scriptMeta = ${JSON.stringify(scriptMeta)}

    const renderError = (err) => {
      console.error('[预览错误]', err)
      const host = document.getElementById('app')
      host.innerHTML = ''
      const pre = document.createElement('pre')
      pre.textContent = (err && err.stack) || err?.message || String(err)
      pre.style.padding = '20px'
      pre.style.whiteSpace = 'pre-wrap'
      pre.style.background = '#fff0f0'
      pre.style.color = '#ff0000'
      host.appendChild(pre)
    }

    const routerStub = () => ({
      push(path) {
        console.log('[预览] 跳转到:', path)
      }
    })

    const runner = new Function(
      'Vue',
      'ElementPlus',
      'useRouter',
      'defineProps',
      'defineEmits',
      'defineExpose',
      'defineSlots',
      'defineModel',
      'defineOptions',
      'console',
      scriptMeta.code + '\\n' + scriptMeta.exportsStatement
    )

    const noopObject = () => ({})
    const noopFn = () => () => {}
    const noopVoid = () => {}

    try {
      const component = {
        template,
        setup() {
          try {
            return runner(
              Vue,
              ElementPlus,
              routerStub,
              noopObject,
              noopFn,
              noopVoid,
              noopObject,
              () => Vue.ref ? Vue.ref(null) : null,
              noopVoid,
              console
            )
          } catch (error) {
            renderError(error)
            return {}
          }
        },
      }

      const app = Vue.createApp(component)
      app.use(ElementPlus)
      // 注册图标
      if (window.ElementPlusIconsVue) {
        for (const [key, component] of Object.entries(window.ElementPlusIconsVue)) {
          app.component(key, component)
        }
      }
      app.mount('#app')
    } catch (error) {
      renderError(error)
    }
  <\/script>
</body>
</html>`
}

const buildProjectContext = () => ({
  ...projectStore.projectSnapshot,
  globalStyles: canvasStore.globalStyles,
})

const buildPageSnapshot = () => {
  const currentPage = canvasStore.currentPage
  if (!currentPage) return null

  return {
    ...currentPage,
    components: cloneDeep(canvasStore.componentTreeHierarchy || []),
  }
}

const syncFromCanvas = (showToast = true) => {
  const pageSnapshot = buildPageSnapshot()
  if (!pageSnapshot) {
    if (showToast) {
      ElMessage.warning('没有可用的页面')
    }
    return
  }

  const code = generateVueSFC(pageSnapshot, buildProjectContext())
  if (!editor) {
    lastSyncedCode.value = code
    return
  }

  if (code !== lastSyncedCode.value) {
    editor.setValue(code)
    lastSyncedCode.value = code
    updatePreview(code)
  } else if (viewMode.value !== 'code') {
    updatePreview(code)
  }

  if (showToast) {
    ElMessage.success('已从画布同步代码')
  }
}

// 反向同步：代码 -> 画布
const syncToCanvas = async (silent = false) => {
  if (!editor) return
  
  try {
    if (!silent) {
      await ElMessageBox.confirm(
        '这将覆盖当前画布上的所有组件。此功能为实验性功能，仅支持基础结构同步。确定要继续吗？',
        '同步到画布',
        {
          confirmButtonText: '确定同步',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
    }

    const code = editor.getValue()
    const { template } = extractSfcSections(code)
    
    if (!template) {
      throw new Error('未找到 template 标签')
    }

    // 解析 HTML
    const parser = new DOMParser()
    const doc = parser.parseFromString(template, 'text/html')
    const rootDiv = doc.body.firstElementChild

    if (!rootDiv) {
      throw new Error('模板内容为空')
    }

    // 转换 DOM 树为组件树
    const components = []
    
    // 递归解析函数
    const parseNode = (node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return null
      
      // 映射标签名到组件类型
      const tagMap = {
        'DIV': 'Container', // 默认
        'EL-CARD': 'Card',
        'EL-BUTTON': 'Button',
        'SPAN': 'Text',
        'H2': 'Heading',
        'EL-IMAGE': 'Image',
        'EL-DIVIDER': 'Divider',
        'EL-LINK': 'Link',
        'EL-INPUT': 'Input',
        'EL-SELECT': 'Select',
        'EL-CHECKBOX': 'Checkbox',
        'EL-RADIO': 'Radio',
        'EL-SWITCH': 'Switch',
      }
      
      const tagName = node.tagName.toUpperCase()
      let type = tagMap[tagName] || 'Container'
      
      // 特殊处理：检查 class 来区分 Container, Flex, Grid
      if (tagName === 'DIV') {
        if (node.style.display === 'flex') type = 'Flex'
        else if (node.style.display === 'grid') type = 'Grid'
      }

      const component = {
        id: uuidv4(),
        type,
        props: {},
        styles: {},
        children: [],
        events: []
      }

      // 解析属性
      Array.from(node.attributes).forEach(attr => {
        const name = attr.name
        const value = attr.value
        
        if (name === 'style') {
          // 解析内联样式
          value.split(';').forEach(rule => {
            const [k, v] = rule.split(':').map(s => s.trim())
            if (k && v) {
              // 转换 css key 为驼峰
              const camelKey = k.replace(/-([a-z])/g, g => g[1].toUpperCase())
              component.styles[camelKey] = v
            }
          })
        } else if (name.startsWith(':') || name.startsWith('v-bind:')) {
          // 动态属性 (简化处理，作为字符串存储)
          const propName = name.replace(/^:|v-bind:/, '')
          component.props[propName] = value
        } else if (name.startsWith('@') || name.startsWith('v-on:')) {
          // 事件 (暂不处理反向同步)
        } else if (name === 'class') {
          component.props.className = value
        } else {
          // 普通属性
          component.props[name] = value
        }
      })

      // 解析文本内容
      if (type === 'Text' || type === 'Heading' || type === 'Button' || type === 'Link') {
        // 提取直接文本子节点
        const textContent = Array.from(node.childNodes)
          .filter(n => n.nodeType === Node.TEXT_NODE)
          .map(n => n.textContent.trim())
          .join(' ')
        
        if (textContent) {
          if (type === 'Button' || type === 'Link') {
            component.props.label = textContent
          } else {
            component.props.text = textContent
          }
        }
      }

      // 递归子节点
      Array.from(node.children).forEach(childNode => {
        const childComponent = parseNode(childNode)
        if (childComponent) {
          childComponent.parentId = component.id
          component.children.push(childComponent.id)
          components.push(childComponent) // 扁平化存储，稍后重建树
        }
      })
      
      return component
    }

    // 开始解析
    // 假设根元素是 page-container，我们解析它的子元素
    if (rootDiv.classList.contains('page-container')) {
      Array.from(rootDiv.children).forEach(child => {
        const comp = parseNode(child)
        if (comp) components.push(comp)
      })
    } else {
      // 如果没有 page-container，直接解析根元素
      const comp = parseNode(rootDiv)
      if (comp) components.push(comp)
    }

    // 扁平化组件列表 (parseNode 已经做了部分，但我们需要整理)
    // parseNode 返回的是树状结构的根，但我们也把子组件 push 到了 components 数组
    // 实际上 parseNode 的递归逻辑有点问题，因为它既返回对象又 push 到数组
    // 让我们修正一下：parseNode 只返回对象，我们在外部收集
    
    // 重新实现简单的递归收集
    const flatComponents = []
    const traverseCollect = (comp) => {
      flatComponents.push(comp)
      if (comp.childrenComponents) { // 临时属性
        comp.childrenComponents.forEach(child => {
          child.parentId = comp.id
          comp.children.push(child.id)
          traverseCollect(child)
        })
        delete comp.childrenComponents
      }
    }

    // 修正后的 parseNode
    const parseNodeV2 = (node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return null
      
      const tagMap = {
        'DIV': 'Container',
        'EL-CARD': 'Card',
        'EL-BUTTON': 'Button',
        'SPAN': 'Text',
        'H2': 'Heading',
        'EL-IMAGE': 'Image',
        'EL-DIVIDER': 'Divider',
        'EL-LINK': 'Link',
        'EL-INPUT': 'Input',
        'EL-SELECT': 'Select',
        'EL-CHECKBOX': 'Checkbox',
        'EL-RADIO': 'Radio',
        'EL-SWITCH': 'Switch',
      }
      
      const tagName = node.tagName.toUpperCase()
      let type = tagMap[tagName] || 'Container'
      
      if (tagName === 'DIV') {
        if (node.style.display === 'flex') type = 'Flex'
        else if (node.style.display === 'grid') type = 'Grid'
      }

      const component = {
        id: uuidv4(),
        type,
        props: {},
        styles: {},
        children: [],
        events: [],
        childrenComponents: [] // 临时存放子组件对象
      }

      Array.from(node.attributes).forEach(attr => {
        const name = attr.name
        const value = attr.value
        if (name === 'style') {
          value.split(';').forEach(rule => {
            const [k, v] = rule.split(':').map(s => s.trim())
            if (k && v) {
              const camelKey = k.replace(/-([a-z])/g, g => g[1].toUpperCase())
              component.styles[camelKey] = v
            }
          })
        } else if (name === 'class') {
          component.props.className = value
        } else if (!name.startsWith('@') && !name.startsWith('v-on:')) {
          const propName = name.replace(/^:|v-bind:/, '')
          component.props[propName] = value
        }
      })

      if (['Text', 'Heading', 'Button', 'Link'].includes(type)) {
        const textContent = Array.from(node.childNodes)
          .filter(n => n.nodeType === Node.TEXT_NODE)
          .map(n => n.textContent.trim())
          .join(' ')
        if (textContent) {
          if (type === 'Button' || type === 'Link') component.props.label = textContent
          else component.props.text = textContent
        }
      }

      Array.from(node.children).forEach(childNode => {
        const childComp = parseNodeV2(childNode)
        if (childComp) {
          component.childrenComponents.push(childComp)
        }
      })

      return component
    }

    // 执行解析
    const newComponents = []
    if (rootDiv.classList.contains('page-container')) {
      Array.from(rootDiv.children).forEach(child => {
        const comp = parseNodeV2(child)
        if (comp) traverseCollect(comp)
      })
    } else {
      const comp = parseNodeV2(rootDiv)
      if (comp) traverseCollect(comp)
    }
    
    // 更新 Store
    // 我们需要直接替换当前页面的 componentTree
    const currentPage = canvasStore.currentPage
    if (currentPage) {
      currentPage.componentTree = flatComponents
      canvasStore.currentPageId = currentPage.id // 触发更新
      if (!silent) {
        ElMessage.success('同步成功')
      }
    }

  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
      if (!silent) {
        ElMessage.error(`同步失败: ${error.message}`)
      }
    }
  }
}

const formatCode = async () => {
  if (editor) {
    await editor.getAction('editor.action.formatDocument').run()
    ElMessage.success('代码已格式化')
  }
}

const copyCode = async () => {
  if (editor) {
    const code = editor.getValue()
    try {
      await navigator.clipboard.writeText(code)
      ElMessage.success('代码已复制到剪贴板')
    } catch (err) {
      ElMessage.error('复制失败')
    }
  }
}

const jumpToSection = (tab) => {
  activeSection.value = tab.key
  if (!editor) return
  const model = editor.getModel()
  if (!model) return
  const code = model.getValue()
  const index = code.indexOf(tab.token)
  if (index === -1) return

  const position = model.getPositionAt(index + tab.token.length)
  editor.revealPositionInCenter(position)
  editor.setPosition(position)
  editor.focus()
}

const updatePreview = (code) => {
  const html = buildPreviewDocument(code)
  previewSrcDoc.value = html
}

onMounted(() => {
  if (monacoContainer.value) {
    editor = monaco.editor.create(monacoContainer.value, {
      value: '<!-- 点击"从画布同步"按钮生成代码 -->',
      language: 'html',
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: true },
      fontSize: 14,
      tabSize: 2,
      formatOnPaste: true,
      formatOnType: true,
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      fontFamily: "'Consolas', 'Courier New', monospace",
    })

    const initialPosition = editor.getPosition()
    editorStore.cursorLine = initialPosition?.lineNumber || 1
    editorStore.cursorColumn = initialPosition?.column || 1

    editor.onDidChangeModelContent(() => {
      const code = editor.getValue()
      if (viewMode.value !== 'code') {
        updatePreview(code)
      }
    })

    editor.onDidChangeCursorPosition(event => {
      editorStore.cursorLine = event.position.lineNumber
      editorStore.cursorColumn = event.position.column
    })

    nextTick(() => {
      syncFromCanvas(false)
    })

    unsubscribeCanvas = canvasStore.$subscribe(() => {
      syncFromCanvas(false)
    })
  }
})

watch(viewMode, (newMode) => {
  if (newMode !== 'code' && editor) {
    updatePreview(editor.getValue())
  }
})

onBeforeUnmount(() => {
  if (editor) {
    editor.dispose()
  }
  if (typeof unsubscribeCanvas === 'function') {
    unsubscribeCanvas()
  }
})
</script>

<style scoped>
.code-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--vscode-editor-bg);
}

.editor-tabs-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--vscode-titlebar-bg);
  height: 35px;
  border-bottom: 1px solid var(--vscode-border);
}

.file-tabs {
  display: flex;
  height: 100%;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--vscode-titlebar-bg);
  border: none;
  color: var(--vscode-fg-muted);
  padding: 0 12px;
  font-size: 13px;
  cursor: pointer;
  border-right: 1px solid var(--vscode-border);
  height: 100%;
}

.tab-button:hover {
  color: var(--vscode-fg);
  background: var(--vscode-list-hover);
}

.tab-button.active {
  color: var(--vscode-fg);
  background: var(--vscode-editor-bg);
  border-top: 1px solid var(--vscode-highlight);
}

.tab-icon {
  font-size: 12px;
  font-weight: bold;
  width: 16px;
  text-align: center;
}

.icon-blue { color: #569cd6; }
.icon-yellow { color: #dcdcaa; }
.icon-pink { color: #c586c0; }

.editor-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-right: 8px;
}

.action-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--vscode-fg-muted);
  border-radius: 3px;
  cursor: pointer;
}

.action-btn:hover {
  background: var(--vscode-list-hover);
  color: var(--vscode-fg);
}

.view-toggle {
  display: flex;
  background: var(--vscode-input-bg);
  border-radius: 3px;
  padding: 2px;
  margin-left: 8px;
}

.toggle-btn {
  width: 24px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--vscode-fg-muted);
  border-radius: 2px;
  cursor: pointer;
}

.toggle-btn:hover {
  color: var(--vscode-fg);
}

.toggle-btn.active {
  background: var(--vscode-button-bg);
  color: #fff;
}

.editor-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.view-mode-split .editor-panel {
  flex: 1;
  border-right: 1px solid var(--vscode-border);
}

.view-mode-split .preview-panel {
  flex: 1;
}

.view-mode-code .editor-panel {
  flex: 1;
}

.view-mode-preview .preview-panel {
  flex: 1;
}

.editor-panel {
  position: relative;
  overflow: hidden;
}

.monaco-container {
  width: 100%;
  height: 100%;
}

.preview-panel {
  background: #ffffff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.preview-header {
  height: 24px;
  background: #f0f0f0;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 11px;
  color: #666;
  text-transform: uppercase;
}

.preview-iframe {
  flex: 1;
  width: 100%;
  border: none;
}
</style>
