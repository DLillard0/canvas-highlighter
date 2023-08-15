import Konva from 'konva'

export interface IRectPosition {
  x: number
  y: number
  width: number
  height: number
}

export type ShapeConstructor = (position: IRectPosition, id: string, domRects: DOMRect[], index: number) => Konva.Shape

export interface IRangeNode {
  path: number[]
  offset: number
  text: string
}

export interface IRangeConfig {
  rect: {
    fill: string
    visible: boolean
    konvaConfig?: Konva.RectConfig
  }
  line: {
    stroke: string
    strokeWidth: number
    visible: boolean
    konvaConfig?: Konva.LineConfig
  }
}

export interface IRange {
  id: string
  text: string
  start: IRangeNode
  end: IRangeNode
  // 渲染配置项
  config: IRangeConfig
}

export interface ICanvasHighlighter {
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
   * 根据 id 获取 range 相对于 container 的位置信息
   */
  getRangePositions(id: string): IRectPosition[] | null

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
  getRangeIdByPointer(x: number, y:number): string | null
}
