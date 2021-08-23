let demo={
    a:1,
    b:2
}
let a= new Proxy(demo,{
    set(target, p, value, receiver) {},
    get(target, p, receiver) {
        console.log(receiver)
    }
})
console.log(a.a )
