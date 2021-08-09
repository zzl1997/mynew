function jsonStringify(obj) {
  let type = typeof obj
  if (type !== 'object') {
    if (/string|undefined|function/.test(type)) {
      obj = '"' + obj + '"'
    }
    return String(obj)
  } else {
    let json = []
    let arr = Array.isArray(obj)
    for (let k in obj) {
      let v = obj[k]
      let type = typeof v
      if (/string|undefined|function/.test(type)) {
        v = '"' + v + '"'
      } else if (type === 'object') {
        v = jsonStringify(v)
      }
      json.push((arr ? '' : '"' + k + '":') + String(v))
    }
    return (arr ? '[' : '{') + String(json) + (arr ? ']' : '}')
  }
}

let a = jsonStringify('1')

Object.prototype.gender = '女'
let person = {
  name: 'tebu',
  age: 12,
}
for (var key in person) {
  if (person.hasOwnProperty(key)) {
    console.log(key, person[key])
  }
}
function myStringfy(data) {
  // 字符串 >>> 自己
  // 数字 >>> 自己
  // undefined >>> 自己 （外面不加引号）
  // null >>> 自己
  // function >>> undefined （外面不加引号）
  // 数组 >>> 用逗号分隔 如果某项为undefined 该项处记录为null
  // 对象 >>> key 用双引号包起来, 各属性逗号分隔 筛选掉undefined
  const myStringfyFunc = data => {
    if (data === null || data === undefined || typeof data === 'string' || typeof data === 'number') {
      return data
    } else if (typeof data === 'function') {
      return undefined
    } else if (typeof data === 'object') {
      if (Array.isArray(data)) {
        // 数组
        return `[${data
          .map(item => {
            if (myStringfyFunc(item) === undefined || item === null) return 'null'
            else return myStringfyFunc(item)
          })
          .join(',')}]`
      } else {
        // 对象
        let arr = []
        for (let key in data) {
          if (myStringfyFunc(data[key]) !== undefined) {
            arr.push(`"${key}":${myStringfyFunc(data[key])}`)
          }
        }
        return `{${arr.join(',')}}`
      }
    } else {
      return new Exception('UNKNOWN TYPE!')
    }
  }

  if (data === undefined || typeof data === 'function') {
    return myStringfyFunc(data)
  } else if (typeof data === 'string') {
    return `"${myStringfyFunc(data)}"`
  } else {
    return `${myStringfyFunc(data)}`
  }
}
function test(data) {
  const res1 = JSON.stringify(data)
  const res2 = myStringfy(data)
  return {
    passed: res1 === res2, // 对于多层嵌套的引用类型无法正确判断
    input: data,
    correct: res1,
    yours: res2,
  }
}
console.log(test())
console.log(test(''))
console.log(test('123'))
console.log(test(0))
console.log(test(1111))
console.log(test({ a: 111, b: null, c: undefined, d: function() {} }))
console.log(test([1, 2, null, undefined, function() {}]))
console.log(test(null))
console.log(test(undefined))

let c = 'chao'
console.log(`  ${c}`)
