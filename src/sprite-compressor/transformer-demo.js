let read_css = require("./css_reader")
let string = read_css('./man-swing.css')
for(let n of string){
    if(n=='\n'){
        console.log("yes")
    }
}
// let reg_frame = /([\d.]*% {\n\t\tbackground-position: .*;\n\t)}/g
// // 匹配每一帧
//
// let num_frames=string.match(reg_frame)
// // // 匹配的帧数
// console.log(num_frames)