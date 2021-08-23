function unCurrying(fn){
    return function (ctx,...args){
        fn.apply(ctx,args)
    }
}



var push = unCurrying(Array.prototype.push)

function execPush() {
    push(arguments, 4,5)
    console.log(arguments)
}

execPush(1, 2, 3)    //
