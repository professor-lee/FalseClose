<template>
  <div class="bottom-panel" :style="{ height: panelHeight + 'px' }">
    <div class="resize-handle" @mousedown="startResize"></div>

    <div class="panel-header">
      <div class="panel-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="panel-tab"
          :class="{ active: activeTab === tab.key }"
          @click="setTab(tab.key)"
        >
          <span class="tab-label">{{ tab.label }}</span>
          <span v-if="tab.badge !== undefined" class="tab-badge">{{ tab.badge }}</span>
        </button>
      </div>

      <div class="panel-actions">
        <button class="action-btn" title="最大化面板" @click="toggleMaximize">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path v-if="!isMaximized" d="M3 3v10h10V3H3zm9 9H4V4h8v8z"/>
            <path v-else d="M3 5v8h8V5H3zm7 7H4V6h6v6zm4-10v8h-2V4H6V2h8v10z"/>
          </svg>
        </button>
        <button class="action-btn" title="关闭面板" @click="editorStore.closeTerminal()">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.708L8 8.707z"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="panel-content">
      <div v-show="activeTab === 'terminal'" class="tab-content terminal-tab">
        <XTerminal :visible="activeTab === 'terminal'" />
      </div>

      <div v-show="activeTab === 'problems'" class="tab-content problems-tab">
        <div v-if="!hasProblems" class="empty-state">目前没有在工作区中检测到问题。</div>
        <div v-else class="problems-list">
          <div
            v-for="error in errorsStore.errors"
            :key="error.id"
            class="problem-item error"
          >
            <span class="problem-icon">⛔</span>
            <span class="problem-message">{{ error.message }}</span>
            <span class="problem-source">{{ error.file }}:{{ error.line }}</span>
          </div>
          <div
            v-for="warning in errorsStore.warnings"
            :key="warning.id"
            class="problem-item warning"
          >
            <span class="problem-icon">⚠️</span>
            <span class="problem-message">{{ warning.message }}</span>
            <span class="problem-source">{{ warning.file }}:{{ warning.line }}</span>
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'output'" class="tab-content output-tab">
        <pre class="output-content">{{ outputLog }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useErrorsStore } from '@/stores/errors'
import { useEditorStore } from '@/stores/editor'
import XTerminal from '@/components/terminal/XTerminal.vue'

const errorsStore = useErrorsStore()
const editorStore = useEditorStore()

const activeTab = ref('terminal')
const panelHeight = ref(260)
const savedHeight = ref(260)
const isMaximized = ref(false)
const outputLog = ref('[VueDrag Builder] 已启动\n')

const cleanupFns = []

const tabs = computed(() => [
  { key: 'problems', label: '问题', badge: errorsStore.errorCount + errorsStore.warningCount || undefined },
  { key: 'output', label: '输出' },
  { key: 'terminal', label: '终端' },
])

const hasProblems = computed(() => errorsStore.hasErrors || errorsStore.hasWarnings)

const appendOutput = (label, payload) => {
  const timestamp = new Date().toLocaleTimeString()
  outputLog.value += `[${timestamp}] [${label}] ${payload}\n`
}

const setTab = (tab) => {
  activeTab.value = tab
  editorStore.terminalPreferredTab = tab
}

const toggleMaximize = () => {
  if (isMaximized.value) {
    panelHeight.value = savedHeight.value
    isMaximized.value = false
  } else {
    savedHeight.value = panelHeight.value
    panelHeight.value = Math.min(window.innerHeight - 120, 600)
    isMaximized.value = true
  }
}

let startY = 0
let startHeight = 0

const startResize = (event) => {
  startY = event.clientY
  startHeight = panelHeight.value
  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
  document.body.style.cursor = 'ns-resize'
  document.body.style.userSelect = 'none'
}

const onResize = (event) => {
  const delta = startY - event.clientY
  const next = Math.max(140, Math.min(window.innerHeight - 200, startHeight + delta))
  panelHeight.value = next
  isMaximized.value = false
}

const stopResize = () => {
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

onMounted(() => {
  if (window.electron?.onCommandOutput) {
    const cleanup = window.electron.onCommandOutput(data => {
      if (!data || /GetVSyncParametersIfAvailable/.test(data)) return
      appendOutput('PROCESS', data.trim())
    })
    cleanupFns.push(cleanup)
  }

  if (window.electron?.onMenuToggleTerminal) {
    const cleanupMenu = window.electron.onMenuToggleTerminal(() => {
      editorStore.toggleTerminal('terminal')
    })
    cleanupFns.push(cleanupMenu)
  }
})

watch(
  () => editorStore.terminalPreferredTab,
  tab => {
    if (tab) {
      activeTab.value = tab
    }
  },
  { immediate: true }
)

const unwatchErrors = errorsStore.$subscribe(() => {
  if (errorsStore.hasErrors) {
    editorStore.openTerminal('problems')
  }
})

onUnmounted(() => {
  unwatchErrors()
  stopResize()
  cleanupFns.splice(0).forEach(fn => typeof fn === 'function' && fn())
})
</script>

<style scoped>
.bottom-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: var(--vscode-panel-bg);
  border-top: 1px solid var(--vscode-panel-border);
}

.resize-handle {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  cursor: ns-resize;
  z-index: 5;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 35px;
  padding: 0 16px;
  background-color: var(--vscode-panel-bg);
  border-bottom: 1px solid var(--vscode-panel-border);
}

.panel-tabs {
  display: flex;
  height: 100%;
  gap: 24px;
}

.panel-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  background: transparent;
  border: none;
  color: var(--vscode-panelTitle-inactiveFg);
  font-size: 11px;
  cursor: pointer;
  border-bottom: 1px solid transparent;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.panel-tab:hover {
  color: var(--vscode-panelTitle-activeFg);
}

.panel-tab.active {
  color: var(--vscode-panelTitle-activeFg);
  border-bottom-color: var(--vscode-panelTitle-activeBorder);
}

.tab-badge {
  background-color: var(--vscode-badge-bg);
  color: var(--vscode-badge-fg);
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 10px;
  line-height: 1;
}

.panel-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 3px;
  background: transparent;
  color: var(--vscode-fg-muted);
  cursor: pointer;
}

.action-btn:hover {
  background-color: var(--vscode-list-hover);
  color: var(--vscode-fg);
}

.panel-content {
  flex: 1;
  overflow: hidden;
  background-color: var(--vscode-panel-bg);
}

.tab-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.terminal-tab {
  background-color: var(--vscode-panel-bg);
  padding: 0 0 0 16px; /* Indent terminal slightly */
}

.problems-tab,
.output-tab {
  padding: 10px 16px;
  overflow-y: auto;
}

.empty-state {
  color: var(--vscode-fg-muted);
  font-size: 13px;
  margin-top: 10px;
}

.problems-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.problem-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 13px;
  cursor: pointer;
}

.problem-item:hover {
  background-color: var(--vscode-list-hover);
}

.problem-item.error {
  color: var(--vscode-error);
}

.problem-item.warning {
  color: var(--vscode-warning);
}

.problem-icon {
  font-size: 14px;
}

.problem-message {
  flex: 1;
  color: var(--vscode-fg);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.problem-source {
  color: var(--vscode-fg-muted);
  font-size: 12px;
}

.output-content {
  margin: 0;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.4;
  color: var(--vscode-fg);
}
</style>
