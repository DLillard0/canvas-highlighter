import Konva from 'konva'
import { IRectPosition, IRangeConfig } from '../utils/types'
import { IConfig } from '../utils/config'

const RECT_PREFIX = 'rect-'
const LINE_PREFIX = 'line-'
const SHAPE_PREFIX = 'shape-'

export default class Stage {
  private root: HTMLElement
  private container: HTMLDivElement
  private config: IConfig

  private stage: Konva.Stage
  private layer: Konva.Layer

  private groups: Array<{
    id: string
    group: Konva.Group,
    positions: IRectPosition[]
  }> = []

  constructor(root: HTMLElement, config: IConfig) {
    this.root = root
    this.config = config

    this.container = this.createContainer()
    root.appendChild(this.container)
    const { width, height } = this.getRootPosition()
    this.stage = new Konva.Stage({
      container: this.container,
      width,
      height
    })
    this.layer = new Konva.Layer()
    if (this.config.pixelRatio) this.layer.getCanvas().setPixelRatio(this.config.pixelRatio)
    this.stage.add(this.layer)
  }

  private createContainer() {
    const el = document.createElement('div')
    el.style.position = 'absolute'
    el.style.top = '0'
    el.style.left = '0'
    el.style.right = '0'
    el.style.bottom = '0'
    el.style.pointerEvents = 'none'
    return el
  }

  renderRange(domRects: DOMRect[], id: string, config: IRangeConfig) {
    const { group, rectGroup, lineGroup, shapeGroup } = this.createGroup(id, config)

    const { top, left } = this.getRootPosition()
    const positions: IRectPosition[] = []
    domRects.forEach((i, index) => {
      const x = i.left - left
      const y = i.top - top
      const position = {
        x,
        y,
        width: i.width,
        height: i.height
      }
      positions.push(position)

      const shapeConstructors = this.config.shapeConstructors
      if (shapeGroup && shapeConstructors) {
        shapeConstructors.forEach(fn => {
          shapeGroup.add(fn(position, id, domRects, index))
        })
      }
      rectGroup.add(this.createRect(position, config.rect))
      lineGroup.add(this.createLine(position, config.line))
    })
    this.groups.push({ id, group, positions })
    this.layer.add(group)
  }

  private createGroup(id: string, config: IRangeConfig) {
    const group = new Konva.Group({ id, x: 0, y: 0 })
    const rectGroup = new Konva.Group({
      id: RECT_PREFIX + id,
      x: 0,
      y: 0,
      visible: config.rect.visible
    })
    const lineGroup = new Konva.Group({
      id: LINE_PREFIX + id,
      x: 0,
      y: 0,
      visible: config.line.visible
    })
    const shapeConstructors = this.config.shapeConstructors
    let shapeGroup: Konva.Group | null = null
    if (shapeConstructors && shapeConstructors.length > 0) {
      shapeGroup = new Konva.Group({
        id: SHAPE_PREFIX + id,
        x: 0,
        y: 0
      })
      group.add(shapeGroup)
    }
    group.add(rectGroup)
    group.add(lineGroup)
    return { group, rectGroup, lineGroup, shapeGroup }
  }

  private createRect(position: IRectPosition, config: IRangeConfig['rect']) {
    return new Konva.Rect({
      ...position,
      fill: config.fill,
      ...config.konvaConfig
    })
  }

  private createLine(position: IRectPosition, config: IRangeConfig['line']) {
    const { x, y, width, height } = position
    return new Konva.Line({
      points: [
        x,
        y + height,
        x + width,
        y + height
      ],
      stroke: config.stroke,
      strokeWidth: config.strokeWidth,
      ...config.konvaConfig
    })
  }

  getGroupIdByPointer(x: number, y: number) {
    const { top, left } = this.getRootPosition()
    x = x - left
    y = y - top
    const target = this.groups.find(i => {
      return i.positions.some(j => {
        return (
          x >= j.x &&
          x <= j.x + j.width &&
          y >= j.y &&
          y <= j.y + j.height
        )
      })
    })
    if (target) {
      return target.group.id()
    } else {
      return null
    }
  }

  getAllGroupIdByPointer(x: number, y: number) {
    const { top, left } = this.getRootPosition()
    x = x - left
    y = y - top
    return this.groups.filter(i => {
      return i.positions.some(j => {
        return (
          x >= j.x &&
          x <= j.x + j.width &&
          y >= j.y &&
          y <= j.y + j.height
        )
      })
    }).map(i => i.group.id())
  }

  private getRootPosition() {
    return this.root.getBoundingClientRect()
  }

  deleteRange(id: string) {
    const index = this.groups.findIndex(i => i.id === id)
    if (index === -1) return false
    this.groups.splice(index, 1)
    const group = this.layer.find('#' + id)[0]
    group && group.destroy()
  }

  getRangePositions(id: string) {
    const group = this.groups.find(i => i.id === id)
    return group ? group.positions : null
  }

  clear() {
    this.layer.destroyChildren()
    this.groups = []
  }

  updateStageSize() {
    const { width, height } = this.getRootPosition()
    this.stage.setSize({ width, height })
  }
}
