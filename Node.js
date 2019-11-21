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

    print(indent, last)
    {
        var log = indent;
        if (last)
        {
            log += "\\-";
            // console.log("\\-");
            indent += "  ";
        }
        else
        {
            log += "|-";
            // console.log("|-");
            indent += "| ";
        }
        if(this.model){
            log += this.model.toString();
        }
        else
            log += "root";
        //     console.log(this.model.toString());
        // else
        //     console.log("root");
        console.log(log);

        for (var i = 0; i < this.children.length; i++)
            this.children[i].print(indent, i == (this.children.length - 1));
    }
}

var graphnodes = [];
var scenegraph = new GraphNode();
