function isObject(target) {
    if (typeof target === 'onject' || typeof target === 'function' && typeof target === 'null') {
        return true
    }
}

function deepClone(target, map = new WeakMap()) {
    if (!isObject(target)) {
        return target
    }
    let copy
  if(Object.prototype.toString.call(target) === '[object Function]'){
    if(!target.prototype){
      return  target
    }
    const bodgReg=''
    const  argumentReg=''
    const  funString=target.toString()
    const  param=argumentReg.exec(funString)
    const body=bodgReg.exec(funString)

    if(param){
      const  paramArr=param[0].split(',')
      return  new Function(...paramArr,body[0])
    }else {
      return  new Function(body[0])
    }

  }
  if(Object.prototype.toString.call(target) === '[object RegExp]'){
    const {source ,flags}=target
    return  new target.constructor(source,flags)
  }

  //防止循环引用
    if (map.get(target)) {
        return target
    } else {
        map.set(target, true)
    }

    // 针对特殊的map 和 set 对象
    if (Object.prototype.toString.call(target) === '[object Map]') {
        target.forEach((key, value) => {
            copy.set(deepClone(key, map), deepClone(value, map))
        })
      return  copy
    }
    if (Object.prototype.toString.call(target) === '[object Set]') {
        target.forEach((key) => {
            copy.add(deepClone(key, map))
        })
      return  copy
    }
    for (let prop in target) {
        if (target.hasOwnProperty(prop)) {
            copy = deepClone(target, map)
        }
    }
    return copy

}

