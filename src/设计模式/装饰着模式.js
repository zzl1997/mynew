function originDecorateFn(originObejct,type,fn){

    originObejct[type]=function (){
        let origin =originObejct[type]
        return function (){
            origin&&origin()
            fn()
        }
    }
}





global.onload = function() {
    console.log('原先的 onload 事件 ')
}

/* 发送埋点信息 */
function sendUserOperation() {
    console.log('埋点：用户当前行为路径为 ...')
}
originDecorateFn(global, 'onload', sendUserOperation)
