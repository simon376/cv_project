// WebGL Scene Graph Node

class Node {
    constructor() {
        this.children = [];
        this.localMatrix = mat4();
        this.globalMatrix = mat4();
    }

    setParent(parent){
        //remove existing parent
        if(this.parent){
            var index = this.parent.children.indexOf(this);
            if(index >= 0)
                this.parent.children.splice(index,1);
        }

        // add this node as a child to new parent
        if(parent)
            parent.children.append(this);
        
        this.parent = parent;
    }

    updateGlobalMatrix(parentGlobalMatrix){
        if(parentGlobalMatrix)
            this.globalMatrix = mult(this.localMatrix, parentGlobalMatrix);
        // no matrix was passed in so just copy localMatrix to worldMatrix
        else
            this.globalMatrix = this.localMatrix;


        // process children
        var global = this.globalMatrix;
        this.children.forEach(function(child) {
            child.updateGlobalMatrix(global);
        })

    }
}