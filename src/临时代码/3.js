let  arr_binary_tree=require('./arr_binary_tree')

let root = [3,5,1,6,2,0,8,null,null,7,4]
 k = 3
root=arr_binary_tree(root)



function  preorder(root){
    let stack=[]
    let res=[]
    stack.push(root)
    while (stack.length){
        let peek=stack.pop()
        res.push(peek.val)

        if(peek.right){
            stack.push(peek.right)
        }
        if(peek.left){
            stack.push(peek.left)
        }
    }
    return res
}
preorder(root)

function lastorder(root){
    let stack=[]
    let res=[]
    stack.push(root)
    while (stack.length){
        let peek=stack.pop()
        res.push(peek.val)
        if(peek.left){
            stack.push(peek.left)
        }
        if(peek.right){
            stack.push(peek.right)
        }
    }
    return res.reverse()
}
lastorder(root)
inorderTraversal(root)
function inorderTraversal (root) {
    const res = [], stack = []
    while(root || stack.length) {
        // 中序遍历，首先迭代左孩子，左孩子依次入栈
        if(root.left) {
            stack.push(root)
            root = root.left
            // 如果左孩子为空了，输出节点，去右孩子中迭代，
        } else if(root.right) {
            res.push(root.val)
            root = root.right
            // 如果左右孩子都为空了，输出当前节点，栈顶元素出栈，也就是回退到上一层，此时置空节点左孩子，防止while循环重复进入
        } else if(!root.left && !root.right) {
            res.push(root.val)
            root = stack.pop()
            root && (root.left = null)
        }
    }
    return res
};

  //      5
  //  3 6   null  null
  // 1
function kthSmallest(root,k){
    let num=Infinity
    function  find(root,nth){
        if(!root){
            return
        }
        if(nth===k){
            console.log(root.val)
            num=root.val
            return
        }
        if(nth>k){
            return;
        }
        if(root.left){
            find(root.left,++nth)
        }

        if(root.right){
            find(root.right,++nth)
        }
    }
    find(root,0)
    return num
}
kthSmallest(root,k)

