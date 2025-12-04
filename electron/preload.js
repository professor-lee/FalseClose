const { contextBridge, ipcRenderer } = require('electron')

// 暴露安全的 API 到渲染进程
contextBridge.exposeInMainWorld('electron', {
  // 文件系统操作
  readFile: filePath => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath, content) => ipcRenderer.invoke('write-file', filePath, content),
  readDirectory: dirPath => ipcRenderer.invoke('read-directory', dirPath),

  // 对话框
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectExportPath: defaultPath => ipcRenderer.invoke('select-export-path', defaultPath),
  showMessage: options => ipcRenderer.invoke('show-message', options),

  // 命令执行
  execCommand: (command, args, options) => ipcRenderer.invoke('exec-command', command, args, options),

  // 监听命令输出
  onCommandOutput: callback => {
    ipcRenderer.on('command-output', (event, data) => callback(data))
    return () => ipcRenderer.removeAllListeners('command-output')
  },

  // PTY 终端
  ptyCreate: options => ipcRenderer.invoke('pty-create', options),
  ptyWrite: data => ipcRenderer.invoke('pty-write', data),
  ptyResize: (cols, rows) => ipcRenderer.invoke('pty-resize', cols, rows),
  ptyDestroy: () => ipcRenderer.invoke('pty-destroy'),
  onPtyData: callback => {
    const handler = (event, data) => callback(data)
    ipcRenderer.on('pty-data', handler)
    return () => ipcRenderer.removeListener('pty-data', handler)
  },
  onPtyExit: callback => {
    const handler = (event, code) => callback(code)
    ipcRenderer.on('pty-exit', handler)
    return () => ipcRenderer.removeListener('pty-exit', handler)
  },

  // 菜单事件监听
  onMenuNewProject: callback => {
    ipcRenderer.on('menu-new-project', callback)
    return () => ipcRenderer.removeListener('menu-new-project', callback)
  },
  onMenuOpen: callback => {
    // keep backward-compatible name
    ipcRenderer.on('menu-open', callback)
    return () => ipcRenderer.removeListener('menu-open', callback)
  },
  onMenuOpenProject: callback => {
    ipcRenderer.on('menu-open-project', callback)
    return () => ipcRenderer.removeListener('menu-open-project', callback)
  },
  onMenuSave: callback => {
    ipcRenderer.on('menu-save', callback)
    return () => ipcRenderer.removeListener('menu-save', callback)
  },
  onMenuSaveAs: callback => {
    ipcRenderer.on('menu-save-as', callback)
    return () => ipcRenderer.removeListener('menu-save-as', callback)
  },
  onMenuExport: callback => {
    ipcRenderer.on('menu-export', callback)
    return () => ipcRenderer.removeListener('menu-export', callback)
  },
  onMenuUndo: callback => {
    ipcRenderer.on('menu-undo', callback)
    return () => ipcRenderer.removeListener('menu-undo', callback)
  },
  onMenuRedo: callback => {
    ipcRenderer.on('menu-redo', callback)
    return () => ipcRenderer.removeListener('menu-redo', callback)
  },
  onMenuToggleMode: callback => {
    ipcRenderer.on('menu-toggle-mode', callback)
    return () => ipcRenderer.removeListener('menu-toggle-mode', callback)
  },
  onMenuAbout: callback => {
    ipcRenderer.on('menu-about', callback)
    return () => ipcRenderer.removeListener('menu-about', callback)
  },
  onMenuToggleTerminal: callback => {
    ipcRenderer.on('menu-toggle-terminal', callback)
    return () => ipcRenderer.removeListener('menu-toggle-terminal', callback)
  },

  // 系统路径
  getAppPath: name => ipcRenderer.invoke('get-app-path', name),

  // 项目文件操作
  writeProjectFiles: (rootPath, files) => ipcRenderer.invoke('write-project-files', rootPath, files),
  readProjectFile: (rootPath, relativePath) => ipcRenderer.invoke('read-project-file', rootPath, relativePath),

  // 压缩
  zipDirectory: (options) => ipcRenderer.invoke('zip-directory', options),
})
