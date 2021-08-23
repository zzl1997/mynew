function memorize(fn){
    let cache={}
    return function (args){
        if(args+"" in cache){
            return cache[args]
        }
        else {
            let res=fn.call(null,args)
            cache[args]=res

        }
    }
}







/* 复杂计算函数 */
function add(a) {
    return a + 1
}

const adder = memorize(add)

adder(1)            // 输出: 2    当前: cache: { '[1]': 2 }
adder(1)            // 输出: 2    当前: cache: { '[1]': 2 }
adder(2)            // 输出: 3    当前: cache: { '[1]': 2, '[2]': 3 }
