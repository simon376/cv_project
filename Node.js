// WebGL Scene Graph Node

class GraphNode {
    constructor(model) {
        this.children = [];
        // this.localMatrix = mat4();
        this.globalMatrix = mat4();
        this.model = model;
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
            parent.children.push(this);
        
        this.parent = parent;
    }

    updateGlobalMatrix(parentGlobalMatrix){
        if(parentGlobalMatrix)
            this.globalMatrix = mult(this.model.getMatrix(), parentGlobalMatrix);
        // no matrix was passed in so just copy localMatrix to worldMatrix
        else
            this.globalMatrix = this.model.getMatrix();


        // process children
        var global = this.globalMatrix;
        this.children.forEach(function(child) {
            child.updateGlobalMatrix(global);
        })

    }

    // TODO: print all children
    print(){
        var string = "";
        if(this.children.length > 0){
            for(var i = 0; i < this.children.length; i++){
                string += (this.children[i].print() + "-");
            }
            string += "###";
        }
        if(this.model)
            string += this.model.toString();
        else
            string += "root";
        return string;
    }
}

var graphnodes = [];
var scenegraph = new GraphNode();
