function  CarBuilder({color='white',weight=0}){
    this.color=color
    this.weight=weight
}
// 生产部件，轮胎
CarBuilder.prototype.buildTyre = function(type) {
    switch (type) {
        case 'small':
            this.tyreType = '小号轮胎'
            this.tyreIntro = '正在使用小号轮胎'
            break
        case 'normal':
            this.tyreType = '中号轮胎'
            this.tyreIntro = '正在使用中号轮胎'
            break
        case 'big':
            this.tyreType = '大号轮胎'
            this.tyreIntro = '正在使用大号轮胎'
            break
    }
}

// 生产部件，发动机
CarBuilder.prototype.buildEngine = function(type) {
    switch (type) {
        case 'small':
            this.engineType = '小马力发动机'
            this.engineIntro = '正在使用小马力发动机'
            break
        case 'normal':
            this.engineType = '中马力发动机'
            this.engineIntro = '正在使用中马力发动机'
            break
        case 'big':
            this.engineType = '大马力发动机'
            this.engineIntro = '正在使用大马力发动机'
            break
    }
}

function benchiDirector(param,tyre,engine){
    let car=new CarBuilder(param)
    car.buildEngine(engine)
    car.buildTyre(tyre)
    return car
}

let benchi=new benchiDirector({ color: 'red', weight: '1600kg' },tyre='small',engine='small')
console.log()


