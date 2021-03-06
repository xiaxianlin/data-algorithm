import BinTree, { BinNode } from '../struct/binary_tree'
import Bitmap from '../struct/bitmap'
import Entry from '../struct/entry'
import Queue from '../struct/queue'
import Stack from '../struct/stack'
import { MAX_INT } from './data'

export function rand(min: number, max?: number) {
    if (typeof max === 'undefined') {
        max = min
        min = 0
    }
    if (min > max) {
        throw 'min must less then max'
    }
    return Math.round(Math.random() * (max - min)) + min
}

export function isdigit(s: string) {
    return /^[0-9]{1}$/.test(s)
}

export function readNumber(S: string, opnd: Stack<number>) {
    let n = '',
        i = 0
    while (isdigit(S.charAt(i))) n += S.charAt(i++)
    opnd.push(Number(n))
    return S.slice(i)
}

export function calcu(op: string, n1: number, n2?: number) {
    switch (op) {
        case '!':
            let r = n1
            for (let i = n1 - 1; i > 0; i--) r *= i
            return r
        case '^':
            return Math.pow(n1, n2)
        case '+':
            return n1 + n2
        case '-':
            return n1 - n2
        case '*':
            return n1 * n2
        case '/':
            return Math.floor(n1 / n2)
        default:
            return null
    }
}

export function swap<T>(arr: T[], i: number, j: number) {
    let t = arr[i]
    arr[i] = arr[j]
    arr[j] = t
}

export function max(arr: number[]) {
    let max = arr[0]
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) max = arr[i]
    }
    return max
}

export function arrayFill<T>(n: number, s: T) {
    let a = []
    while (-1 < n) a[--n] = s
    return a
}

export function printBinTree<T>(x: BinNode<T>, closed: boolean = false) {
    if (!x || closed) return
    let Q = new Queue<BinNode<T>>() // 辅助队列
    Q.enqueue(x) // 根节点入队
    let data = []
    let level = 0
    while (!Q.empty()) {
        x = Q.dequeue() // 拿出父节点
        level = x.level = x.parent ? x.parent.level + 1 : 0
        data[x.level] = data[x.level] || []
        if (x.isLChild()) {
            x.position = 2 * x.parent.position
        } else if (x.isRChild()) {
            x.position = 2 * x.parent.position + 1
        }
        data[x.level].push(x)
        if (x.lc) Q.enqueue(x.lc) // 左子节点入队
        if (x.rc) Q.enqueue(x.rc) // 右子节点入队
    }
    let len = 1 * Math.pow(2, level + 1)
    let info = data.reduce((info: string, items: BinNode<T>[], index: number) => {
        let tmp = arrayFill(len, '_')
        let thunk = Math.ceil(len / Math.pow(2, index + 1))
        items.forEach((item: BinNode<T>) => {
            tmp[thunk * item.position * 2 + thunk] = item.data
        })
        return info + tmp.join('') + '\n'
    }, '')
    console.log(info)
}

export function createRef<T>(value: T) {
    return { value }
}

/**
 * 根据file文件中的记录，在[c, n)内取最小的素数
 */
export function primeNLT(c: number, n: number, file: string) {
    let b = new Bitmap(file, n) // file已经按位图格式记录了n以内的所有素数，因此只要
    // 从c开始，逐位地
    while (c < n) {
        // 测试，即可
        if (b.test(c)) {
            c++
        }
        // 返回首个发现的素数
        else {
            return c
        }
    }
    return c // 若没有这样的素数，返回n（实用中不能如此简化处理）
}

export function hashCode<T>(c: T | string[]) {
    if (typeof c === 'string') {
        return c.charCodeAt(0)
    }
    if (typeof c === 'number') {
        return c <= MAX_INT ? MAX_INT : MAX_INT + (c >> 32)
    }
    // 生成字符串的循环移位散列码（cyclic shift hash code）
    if (c instanceof Array) {
        let h = 0 // 散列码
        // 自左向右，逐个处理每一字符
        for (let n = c.length, i = 0; i < n; i++) {
            // 散列码循环左移5位，再累加当前字符
            h = (h << 5) | (h >> 27)
            h += c[i].charCodeAt(0)
        }
        return h // 如此所得的散列码，实际上可理解为近似的“多项式散列码”
    }
}
