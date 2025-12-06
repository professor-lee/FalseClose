# changeDoc.md

# 前端可视化搭建平台完整组件库设计文档（纯 Vue3 版）

本文档为纯前端可视化拖拽建站系统提供完整的原子组件、Vue3 独有拖拽组件、可复用 .vue 文件组件以及页面内部路由组件设计方案。所有组件最终导出为标准 Vue3 单文件组件（SFC），支持完整样式自定义、事件绑定与响应式数据驱动。

---

## 第一部分：前端可视化搭建平台全部原子拖拽组件

原子组件是可视化搭建系统中最小不可再分的 UI 单元，用户可从左侧组件面板拖入画布，自由组合形成页面。以下为完整原子组件清单，每项均包含：

- **功能描述**
- **样式描述**
- **CSS 可自定义项**
- **事件可绑定项**

### 1. 按钮（Button）
- **功能描述**：可点击元素，用于触发提交、跳转、弹窗等动作，支持文字、图标、加载状态、禁用状态。
- **样式描述**：圆角矩形，实心背景（默认蓝色），白色文字，悬停时加深颜色或阴影。
- **CSS 可自定义项**：background-color、color、font-size、border-radius、padding、width、height、box-shadow、cursor、border
- **事件可绑定项**：click、dblclick、mouseenter、mouseleave、focus、blur

### 2. 输入框（Input）
- **功能描述**：单行文本输入，支持 text、password、email、number 等类型，内置占位符、校验、清空按钮。
- **样式描述**：带边框矩形，获得焦点时外发光或边框变蓝。
- **CSS 可自定义项**：border、border-color、padding、font-size、width、height、background-color、color、outline
- **事件可绑定项**：input、change、focus、blur、keydown、keyup、paste

### 3. 多行文本框（Textarea）
- **功能描述**：多行文本输入，支持自动高度、字符计数、最大长度限制。
- **样式描述**：与 Input 类似但更高，默认支持垂直拖拽调整高度。
- **CSS 可自定义项**：border、padding、font-size、width、height、resize、background-color、color
- **事件可绑定项**：input、change、focus、blur、keydown

### 4. 下拉选择框（Select）
- **功能描述**：从预设选项中选择，支持单选、多选、可搜索、可分组。
- **样式描述**：带下拉箭头的输入框，点击展开选项列表。
- **CSS 可自定义项**：border、padding、font-size、width、background-color、color、箭头颜色/大小
- **事件可绑定项**：change、open、close、focus、blur、search

### 5. 复选框（Checkbox）
- **功能描述**：多选布尔值，常用于批量选择。
- **样式描述**：方形框，选中时出现对勾，旁边可配文字标签。
- **CSS 可自定义项**：大小、未选中/选中颜色、边框、标签文字大小/颜色、间距
- **事件可绑定项**：change、click

### 6. 单选框（Radio）
- **功能描述**：同一组内互斥单选。
- **样式描述**：圆形按钮，选中时出现实心圆点。
- **CSS 可自定义项**：大小、未选中/选中颜色、边框、标签文字样式
- **事件可绑定项**：change、click

### 7. 开关（Switch）
- **功能描述**：开关式布尔值切换，常用于设置项。
- **样式描述**：胶囊形滑块，开启时绿色，关闭时灰色，内部小圆点滑动。
- **CSS 可自定义项**：宽高、开启/关闭背景色、小圆点颜色、大小、圆角
- **事件可绑定项**：change、click

### 8. 滑块（Slider）
- **功能描述**：范围数值选择，支持单滑块、双滑块、刻度、提示。
- **样式描述**：水平轨道 + 可拖动滑块，显示当前值。
- **CSS 可自定义项**：轨道颜色/高度、滑块大小/颜色、刻度颜色、宽度
- **事件可绑定项**：input、change、start、end

### 9. 日期选择器（DatePicker）
- **功能描述**：日历形式选择日期，支持单日期、日期范围、快捷选项。
- **样式描述**：输入框 + 弹出日历面板，选中日期高亮。
- **CSS 可自定义项**：边框、面板背景、选中日期颜色、字体大小、今天高亮颜色
- **事件可绑定项**：change、open、close、panel-change

### 10. 时间选择器（TimePicker）
- **功能描述**：选择具体时间，支持小时/分钟/秒、12/24 小时制。
- **样式描述**：输入框 + 下拉时间滚轮或时钟盘。
- **CSS 可自定义项**：边框、面板背景、选中项颜色、滚轮高度
- **事件可绑定项**：change、open、close

### 11. 文件上传（Upload）
- **功能描述**：支持点击上传、拖拽上传、多文件、图片预览、进度条。
- **样式描述**：虚线边框区域 + 上传图标，上传中显示进度条。
- **CSS 可自定义项**：边框样式/颜色、宽高、图标大小/颜色、进度条颜色
- **事件可绑定项**：change、success、error、progress、remove、dragover、drop

### 12. 图片（Image）
- **功能描述**：展示网络图片或上传图片，支持懒加载、占位图、错误图。
- **样式描述**：响应式图片，默认 object-fit: cover。
- **CSS 可自定义项**：width、height、border-radius、object-fit、filter、object-position
- **事件可绑定项**：load、error、click

### 13. 文本/标签（Text / Label）
- **功能描述**：纯文本展示，支持富文本（HTML）、动态绑定。
- **样式描述**：普通文字，支持不同字体大小、粗细、颜色。
- **CSS 可自定义项**：font-size、font-weight、color、line-height、text-align、letter-spacing
- **事件可绑定项**：click、dblclick、mouseenter、mouseleave

### 14. 图标（Icon）
- **功能描述**：展示 SVG 或字体图标（支持 IconFont、Element Plus Icons 等）。
- **样式描述**：单色可缩放矢量图标。
- **CSS 可自定义项**：size、color、margin、rotate、fill、stroke
- **事件可绑定项**：click、mouseenter

### 15. 分割线（Divider）
- **功能描述**：水平或垂直分割线，用于内容分隔。
- **样式描述**：细实线，默认水平占满宽度，可带文字。
- **CSS 可自定义项**：border-style、border-color、border-width、方向、文字颜色/大小
- **事件可绑定项**：无（静态组件）

### 16. 卡片（Card）
- **功能描述**：带阴影的容器，可包含标题、内容、操作区域。
- **样式描述**：白色背景、圆角、轻微阴影。
- **CSS 可自定义项**：background、border-radius、box-shadow、padding、width
- **事件可绑定项**：click

### 17. 标签页（Tabs）
- **功能描述**：多面板切换展示不同内容。
- **样式描述**：水平标签栏，激活项带下划线或背景高亮。
- **CSS 可自定义项**：标签颜色（激活/未激活）、下划线颜色、字体大小、对齐方式
- **事件可绑定项**：tab-click、tab-change

### 18. 折叠面板（Accordion）
- **功能描述**：可展开/收起的面板组，常用于 FAQ。
- **样式描述**：堆叠式面板，带展开箭头。
- **CSS 可自定义项**：标题背景/颜色、内容内边距、箭头大小
- **事件可绑定项**：expand、collapse、change

### 19. 表格（Table）
- **功能描述**：数据表格展示，支持排序、分页、行选择、固定列。
- **样式描述**：带边框、斑马纹、表头高亮。
- **CSS 可自定义项**：边框、单元格内边距、表头背景、行悬停颜色、字体
- **事件可绑定项**：row-click、row-dblclick、sort-change、selection-change、page-change

### 20. 表单容器（Form）
- **功能描述**：表单项容器，统一管理校验、提交、重置。
- **样式描述**：垂直布局，标签在上或左对齐。
- **CSS 可自定义项**：布局方式（vertical/horizontal）、间距、标签字体/颜色
- **事件可绑定项**：submit、reset、validate

---

## 第二部分：Vue3 可视化搭建平台独有的拖拽组件

以下组件充分利用 Vue3 Composition API、v-model 双向绑定、Teleport、Suspense 等特性，在其他框架中难以实现或实现成本极高。

### 1. 可拖拽排序列表（Draggable / Sortable List）
- **功能描述**：支持列表内排序、跨列表拖拽转移，常用于看板、菜单排序。
- **实现方式**：基于 vuedraggable（Sortable.js 的 Vue3 封装）实现，结合 TransitionGroup 实现动画。
- **伪代码构想**：
  ```vue
  <script setup>
  import Draggable from 'vuedraggable'
  const list = ref([{ id: 1, name: '项目1' }])
  </script>

  <template>
    <Draggable v-model="list" group="people" item-key="id" animation="300">
      <template #item="{ element }">
        <div class="drag-item">{{ element.name }}</div>
      </template>
    </Draggable>
  </template>
  ```
- **样式描述**：拖拽时显示幽灵元素，平滑移动动画。
- **CSS 可自定义项**：拖拽手柄样式、幽灵元素透明度、动画时长、间距
- **事件可绑定项**：start、end、add、remove、change、move

### 2. 列表动画容器（TransitionGroup）
- **功能描述**：为拖拽排序、动态增删列表项提供进入/离开动画。
- **实现方式**：结合 Draggable 使用，自动为每个列表项添加动画。
- **伪代码构想**：
  ```vue
  <TransitionGroup name="fade-move" tag="ul">
    <li v-for="item in items" :key="item.id" class="item">
      {{ item.name }}
    </li>
  </TransitionGroup>
  ```
- **样式描述**：淡入淡出 + 位移动画。
- **CSS 可自定义项**：动画时长、透明度、位移距离、缓动函数
- **事件可绑定项**：before-enter、enter、after-enter、leave

### 3. 传送门组件（Teleport）
- **功能描述**：将拖拽到模态框、抽屉、tooltip 中的内容传送到 body 或指定容器，避免被父级样式影响。
- **实现方式**：可视化搭建时可将组件拖入“模态框插槽”，自动包裹 Teleport。
- **伪代码构想**：
  ```vue
  <Teleport to="#modal-container">
    <div class="modal-content">拖拽进来的任意组件</div>
  </Teleport>
  ```
- **样式描述**：固定定位、全屏蒙层或居中弹窗。
- **CSS 可自定义项**：z-index、position、背景蒙层透明度
- **事件可绑定项**：mounted、updated

### 4. 异步加载容器（Suspense）
- **功能描述**：拖拽进来的动态组件或异步组件显示 loading 状态。
- **实现方式**：大型组件可标记为异步加载，拖入画布时自动包裹 Suspense。
- **伪代码构想**：
  ```vue
  <Suspense>
    <template #default>
      <AsyncChartComponent />
    </template>
    <template #fallback>
      <div class="skeleton">加载中...</div>
    </template>
  </Suspense>
  ```
- **样式描述**：骨架屏或旋转加载动画。
- **CSS 可自定义项**：骨架屏颜色、加载动画大小/颜色
- **事件可绑定项**：resolve、fallback

---

## 第三部分：Vue3 可视化平台独有的 .vue 文件复用组件与页面内部路由组件

### 1. 可复用 .vue 单文件组件（Reusable .vue Component）
- **功能描述**：用户可将已有的 .vue 文件作为“自定义组件”拖入画布，实现跨页面复用。
- **实现方式**：使用 defineAsyncComponent 动态导入，用户在属性面板填写组件路径或从组件库选择。
- **伪代码构想**：
  ```vue
  <script setup>
  import { defineAsyncComponent } from 'vue'
  const MyCard = defineAsyncComponent(() => 
    import('@/components/custom/MyCard.vue')
  )
  </script>

  <template>
    <MyCard :data="cardData" />
  </template>
  ```
- **样式描述**：完全继承被导入组件的样式。
- **CSS 可自定义项**：通过传入 class 或 style props 覆盖内部样式
- **事件可绑定项**：被导入组件暴露的所有自定义事件

### 2. 路由链接（RouterLink）
- **功能描述**：拖拽即可创建页面内跳转链接，无需刷新。
- **实现方式**：集成 vue-router，用户在属性面板选择目标页面或填写路径。
- **伪代码构想**：
  ```vue
  <RouterLink to="/dashboard" custom>
    <template #default="{ navigate, href, isActive }">
      <button :class="{ active: isActive }" @click="navigate">
        仪表盘
      </button>
    </template>
  </RouterLink>
  ```
- **样式描述**：文字下划线或按钮样式，激活状态高亮。
- **CSS 可自定义项**：color、text-decoration、hover 颜色、激活颜色
- **事件可绑定项**：click、navigate

### 3. 路由视图占位（RouterView）
- **功能描述**：页面布局中的路由内容渲染占位符，用于多页面应用。
- **实现方式**：拖入布局容器后，自动成为当前页面的 <router-view>，支持命名视图。
- **伪代码构想**：
  ```vue
  <template>
    <div class="layout">
      <Header />
      <RouterView />
      <Footer />
    </div>
  </template>
  ```
- **样式描述**：占满剩余空间的容器。
- **CSS 可自定义项**：width、height、padding、overflow
- **事件可绑定项**：通过 watch($route) 监听路由变化

---

至此，文档已完整覆盖纯 Vue3 可视化拖拽建站系统所需的所有原子组件、Vue3 独有高级拖拽组件、可复用组件与路由组件。可直接用于组件库开发与导出工程代码生成。


