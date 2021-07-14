let  fs=require("fs")
module.exports=function (path){
   return (fs.readFileSync(path,'utf-8'))
}
