/**
  min[number] 默认值 0, // 最小值
  max[number] 默认值 100, // 最大值
  int[boolean] 默认值 true, // 是否开启整数模式 ，false为小数模式  整数模式 step最小单位是 1 ，小数模式，step的最小单位是 0.1
  single[number] 默认值 10, // 单个格子的实际长度（单位px）
  h[number] 默认值 0,// 自定义高度 初始值为80
  active[null] 默认值 center ，// 自定义选中位置  （三个值 min, max ,center , 范围内合法数值）
  styles[object]  // 自定义卡尺样式
*/
const defaultStyles = {
  line: '#B3B5C0', // 刻度颜色
  bginner: '#ABADB8', // 前景色（文字）颜色
  bgoutside: '#F3F7FA', // 背景色颜色
  lineSelect: '#1FBC9F', // 选中线颜色
  fontColor: '#B3B5C0', // 刻度数字颜色
  fontSize: 16 //字体大小
}
// 函数防抖 wait：单位是毫秒  
let deboTimeout = null
const debounce = function (fn, wait) {
  if (deboTimeout !== null)
    clearTimeout(deboTimeout)
  deboTimeout = setTimeout(fn, wait)
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否输出 值变化
    isOut: {
      type: Boolean,
      value: false
    },
    // 最小值
    min: {
      type: Number,
      value: 0
    },
    //最大值
    max: {
      type: Number,
      value: 100
    },
    // 是否开启整数模式
    int: {
      type: Boolean,
      value: false
    },
    unit: { //单位 字符串
      type: String,
      value: ''
    },
    // 每个格子的实际行度 （单位px ，相对默认值）
    single: {
      type: Number,
      value: 10
    },
    // 高度
    h: {
      type: Number,
      value: 40
    },
    scroll: { //是否禁止滚动
      type: Boolean,
      value: true
    },
    direction: { //方向
      type: String,
      value: 'horizontal'
    },
    // 当前选中 
    active: {
      type: null,
      value: '0',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    rul: {},
    styles: {},
    windowHeight: 0,
    //刻度，如果刻度间距scaleGap是1cm,那么offsetMultiple就是10，反之则相反
    scaleGap: 10,
    offsetMultiple: 1,
    val: {},
    isInit: false,
    isHidden: true
  },
  methods: {
    init(opt) {
      const min = opt.min || this.data.min;
      const max = opt.max || this.data.max;
      const unit = opt.unit || this.data.unit;
      let active = opt.active || this.data.active;
      this.data = Object.assign(this.data, opt);

      const grid = (max - min) / this.data.scaleGap;
      const styles = Object.assign(defaultStyles, opt.styles);

      if (active < min || active > max) { //默认数字不合理
        active = (min + max) / 2;
      }

      this.setData({
        min,
        grid,
        unit,
        styles,
        isInit: true,
        isHidden: false,
        val: active
      });
      this.setCenterNum()

      //  获取节点信息，获取节点宽度
      var query = this.createSelectorQuery().in(this)
      query.select('#scale-wrapper').boundingClientRect((res) => {
        res.top // 这个组件内 #the-id 节点的上边界坐标
      }).exec((e) => {
        this.setData({
          windowWidth: e[0].width,
          windowHeight: e[0].height
        })
      })
    },
    setCenterNum() {
      debounce(() => {
        let val = this.data.val
        let min = this.data.min
        // 默认选中值 // 移动diff格
        let diff = (val - min) / this.data.scaleGap;
        const single = this.data.single; //每个小格子长度
        if (diff < 0 || isNaN(diff) || !diff) diff = 0;
        const centerNum = diff * single * 10;

        this.setData({
          centerNum
        });
      }, 200)
    },
    hidden() {
      this.setData({ isHidden: true })
    },
    bindScroll(e) {
      debounce(() => {
        let offset = 0;
        if (this.data.direction == "vertical") {
          offset = e.detail.scrollTop / this.data.offsetMultiple;
        } else {
          offset = e.detail.scrollLeft / this.data.offsetMultiple;
        }

        const min = this.data.min;
        const max = this.data.max;
        const single = this.data.single;

        let val = min + (offset / single);
        // 整数模式
        if (this.data.int) {
          val = Math.floor(val)
        } else {
          val = Math.floor(val * 10) / 10;
        }
        if (val > max)
          val = max
        this.setData({
          val
        })
        // 因为 scroll-view 没有touchend事件，所以这个自动设置刻度位置的功能 很鸡肋
        // this.setCenterNum()
        if (this.data.isOut) {
          this.triggerEvent('val', {
            val: val
          })
        }
      }, 10)
    },
    // 返回当前值
    GetValue() {
      return this.data.val
    }
  }
})