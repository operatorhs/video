const COM = {
  // 获取dom元素
  getElement: (elObj) =>{
    let index = elObj.index || 0
    if(elObj.id) {
      return document.getElementById(elObj.id)
    } else if (elObj.el) {
      return document.getElementsByTagName(elObj.el)[index]
    } else if (elObj.class) {
      return document.getElementsByClassName(elObj.class)[index]
    }
  },
  // 绑定时间
  addEvent: (el, type, handle, blo) => {
    blo = blo || false
    if (el.addEventListener) {
      el.addEventListener(type, handle, blo)
    } else if (el.attachEvent) {
      el.attachEvent('on' + type, handle)
    } else {
      el['on' + type] = handle
    }
  },
  // ajax
  ajaxQuest: (data, callback) => {
    let xhr = new XMLHttpRequest()
      data.type = data.type || 'get'
      xhr.open(data.type, `http://www.operatorhs.com/${data.url}`, true)
      xhr.send()
      xhr.onreadystatechange = () => {
        if (xhr.readyState==4 && xhr.status==200) {
          let res = xhr.responseText
          callback && callback(res)
        } else {
        }
     }
  }
}
