 module.exports= function arr_binary_tree(arr) {
    function TreeNode(val, left, right) {
        this.val = (val === undefined ? 0 : val)
        this.left = (left === undefined ? null : left)
        this.right = (right === undefined ? null : right)
    }
    let nodeList=arr.map((item)=>{
        return  item===null?null: new TreeNode(item)
    })

    console.log(nodeList)
    for(let i=0;i<nodeList.length;i++){
        if(2*i+1<nodeList.length){
            nodeList[i].left=nodeList[2*i+1]
        }
        if(2*i+2<nodeList.length){
            nodeList[i].right=nodeList[2*i+2]
        }
    }
    return nodeList[0]
}


