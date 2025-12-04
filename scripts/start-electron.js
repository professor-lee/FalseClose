import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

// 设置环境变量并启动 Electron
process.env.VITE_DEV_SERVER_URL = 'http://localhost:5173'

const electron = spawn('electron', ['.'], {
  cwd: projectRoot,
  stdio: 'inherit',
  env: {
    ...process.env,
    VITE_DEV_SERVER_URL: 'http://localhost:5173'
  }
})

electron.on('close', (code) => {
  process.exit(code)
})

process.on('SIGINT', () => {
  electron.kill('SIGINT')
})
