let superstar={
    name:'吴亦凡',
    playad(){
        console.log('锤镇牛奶，真的好喝')
    },
    scheduleFlag:false
}

let proxy={
    name:'都敏俊经理',
    scheduleTime(){
        const  schedule=new Proxy(superstar,{
            set(target, p, value, receiver) {
                if(p!=='scheduleFlag'){
                    return
                }else {
                    if(target.scheduleFlag===false&&value===true){
                        target.p=true
                        target.playad()
                    }
                }
            }
        })

        setTimeout(()=>{
            schedule.scheduleFlag=true
        },2000)
    },
    accept(reward){
        if(reward<1000){
            console.log('滚')
        }else {
           this.scheduleTime()

        }
    }
}
let buyer=proxy.accept(10000)
