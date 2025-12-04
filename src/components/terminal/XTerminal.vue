<template>
  <div ref="terminalContainer" class="xterm-container"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { useProjectStore } from '@/stores/project'
import '@xterm/xterm/css/xterm.css'

const props = defineProps({
  visible: {
    type: Boolean,
    default: true,
  },
})

const projectStore = useProjectStore()
const terminalContainer = ref(null)
let terminal = null
let fitAddon = null
let cleanupPtyData = null
let cleanupPtyExit = null
let resizeObserver = null

const initTerminal = async () => {
  if (!terminalContainer.value) return

  terminal = new Terminal({
    cursorBlink: true,
    cursorStyle: 'bar',
    fontSize: 13,
    fontFamily: "'Cascadia Code', 'Fira Code', Consolas, 'Courier New', monospace",
    theme: {
      background: '#1e1e1e',
      foreground: '#cccccc',
      cursor: '#ffffff',
      cursorAccent: '#1e1e1e',
      selection: 'rgba(38, 79, 120, 0.5)',
      black: '#000000',
      red: '#cd3131',
      green: '#0dbc79',
      yellow: '#e5e510',
      blue: '#2472c8',
      magenta: '#bc3fbc',
      cyan: '#11a8cd',
      white: '#e5e5e5',
      brightBlack: '#666666',
      brightRed: '#f14c4c',
      brightGreen: '#23d18b',
      brightYellow: '#f5f543',
      brightBlue: '#3b8eea',
      brightMagenta: '#d670d6',
      brightCyan: '#29b8db',
      brightWhite: '#e5e5e5',
    },
    scrollback: 10000,
    allowTransparency: true,
  })

  fitAddon = new FitAddon()
  terminal.loadAddon(fitAddon)
  terminal.open(terminalContainer.value)

  // 延迟 fit 以确保容器已完全渲染
  setTimeout(() => {
    fitAddon.fit()
  }, 100)

  // 监听终端输入
  terminal.onData(data => {
    if (window.electron?.ptyWrite) {
      window.electron.ptyWrite(data)
    }
  })

  // 监听 PTY 数据
  if (window.electron?.onPtyData) {
    cleanupPtyData = window.electron.onPtyData(data => {
      terminal.write(data)
    })
  }

  // 监听 PTY 退出
  if (window.electron?.onPtyExit) {
    cleanupPtyExit = window.electron.onPtyExit(code => {
      terminal.writeln(`\r\n[进程已退出，代码: ${code}]`)
    })
  }

  // 创建 PTY 进程
  if (window.electron?.ptyCreate) {
    const cols = terminal.cols
    const rows = terminal.rows
    const cwd = projectStore.projectPath || undefined
    await window.electron.ptyCreate({ cols, rows, cwd })
  }

  // 监听容器大小变化
  resizeObserver = new ResizeObserver(() => {
    if (fitAddon && props.visible) {
      fitAddon.fit()
      if (window.electron?.ptyResize && terminal) {
        window.electron.ptyResize(terminal.cols, terminal.rows)
      }
    }
  })
  resizeObserver.observe(terminalContainer.value)
}

const disposeTerminal = () => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }

  if (cleanupPtyData) {
    cleanupPtyData()
    cleanupPtyData = null
  }

  if (cleanupPtyExit) {
    cleanupPtyExit()
    cleanupPtyExit = null
  }

  if (window.electron?.ptyDestroy) {
    window.electron.ptyDestroy()
  }

  if (terminal) {
    terminal.dispose()
    terminal = null
  }

  fitAddon = null
}

watch(
  () => props.visible,
  visible => {
    if (visible && fitAddon) {
      setTimeout(() => {
        fitAddon.fit()
        if (window.electron?.ptyResize && terminal) {
          window.electron.ptyResize(terminal.cols, terminal.rows)
        }
      }, 50)
    }
  }
)

onMounted(() => {
  initTerminal()
})

onBeforeUnmount(() => {
  disposeTerminal()
})
</script>

<style scoped>
.xterm-container {
  width: 100%;
  height: 100%;
  background-color: var(--vscode-panel-bg);
}

.xterm-container :deep(.xterm) {
  height: 100%;
  padding: 4px 8px;
}

.xterm-container :deep(.xterm-viewport) {
  overflow-y: auto !important;
}

.xterm-container :deep(.xterm-viewport::-webkit-scrollbar) {
  width: 10px;
}

.xterm-container :deep(.xterm-viewport::-webkit-scrollbar-track) {
  background: transparent;
}

.xterm-container :deep(.xterm-viewport::-webkit-scrollbar-thumb) {
  background: var(--vscode-scrollbar);
  border-radius: 0;
}

.xterm-container :deep(.xterm-viewport::-webkit-scrollbar-thumb:hover) {
  background: var(--vscode-scrollbar-hover);
}
</style>
