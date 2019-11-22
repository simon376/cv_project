// WebGL Scene Graph Node

class GraphNode {
    constructor(model) {
        this.children = [];
        // this.localMatrix = mat4();
        this.globalMatrix = mat4();
        if(model)
            this.model = model;
        else
            this.model = new Model();
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
        var m;
        if(this.model)
            var m = this.model.getMatrix();
        if(!m)
            m = mat4();

        if(parentGlobalMatrix)
            this.globalMatrix = mult(parentGlobalMatrix, m);
        // no matrix was passed in so just copy localMatrix to worldMatrix
        else
            this.globalMatrix = m;
        
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

function getSelected(){
    if(selectedIndex >= 0){
        if(graphnodes.length > 0){
            return graphnodes[selectedIndex];
        }    
    }
    return null;
}

var graphnodes = [];
var selectedIndex = -1;
var scenegraph = new GraphNode();

// for testing

var sunNode = new GraphNode(new Cube());
var t = new Tetrahedron();
// t.setTranslation(2,0,0);    //2 away from sun
t.setScale(0.75);
// t.setRotationZZ(0,0.5,1);   // this should only be local..
// t.toggleRotationZZ();
var earthNode = new GraphNode(t);

var t2 = new Tetrahedron();
// t2.setTranslation(1,0,0);   // 1 away from earth
t2.setScale(0.5);
// t2.setRotationZZ(0,1,-1);
// t2.toggleRotationZZ();
var moonNode = new GraphNode(t2);

var solarSystemNode = new GraphNode();
solarSystemNode.model.setRotationZZ(0,0.25,-1);
solarSystemNode.model.toggleRotationZZ();


var earthOrbitNode = new GraphNode();
earthOrbitNode.model.setTranslation(2,0,0);
earthOrbitNode.model.setRotationZZ(0,0.25,-1);
earthOrbitNode.model.toggleRotationZZ();

var moonOrbitNode = new GraphNode();
moonOrbitNode.model.setTranslation(1,0,0);

solarSystemNode.setParent(scenegraph);
sunNode.setParent(solarSystemNode);
earthOrbitNode.setParent(solarSystemNode);
moonOrbitNode.setParent(earthOrbitNode);
earthNode.setParent(earthOrbitNode);
moonNode.setParent(moonOrbitNode);
graphnodes.push(solarSystemNode);
graphnodes.push(earthOrbitNode);
graphnodes.push(sunNode);
graphnodes.push(earthNode);
graphnodes.push(moonNode);
graphnodes.push(moonOrbitNode);

