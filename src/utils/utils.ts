
// 获取头尾文本节点划词选中内容
export function getStartAndEndRangeText(start: Text, startOffset: number, end: Text, endOffset: number) {
  let startText = ''
  let endText = ''

  if (start === end) {
    startText = start.textContent ? start.textContent.slice(startOffset, endOffset) : ''
    endText = startText
  } else {
    startText = start.textContent ? start.textContent.slice(startOffset) : ''
    endText = end.textContent ? end.textContent.slice(0, endOffset) : ''
  }

  return {
    start: startText,
    end: endText
  }
}

// 获取文本节点 DOMRect 对象，支持跨行场景
export function getTextNodeRects(node: Text, startOffset?: number, endOffset?: number) {
  if (startOffset === undefined) startOffset = 0
  if (endOffset === undefined) endOffset = node.textContent!.length

  const range = document.createRange()
  range.setStart(node, startOffset)
  range.setEnd(node, endOffset)
  return Array.from(range.getClientRects())
}

// 获取 range 某个字符位置的 DOMRect
export function getCharRect(node: Text, offset: number) {
  const range = document.createRange()
  range.setStart(node, offset)
  range.setEnd(node, offset + 1 > node.textContent!.length ? offset : offset + 1)
  return range.getBoundingClientRect()
}

// 获取 start 到 end 深度优先遍历之间的所有 Text Node 节点
export function getTextNodesByDfs(start: Text, end: Text) {
  if (start === end) return []

  const iterator = nodeDfsGenerator(start, false)
  const textNodes: Text[] = []
  iterator.next()
  let value = iterator.next().value
  while (value && value !== end) {
    if (isTextNode(value)) {
      textNodes.push(value)
    }
    value = iterator.next().value
  }
  if (!value) {
    return []
  }
  return textNodes
}

// 对于有子节点的 Node 会遍历到两次，不过 Text Node 肯定没有子节点，所以不会重复统计到
function * nodeDfsGenerator(node: Node, isGoBack = false): Generator<Node, void, Node> {
  yield node
  // isGoBack 用于判断是否属于子节点遍历结束回退到父节点，如果是那么该节点不再遍历其子节点
  if (!isGoBack && node.childNodes.length > 0) {
    yield * nodeDfsGenerator(node.childNodes[0], false)
  } else if (node.nextSibling) {
    yield * nodeDfsGenerator(node.nextSibling, false)
  } else if (node.parentNode) {
    yield * nodeDfsGenerator(node.parentNode, true)
  }
}

function isTextNode(node: Node): node is Text {
  return node.nodeType === 3
}

export function uuid(len?: number, radix = 16): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const uuid = []
  let i
  radix = radix || chars.length
  if (radix > chars.length) radix = chars.length
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
  } else {
    let r
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}

export function debounce<T extends(...arg: any[]) => any>(fn: T, delay = 0) {
  let timeoutId: number
  return function(...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(args), delay)
  }
}
