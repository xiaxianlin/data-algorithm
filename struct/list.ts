import { fibSearch } from '../algorithm/search'

export class ListNode<T> {
    data: T // 数据
    pred: ListNode<T> // 前驱节点
    succ: ListNode<T> // 后继节点

    // ----- public -----
    constructor(e: T = null, p: ListNode<T> = null, s: ListNode<T> = null) {
        this.data = e
        this.pred = p
        this.succ = s
    }
    // 插入前驱节点，存入对象被引用对象e，返回新节点位置
    insertAsPred(e: T) {
        let x = new ListNode(e, this.pred, this)
        this.pred.succ = x
        this.pred = x
        return x
    }
    // 插入后继节点，存入对象被引用对象e，返回新节点位置
    insertAsSucc(e: T) {
        let x = new ListNode(e, this, this.succ)
        this.succ.pred = x
        this.succ = x
        return x
    }
}

class List<T> {
    private _size: number // 规模大小
    private header: ListNode<T> // 头哨兵节点
    private trailer: ListNode<T> // 尾哨兵节点
    // ----- protected -----
    protected init() {
        this.header = new ListNode<T>()
        this.trailer = new ListNode<T>()
        this.header.pred = null
        this.header.succ = this.trailer
        this.trailer.pred = this.header
        this.trailer.succ = null
        this._size = 0
    }
    protected clear() {
        let oldSize = this._size
        while (0 < this._size) this.remove(this.header.succ)
        return oldSize
    }
    protected copyNodes(p: ListNode<T>, n: number) {
        this.init()
        while (n--) {
            this.insertAsLast(p.data)
            p = p.succ
        }
    }

    protected print(p: ListNode<T>, n: number) {
        let A = []
        while (0 < n) {
            p = p.succ
            if (!p) break
            A.push(p.pred.data)
            n--
        }
        console.log(A)
    }

    protected swap(a: ListNode<T>, b: ListNode<T>) {
        let ap = a.pred
        let an = a.succ
        let bp = b.pred
        let bn = b.succ
        // A节点后端
        a.succ = bn
        bn.pred = a
        // B节点前端
        b.pred = ap
        ap.succ = b
        // A和B为相邻节点
        if (a === bp) {
            a.pred = b
            b.succ = a
        } else {
            // A节点前端
            a.pred = bp
            bp.succ = a
            // B节点后端
            b.succ = an
            an.pred = b
        }
    }
    protected merge(lo: number, mid: number, hi: number) {
        let n = mid - lo,
            m = hi - mid
        let p = this.get(lo),
            q = this.get(mid)
        while (0 < m) {
            // // 若p仍在区间内且v(p) <= v(q)则
            if (0 < n && p.data <= q.data) {
                // p归入合并的列表，并替换为其直接后继
                if ((p = p.succ) === q) break
                n--
            }
            // 如果p超出右界或v(q) < v(p)，则
            else {
                this.insertBefore(p, this.remove((q = q.succ).pred))
                m--
            }
        }
    }
    protected mergeSort(lo: number, hi: number) {
        if (hi - lo < 2) return
        let m = (hi + lo) >> 1
        // 对前、后子列表分别排序
        this.mergeSort(lo, m)
        this.mergeSort(m, hi)
        // 归并
        this.merge(lo, m, hi)
    }
    protected selectionSort(p: ListNode<T>, n: number) {
        let head = p.pred,
            tail = p
        for (let i = 0; i < n; i++) tail = tail.succ
        while (1 < n) {
            let max = this.selectMaxAfter(head.succ, n)
            this.insertBefore(tail, this.remove(max))
            tail = tail.pred
            n--
        }
    }
    protected insertionSort(p: ListNode<T>, n: number) {
        for (let r = 0; r < n; r++) {
            this.insertAfter(this.searchInSection(p.data, r, p), p.data)
            p = p.succ
            this.remove(p.pred)
        }
    }
    // ----- public -----
    constructor(a?: List<T> | ListNode<T> | Array<T>, r?: number, n?: number) {
        // 默认初始化
        if (!a) {
            this.init()
        }
        // 表复制
        if (a instanceof List) {
            // 整表复制
            if (!r && !n) {
                this.copyNodes(a.first(), a.size())
            }
            // 区间复制
            if (r && n) {
                this.copyNodes(a.get(r), n)
            }
        }
        // 复制列表中自位置p起的n项
        if (a instanceof ListNode && r) {
            if (!this.valid(a)) {
                throw 'Position is invalid'
            }
            this.copyNodes(a, r)
        }

        if (a instanceof Array) {
            this.init()
            a.forEach((i) => this.insertAsLast(i))
        }
    }
    // 列表规模
    size() {
        return this._size
    }
    // 判断列表是否为空
    empty() {
        return this._size === 0
    }
    // 循秩访问
    get(r: number) {
        let p = this.first()
        while (0 < r--) p = p.succ
        return p
    }
    // 首节点位置
    first() {
        return this.header.succ
    }
    // 末节点位置
    last() {
        return this.trailer.pred
    }
    // 判断位置p是否对外合法
    valid(p: ListNode<T>) {
        return p && this.trailer !== p && this.header !== p
    }
    // 判断列表是否有序
    disordered() {}
    // 无序查找
    find(e: T) {
        return this.findInSection(e, this._size, this.first())
    }
    // 区间内无序查找
    findInSection(e: T, n: number, p: ListNode<T>) {
        while (0 < n--) {
            if (e === (p = p.pred).data) {
                return p
            }
        }
        return null
    }
    // 有序查找
    search(e: T) {
        return this.searchInSection(e, this._size - 1, this.last())
    }
    // 区间内有序查找
    searchInSection(e: T, n: number, p: ListNode<T>) {
        while (0 <= n--) {
            if ((p = p.pred).data <= e) break
        }
        if (p === this.trailer) {
            return null
        }
        return p
    }
    // 选出整体最大者
    selectMax() {
        return this.selectMaxAfter(this.header.succ, this._size)
    }
    // 在p及其n-1个后继中选出最大者
    selectMaxAfter(p: ListNode<T>, n: number) {
        let max = p
        for (let cur = p; 1 < n; n--) {
            if ((cur = cur.succ).data > max.data) {
                max = cur
            }
        }
        return max
    }
    // 将e当作首节点插入
    insertAsFirst(e: T) {
        this._size++
        return this.header.insertAsSucc(e)
    }
    // 将e当作尾节点插入
    insertAsLast(e: T) {
        this._size++
        return this.trailer.insertAsPred(e)
    }
    // 将e当作p的后继插入
    insertAfter(p: ListNode<T>, e: T) {
        this._size++
        return p.insertAsSucc(e)
    }
    // 将e当作p的前驱插入
    insertBefore(p: ListNode<T>, e: T) {
        this._size++
        return p.insertAsPred(e)
    }
    // 删除合法位置p处的节点，返回被删除的节点
    remove(p: ListNode<T>) {
        let e = p.data
        p.pred.succ = p.succ
        p.succ.pred = p.pred
        this._size--
        return e
    }
    // 列表整体排序
    sort() {
        this.sortInSection(this.first(), this._size)
    }
    // 列表区间排序
    sortInSection(p: ListNode<T>, n: number) {
        // return this.insertionSort(p, n)
        // return this.selectionSort(p, n)
        return this.mergeSort(0, n)
    }
    // 无序去重
    deduplicate() {
        // 平凡列表自然无重复
        if (this._size < 2) return 0
        // 记录原规模
        let oldSize = this._size
        // p从首节点开始
        let p = this.header
        let r = 0
        // 依次直到末节点
        while (this.trailer !== (p = p.succ)) {
            // 在p的r个前驱中查找雷同者
            let q = this.findInSection(p.data, r, p)
            // 若存在，则删除之，否则秩加一
            q ? this.remove(q) : r++
        }
        // 返回列表规模变化量
        return oldSize - this._size
    }
    // 有序去重
    uniquify() {
        // 平凡列表自然无重复
        if (this._size < 2) return 0
        // 记录原规模
        let oldSize = this._size
        // p为各区段起点
        let p = this.first()
        // q为后继节点
        let q: ListNode<T> = null
        // 反复考查紧邻的节点对(p, q)
        while (this.trailer !== (q = p.succ)) {
            // 若互异，则转向下一区段
            if (p.data !== q.data) p = q
            // 否则，删除后者
            else this.remove(q)
        }
        // 返回列表规模变化量
        return oldSize - this._size
    }
    // 前后倒置
    reverse() {
        let fc = this.first(),
            bc = this.last()
        // 游标移动，当列表规模为奇数时，前后游标会移动到同一个，为偶数时，前游标是前一个是后游标则停止
        while (fc !== bc && fc.pred !== bc) {
            this.swap(fc, bc)
            // 游标移动
            let t = fc.pred
            fc = bc.succ
            bc = t
        }
    }
    // 遍历
    traverse(visit: (e: T) => void) {
        for (let p = this.header.succ; p !== this.trailer; p = p.succ) {
            visit(p.data)
        }
    }
}

export default List
