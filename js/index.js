function Play(video) {
  this.video = video || COM.getElement({el: 'video'})
  this.isShowProblime = true
}
// 初始化播放器
Play.prototype.init = function() {
  let mask = COM.getElement({class: 'mask'})
  mask.style.display = 'block'
  COM.addEvent(this.video, 'canplay', () => {
    this.timer((totalTimer, currentTime) => {
      COM.getElement({class: 'line-timer'}).innerHTML = formatTime(totalTimer)
    })
    mask.style.display = 'none'
  }, false)
}
// 控制播放
Play.prototype.controlPlay = function() {
  this.video.play()
}
// // 点击进度条
// Play.prototype.clickProgress = function() {

// }
// 点击选择题目
Play.prototype.selectproblem = function(target) {
  let lis = target.parentElement.children,
    len = lis.length
  for(let i = 0; i < len; i++) {
    lis[i].style.color = 'rgba(0,0,0,.7)'
  }
  target.style.color = '#007aff'
  COM.getElement({class: 'problime-box'}).style.display = 'none'
  if(target.getAttribute('data-isRight')  === 'true') {
    this.video.play()
    COM.getElement({class: 'is-play'}).setAttribute('class', 'is-play fa fa-pause')
    this.isShowProblime = false
  } else {
    
  }
}
// 时间显示
Play.prototype.timer = function(callback) {
  let totalTimer = this.video.duration,
    currentTime = this.video.currentTime
    callback && callback(totalTimer, currentTime)

    if (currentTime >= 5 && this.isShowProblime) {
      COM.getElement({class: 'problime-box'}).style.display = 'block'
      COM.getElement({class: 'is-play'}).setAttribute('class', 'is-play fa fa-play-circle ')
      this.video.pause()
      this.video.currentTime = 4
    }
}

var formatTime = function (time) {
  var h = Math.floor(time / 3600);
  var m = Math.floor(time % 3600 / 60);
  var s = Math.floor(time % 60);
  return (h<10?'0'+h:h)+':'+(m<10?'0'+m:m)+':'+(s<10?'0'+s:s)
}
let video = COM.getElement({id: 'video'}),
  play = new Play(video)
play.init()

COM.addEvent(COM.getElement({class: 'is-play'}), 'click', function(){
  if(this.getAttribute('class').indexOf('fa-play-circle') !== -1) {
    this.setAttribute('class', 'is-play fa fa-pause')
    play.controlPlay()
  } else {
    this.setAttribute('class', 'is-play fa fa-play-circle ')
    video.pause()
  }
}, false)

// 监听当前播放进度
COM.addEvent(COM.getElement({id: 'video'}), 'timeupdate', () => {
  play.timer((totalTimer, currentTime) => {
    let p = (this.video.currentTime / this.video.duration * 100).toFixed(2) + '%'
    COM.getElement({class: 'curren-timer'}).innerHTML = formatTime(currentTime)
    COM.getElement({class: 'current-progress'}).style.width = p
  })
  // 播放结束 初始化状态
  if(video.ended) {
    video.currentTime = 0
    video.pause()
    COM.getElement({class: 'is-play'}).setAttribute('class', 'is-play fa fa-play-circle ')
  }
}, false)

COM.addEvent(COM.getElement({class: 'line-progress'}), 'click', function(e) {
  let offsetX = e.offsetX,
    w = parseInt(window.getComputedStyle(this, null)['width'])
    play.timer((totalTimer, currentTime) => {
      video.currentTime = offsetX / w * totalTimer
    })
}, false)

// 渲染题目
COM.ajaxQuest({type: 'get', url: 'blem'}, res => {
  res = JSON.parse(res).message[0]
  let str = '',
    html = ''
  res.answer.forEach(item => {
    str += `<li class="select-item" data-isRight=${item.isRight}>
    ${item.name}.&nbsp;&nbsp;${item.answer}

  </li>`
  })
  html = `
    <h3 class="stem">${res.problem}</h3>
    <ul>
      ${str}
    </ul>
    `
  COM.getElement({class: 'problime'}).innerHTML = html
})

COM.addEvent(COM.getElement({class: 'problime'}), 'click', (e) => {
  let event = e || window.event,
    target = event.target || event.srcElement
    play.selectproblem(target)
}, false)

COM.addEvent(COM.getElement({class: 'problime-box'}), 'click', function(){
  this.style.display = 'none'
})








