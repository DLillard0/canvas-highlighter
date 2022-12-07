# canvas-highlighter

基于 canvas 实现的文本划词高亮，与文本展示的结构完全解耦，不改变文本内容的 DOM 结构。

## Installation

```shell
npm install canvas-highlighter
```

## Usage

### 最简单的实现文本划词直接高亮

```javascript
import CanvasHighlighter from 'canvas-highlighter'

// container 为页面需要划词高亮区域的 DOM 对象
const container = document.getElementById('container')
const highlighter = new CanvasHighlighter(container)
container.addEventListener('mouseup', () => {
  const range = highlighter.getSelectionRange()
  if (range) highlighter.addRange(range)
})
```

### 自定义高亮区域样式

高亮区域采用 [konva](https://github.com/konvajs/konva) 库进行渲染，会在划词区域渲染一个 Rect 和底部渲染一个 Line，可通过修改传入 range 对象上的 config 属性进行自定义

```javascript
const range = highlighter.getSelectionRange()
const { rect, line } = range.config

// 修改矩形填充颜色
rect.fill = 'red'
// 隐藏线段
line.visible = false

highlighter.addRange(range)
```

### 监听高亮区域点击

```javascript
document.addEventListener('click', (event) => {
  // 通过传入点击位置获取 range id
  const id = highlighter.geRangeIdByPointer(event.pageX, event.pageY)
})
```

### 更多例子

#### 1. 划词点击高亮

[在线演示](https://dlillard0.github.io/canvas-highlighter/)

[源码](https://github.com/DLillard0/canvas-highlighter/blob/main/docs/index.html)

#### 2. 实现类似语雀的划词评论功能

[在线演示](https://dlillard0.github.io/canvas-highlighter/yuque.html)

[源码](https://github.com/DLillard0/canvas-highlighter/blob/main/docs/yuque.html)

## API

### CanvasHighlighter(container [, config])

#### container

需要划词高亮区域的 DOM 对象，必须在该对象内容渲染完成时再调用 `new CanvasHighlighter(container)`

#### config

| 参数 | 说明 | 类型 | 默认值 |
| - | - | - | - |
| position | container 要设置的 position 属性 | relative / absolute | relative |
| delay | container 元素 ResizeObserver 触发函数的防抖 delay | number | 300 |
| rectFill | 矩形默认填充颜色 | string | rgba(255, 170, 0, 0.2) |
| lineStroke | 线段默认填充颜色 | string | rgba(255, 170, 0, 1) |
| strokeWidth | 线段默认的宽度 | number | 2 |
| pixelRatio | canvas 渲染像素比，当 canvas 元素占用内存过大时可以设置小一点来减少内存占用 | number | — |

### instance methods

```typescript
/**
 * 根据 selection 获取 range，未传 selection 则通过 document.getSelection() 获取
 */
getSelectionRange(selection?: Selection | null): IRange | null

/**
 * 根据 selection 获取头尾两个字符的 DOMRect 对象，未传 selection 则通过 document.getSelection() 获取
 */
getSelectionPosition(selection?: Selection | null): { start: DOMRect, end: DOMRect } | null

/**
 * 清空页面所有 range 并渲染传入的 range 列表
 */
renderRanges(ranges: IRange[]): void

/**
 * 添加 range 并渲染
 * @return ture 表示添加成功，false 表示无效 range
 */
addRange(range: IRange): boolean

/**
 * 根据 id 获取 range
 */
getRange(id: string): IRange | null

/**
 * 根据 id 删除 range
 * @return ture 表示删除成功，false 表示未找到
 */
deleteRange(id: string): boolean

/**
 * 重新渲染已存在 range（根据 id 判断）
 */
updateRange(range: IRange): void

/**
 * 获取当前所有 range 的列表
 */
getAllRange(): IRange[]

/**
 * 清除所有 range
 */
clear(): void

/**
 * 根据页面坐标点判断处于哪个 range 范围内，返回该 id
 */
geRangeIdByPointer(x: number, y:number): string | null
```

### Range

```typescript
interface IRange {
  // 每个 range 的唯一 id，不能重复
  id: string
  // 划词文本内容
  text: string
  // 开始文本节点
  start: IRangeNode
  // 结束文本节点
  end: IRangeNode
  // 高亮区域的渲染配置项，使用 konva 库进行渲染，可自定义
  config: IRangeConfig
}

interface IRangeNode {
  // 从 container 找到该节点的路径数组
  path: number[]
  // 划词开始偏移量
  offset: number
  // 在该文本中划词的
  text: string
}

interface IRangeConfig {
  // 矩形配置项
  rect: {
    // 填充颜色
    fill: string
    // 是否显示
    visible: boolean
    // 自定义 konva 配置，参考 https://konvajs.org/api/Konva.Rect.html#Rect__anchor
    konvaConfig?: Konva.RectConfig
  }
  // 线段配置项
  line: {
    // 线段颜色
    stroke: string
    // 线段宽度
    strokeWidth: number
    // 是否显示
    visible: boolean
    // 自定义 konva 配置，参考 https://konvajs.org/api/Konva.Line.html#Line__anchor
    konvaConfig?: Konva.LineConfig
  }
}
```
