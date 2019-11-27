// WebGL Scene Graph Node

class GraphNode {
    constructor(model) {
        this.children = [];
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
            indent += "  ";
        }
        else
        {
            log += "|-";
            indent += "| ";
        }
        if(this.model){
            log += this.model.toString();
        }
        else
            log += "root";
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

// --       Rotation Test   "Solar System"

var sunNode = new GraphNode(new Cube());
var t = new Tetrahedron();
t.setScale(0.75);
var earthNode = new GraphNode(t);

var t2 = new Tetrahedron();
t2.setScale(0.5);
var moonNode = new GraphNode(t2);

var solarSystemNode = new GraphNode();
solarSystemNode.model.setRotationZZ(0,0.25,-1);
solarSystemNode.model.toggleRotationZZ();


var earthOrbitNode = new GraphNode();
earthOrbitNode.model.setTranslationOrigin(2,0,0);
earthOrbitNode.model.setRotationZZ(0,0.5,-1);
earthOrbitNode.model.toggleRotationZZ();

var moonOrbitNode = new GraphNode();
moonOrbitNode.model.setTranslationOrigin(1,0,0);

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

//  ---     Translation Test

// var transTest = new GraphNode(new Cube());
// transTest.model.setTranslationDestination(1,1,0);
// transTest.model.translation.speed = 0.01;
// transTest.model.toggleTranslationAnimation();
// transTest.model.setRotationYY(0,0.5,1);
// transTest.model.toggleRotationYY();
// transTest.model.setRotationXX(0,0.5,1);
// transTest.model.toggleRotationXX();
// transTest.setParent(scenegraph);
// graphnodes.push(transTest);
