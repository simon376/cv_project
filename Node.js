// WebGL Scene Graph Node

class GraphNode {
    constructor(model) {
        this.children = [];
        // this.localMatrix = mat4();
        this.globalMatrix = mat4();
        this.model = model;
        this.isSelected = false;
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
        else{
            if(this.model)
                this.globalMatrix = this.model.getMatrix();
            else
                this.globalMatrix = mat4();
        }
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

function selectLastNode(){
    if(graphnodes.length > 0){
        if(selectedIndex >= 0)
            graphnodes[selectedIndex].isSelected = false;
        selectedIndex = graphnodes.length-1;
        graphnodes[selectedIndex].isSelected = true;
    }
    else
    selectedIndex = -1;
}

function selectPreviousNode(){
    if(graphnodes.length > 0){
        if(selectedIndex >= 0)
            graphnodes[selectedIndex].isSelected = false;
        if(selectedIndex > 0)
            selectedIndex -= 1;
        else
            selectedIndex = graphnodes.length -1;
        graphnodes[selectedIndex].isSelected = true;
    }
    else
        selectedIndex = -1;
}

function selectNextNode(){
    if(graphnodes.length > 0){
        if(selectedIndex >= 0)
            graphnodes[selectedIndex].isSelected = false;
        if(graphnodes.length - 1 > selectedIndex)
            selectedIndex += 1;
        else
            selectedIndex = 0;
        graphnodes[selectedIndex].isSelected = true;
    }
    else
        selectedIndex = -1;
}

var graphnodes = [];
var selectedIndex = -1;
var scenegraph = new GraphNode();
