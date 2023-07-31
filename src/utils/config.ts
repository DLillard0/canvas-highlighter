import { ShapeConstructor } from '../utils/types'

export interface IConfig {
  // container 要设置的 position 属性
  position: 'relative' | 'absolute'
  // container 元素 ResizeObserver 触发函数的防抖 delay
  delay: number
  // 矩形默认填充颜色
  rectFill: string
  // 线段默认填充颜色
  lineStroke: string
  // 线段默认的宽度
  strokeWidth: number
  // 自定义图形构造函数数组
  shapeConstructors?: ShapeConstructor[]
  // canvas 渲染像素比
  pixelRatio?: number
}

export const defaultConfig: IConfig = {
  position: 'relative',
  delay: 300,
  rectFill: 'rgba(255, 170, 0, 0.2)',
  lineStroke: 'rgba(255, 170, 0, 1)',
  strokeWidth: 2
}
