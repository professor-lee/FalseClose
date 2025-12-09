<p align="center">
  <img src="icon.svg" alt="VueDrag Builder Logo" width="256">
</p>
<h1 align="center">VueDrag Builder</h1>
<p align="center">
  <a href="README.md">English</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="README_zh-CN.md">简体中文</a>
</p>
<p align="center" style="color:gray;">
  🚀 Zero-configuration Vue3 visual frontend builder platform
</p>
<p align="center">
  <img src="https://img.shields.io/badge/Electron-39.0%2B-47848F?logo=electron&logoColor=white" alt="Electron">
  <img src="https://img.shields.io/badge/Vue-3.4%2B-4FC08D?logo=vue.js&logoColor=white" alt="Vue">
  <img src="https://img.shields.io/badge/Vite-6.0%2B-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Element_Plus-2.5%2B-409EFF?logo=element-plus&logoColor=white" alt="Element Plus">
  <img src="https://img.shields.io/badge/License-AGPL--3.0-blue" alt="License">
  <img src="https://img.shields.io/github/stars/professor-lee/VueDrag-Builder?style=flat&label=Stars&color=FFC700&logo=github&logoColor=white" alt="Stars">
</p>

<h2 align="center">📋 Project Overview</h2>

**VueDrag Builder** is a modern desktop application built with **Electron** + **Vue3** + **Vite**, designed to deliver the ultimate **WYSIWYG (What You See Is What You Get)** frontend development experience.

It not only supports intuitive **component drag-and-drop**, **visual property/style editing**, and **event orchestration**, but its core feature is **bidirectional code synchronization** — you can freely create on the canvas or directly edit the generated source code, with both staying in real-time sync. Ultimately, you can export your project as a standard Vue3 project source code or directly generate the built production files.

<h2 align="center">✨ Features</h2>

- **🎨 Visual Drag-and-Drop Layout**: Comes with a rich set of built-in basic components; quickly build page structures by dragging and dropping.
- **🔧 Property & Style Editor**: Intuitive sidebar panels for easily adjusting component properties, styles (CSS), and binding events.
- **💻 Bidirectional Code Sync**: Integrated Monaco Editor supporting real-time Vue SFC code editing — changes in code instantly reflect on the canvas, and vice versa.
- **📱 Responsive Preview**: Switch between multiple device sizes (desktop, tablet, mobile) for preview, ensuring cross-device compatibility.
- **⌨️ Keyboard Shortcuts**: Comprehensive shortcut system to boost development efficiency.
- **💾 Auto-save & History**: Supports automatic project saving and full-featured Undo/Redo functionality.
- **📤 Flexible Export**: Export as Vue3 source project or directly build and generate the `dist` output.

<h2 align="center">🕹️ Tech Stack</h2>

- **Desktop Runtime**: [Electron](https://www.electronjs.org/) 39+
- **Frontend Framework**: [Vue](https://vuejs.org/) 3.4+
- **Build Tool**: [Vite](https://vitejs.dev/) 6+
- **State Management**: [Pinia](https://pinia.vuejs.org/) 2.1+
- **UI Component Library**: [Element Plus](https://element-plus.org/) 2.5+
- **Code Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/) 0.45+
- **Drag-and-Drop Library**: [SortableJS](https://sortablejs.github.io/Sortable/) / VueDraggable
- **AST Transformation**: [Recast](https://github.com/benjamn/recast) (for code generation and parsing)

<h2 align="center">🛠️ Development Setup</h2>

### 1. Install dependencies
```bash
npm install
```

### 2. Start development mode
```bash
# Starts both Vite dev server and Electron main process
npm run electron:dev
```

### 3. Build the application
```bash
# Builds the Vue app and packages it into an Electron installer
npm run electron:build
```

<h2 align="center">📂 Project Structure</h2>

```
vue-drag-builder/
├── electron/               # Electron main process
│   ├── main.js             # Main process entry
│   ├── preload.js          # Preload script (ContextBridge)
│   └── menu.js             # Native app menu configuration
├── src/                    # Vue3 renderer process
│   ├── assets/             # Static assets (CSS, Images)
│   ├── components/         # Component collection
│   │   ├── canvas/         # Canvas area (CanvasArea, DynamicComponent)
│   │   ├── code-mode/      # Code mode (Monaco Editor + Preview)
│   │   ├── layout/         # Layout components (TopBar, StatusBar, Panels)
│   │   ├── left-panel/     # Left panel (component library, page management, component tree)
│   │   ├── library/        # Component library core logic
│   │   ├── logic/          # Logic processing components
│   │   ├── right-panel/    # Right panel (props, styles, events)
│   │   └── terminal/       # Terminal component
│   ├── composables/        # Composable functions (Hooks)
│   │   ├── useAutoSave.js       # Auto-save logic
│   │   ├── useComponentResize.js# Component resize logic
│   │   ├── useDragAndDrop.js    # Core drag-and-drop logic
│   │   └── useProjectExport.js  # Project export logic
│   ├── stores/             # Pinia stores
│   │   ├── canvas.js       # Canvas state
│   │   ├── editor.js       # Global editor state
│   │   ├── errors.js       # Error logs
│   │   ├── history.js      # Undo/Redo history stack
│   │   └── project.js      # Project configuration
│   ├── utils/              # Utility functions
│   │   ├── codeGenerator.js     # Code generator (JSON → Vue SFC)
│   │   ├── componentRegistry.js # Component registry
│   │   └── fileExporter.js      # File export utilities
│   ├── views/              # Page views
│   │   ├── WelcomeView.vue # Welcome page
│   │   └── EditorView.vue  # Main editor page
│   ├── router/             # Vue Router configuration
│   ├── App.vue             # Root component
│   └── main.js             # App entry
├── index.html
├── package.json
└── vite.config.js
```

<h2 align="center">⌨️ Keyboard Shortcuts</h2>

| Feature               | Windows/Linux          | macOS                |
|-----------------------|------------------------|----------------------|
| **New Project**       | `Ctrl + N`             | `Cmd + N`            |
| **Open Project**      | `Ctrl + O`             | `Cmd + O`            |
| **Save Project**      | `Ctrl + S`             | `Cmd + S`            |
| **Save As**           | `Ctrl + Shift + S`     | `Cmd + Shift + S`    |
| **Export Project**    | `Ctrl + E`             | `Cmd + E`            |
| **Undo**              | `Ctrl + Z`             | `Cmd + Z`            |
| **Redo**              | `Ctrl + Shift + Z`     | `Cmd + Shift + Z`    |
| **Toggle View Mode**  | `Ctrl + M`             | `Cmd + M`            |
| **Toggle Terminal**   | `Ctrl + \``            | `Cmd + \``           |
| **Delete Component**  | `Delete` / `Backspace` | `Delete` / `Backspace` |
| **Canvas Zoom**       | `Ctrl + Wheel`         | `Cmd + Wheel`        |
| **Canvas Pan**        | `Space + Drag`         | `Space + Drag`       |

<h2 align="center">🗺️ Roadmap</h2>

- [x] **MVP basic framework**
- [x] **Drag-and-drop functionality completion**
- [x] **Code mode with Monaco Editor integration**
- [x] **Bidirectional code synchronization (Visual ↔ Code)**
- [x] **Responsive preview & device switching**
- [x] **Trackpad gestures & canvas interaction optimization**
- [x] **Full-featured preview experience (zoom/pan/trackpad)**
- [x] **Export functionality (source code; build relies on local Node/npm)**
- [ ] 🚧 **Form validation library integration**
- [ ] 🎨 **Theme system**
- [ ] 🧩 **Plugin system**
- [ ] ☁️ **Cloud storage and sharing**

---

<h3>🤝 Contributing</h3>

Issues and Pull Requests are warmly welcomed!  
If you like this project, please give it a ⭐️ Star!

<h3>⚖️ License</h3>

[AGPL-3.0 license](LICENSE)
