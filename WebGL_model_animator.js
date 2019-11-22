//////////////////////////////////////////////////////////////////////////////
//
//  WebGL_model_animator.js 
// 
// Based on WebGL_example_21 from CV practical class
//
//  Animating models with global and local transformations.
//
//  Simon, Mateusz, Dario
//
//////////////////////////////////////////////////////////////////////////////


//----------------------------------------------------------------------------
//
// Global Variables
//

var gl = null; // WebGL context

var shaderProgram = null;

var triangleVertexPositionBuffer = null;
	
var triangleVertexColorBuffer = null;

// The GLOBAL transformation parameters

var globalAngleYY = 0.0;

var globalTz = 0.0;

// The local transformation parameters

// The translation vector

var tx = 0.0;

var ty = 0.0;

var tz = 0.0;

// The rotation angles in degrees

var angleXX = 0.0;

var angleYY = 0.0;

var angleZZ = 0.0;

// The scaling factors

var sx = 0.5;

var sy = 0.5;

var sz = 0.5;

// GLOBAL Animation controls

var globalRotationYY_ON = 1;

var globalRotationYY_DIR = 1;

var globalRotationYY_SPEED = 1;

// Local Animation controls

var rotationXX_ON = 1;

var rotationXX_DIR = 1;

var rotationXX_SPEED = 1;
 
var rotationYY_ON = 1;

var rotationYY_DIR = 1;

var rotationYY_SPEED = 1;
 
var rotationZZ_ON = 1;

var rotationZZ_DIR = 1;

var rotationZZ_SPEED = 1;
 
// To allow choosing the way of drawing the model triangles

var primitiveType = null;
 
// To allow choosing the projection type

var projectionType = 0;
 
// For storing the vertices defining the triangles

var vertices = [

		// FRONT FACE
		 
		-0.25, -0.25,  0.25,
		 
		 0.25, -0.25,  0.25,
		 
		 0.25,  0.25,  0.25,

		 
		 0.25,  0.25,  0.25,
		 
		-0.25,  0.25,  0.25,
		 
		-0.25, -0.25,  0.25,
		
		// TOP FACE
		
		-0.25,  0.25,  0.25,
		 
		 0.25,  0.25,  0.25,
		 
		 0.25,  0.25, -0.25,

		 
		 0.25,  0.25, -0.25,
		 
		-0.25,  0.25, -0.25,
		 
		-0.25,  0.25,  0.25,
		
		// BOTTOM FACE 
		
		-0.25, -0.25, -0.25,
		 
		 0.25, -0.25, -0.25,
		 
		 0.25, -0.25,  0.25,

		 
		 0.25, -0.25,  0.25,
		 
		-0.25, -0.25,  0.25,
		 
		-0.25, -0.25, -0.25,
		
		// LEFT FACE 
		
		-0.25,  0.25,  0.25,
		 
		-0.25, -0.25, -0.25,

		-0.25, -0.25,  0.25,
		 
		 
		-0.25,  0.25,  0.25,
		 
		-0.25,  0.25, -0.25,
		 
		-0.25, -0.25, -0.25,
		
		// RIGHT FACE 
		
		 0.25,  0.25, -0.25,
		 
		 0.25, -0.25,  0.25,

		 0.25, -0.25, -0.25,
		 
		 
		 0.25,  0.25, -0.25,
		 
		 0.25,  0.25,  0.25,
		 
		 0.25, -0.25,  0.25,
		
		// BACK FACE 
		
		-0.25,  0.25, -0.25,
		 
		 0.25, -0.25, -0.25,

		-0.25, -0.25, -0.25,
		 
		 
		-0.25,  0.25, -0.25,
		 
		 0.25,  0.25, -0.25,
		 
		 0.25, -0.25, -0.25,			 
];

// And their colour

var colors = [

		 // FRONT FACE
		 	
		 1.00,  0.00,  0.00,
		 
		 1.00,  0.00,  0.00,
		 
		 1.00,  0.00,  0.00,

		 	
		 1.00,  1.00,  0.00,
		 
		 1.00,  1.00,  0.00,
		 
		 1.00,  1.00,  0.00,
		 			 
		 // TOP FACE
		 	
		 0.00,  0.00,  0.00,
		 
		 0.00,  0.00,  0.00,
		 
		 0.00,  0.00,  0.00,

		 	
		 0.50,  0.50,  0.50,
		 
		 0.50,  0.50,  0.50,
		 
		 0.50,  0.50,  0.50,
		 			 
		 // BOTTOM FACE
		 	
		 0.00,  1.00,  0.00,
		 
		 0.00,  1.00,  0.00,
		 
		 0.00,  1.00,  0.00,

		 	
		 0.00,  1.00,  1.00,
		 
		 0.00,  1.00,  1.00,
		 
		 0.00,  1.00,  1.00,
		 			 
		 // LEFT FACE
		 	
		 0.00,  0.00,  1.00,
		 
		 0.00,  0.00,  1.00,
		 
		 0.00,  0.00,  1.00,

		 	
		 1.00,  0.00,  1.00,
		 
		 1.00,  0.00,  1.00,
		 
		 1.00,  0.00,  1.00,
		 			 
		 // RIGHT FACE
		 	
		 0.25,  0.50,  0.50,
		 
		 0.25,  0.50,  0.50,
		 
		 0.25,  0.50,  0.50,

		 	
		 0.50,  0.25,  0.00,
		 
		 0.50,  0.25,  0.00,
		 
		 0.50,  0.25,  0.00,
		 			 
		 			 
		 // BACK FACE
		 	
		 0.25,  0.00,  0.75,
		 
		 0.25,  0.00,  0.75,
		 
		 0.25,  0.00,  0.75,

		 	
		 0.50,  0.35,  0.35,
		 
		 0.50,  0.35,  0.35,
		 
		 0.50,  0.35,  0.35,			 			 
];

var models = [];

//----------------------------------------------------------------------------
//
// The WebGL code
//

//----------------------------------------------------------------------------
//
//  Rendering
//

// Handling the Vertex and the Color Buffers


function initBuffers(model) {	
	
	// Coordinates
		
	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems = model.vertices.length / 3;			

	// Associating to the vertex shader
	
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
			triangleVertexPositionBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
	
	// Colors
		
	triangleVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	triangleVertexColorBuffer.itemSize = 3;
	triangleVertexColorBuffer.numItems = colors.length / 3;			

	// Associating to the vertex shader
	
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
			triangleVertexColorBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
}

//----------------------------------------------------------------------------

//  Drawing the model

function drawModel( model,
					mvMatrix,
					primitiveType ) {

	// Pay attention to transformation order !!
	var matrix = model.getMatrix(mvMatrix);	// this should add the global mvMatrix and the local transformations.. should..
						 
	// Passing the Model View Matrix to apply the current transformation
	
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(matrix)));
	

	initBuffers(model);


	// Drawing the contents of the vertex buffer
	
	// primitiveType allows drawing as filled triangles / wireframe / vertices
	
	if( primitiveType == gl.LINE_LOOP ) {
		
		// To simulate wireframe drawing!
		
		// No faces are defined! There are no hidden lines!
		
		// Taking the vertices 3 by 3 and drawing a LINE_LOOP
		
		var i;
		
		for( i = 0; i < triangleVertexPositionBuffer.numItems / 3; i++ ) {
		
			gl.drawArrays( primitiveType, 3 * i, 3 ); 
		}
	}	
	else {
				
		gl.drawArrays(primitiveType, 0, triangleVertexPositionBuffer.numItems); 
		
	}	
}

//----------------------------------------------------------------------------

//  Drawing the 3D scene

function drawScene() {
	
	var pMatrix;
	
	var mvMatrix = mat4();
	
	// Clearing the frame-buffer and the depth-buffer
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// Computing the Projection Matrix
	
	if( projectionType == 0 ) {
		
		// For now, the default orthogonal view volume
		// change the view volume perspective matrix
		pMatrix = ortho( -6.0, 6.0, -2.0, 2.0, -1.0, 1.0 );
		
		// Global transformation !!
		
		globalTz = 0;
		
		// TO BE DONE !
		
		// Allow the user to control the size of the view volume
	}
	else {	

		// A standard view volume.
		
		// Viewer is at (0,0,0)
		
		// Ensure that the model is "inside" the view volume
		
		pMatrix = perspective( 45, 1, 0.05, 15 );
		
		// Global transformation !!
		
		globalTz = -2.5;

		// TO BE DONE !
		
		// Allow the user to control the size of the view volume
	}
	
	// Passing the Projection Matrix to apply the current projection
	
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
	
	// GLOBAL TRANSFORMATION FOR THE WHOLE SCENE
	
	mvMatrix = translationMatrix( 0, 0, globalTz );
	
	// here, update the whole scenegraph and apply global transformation matrixes
	scenegraph.updateGlobalMatrix();	

	// use graphnodes-array to make sure everything gets drawn
	graphnodes.forEach(node => {
		if(node.isSelected)
			drawModel(node.model,mvMatrix, gl.LINE_LOOP);
		else
			drawModel(node.model,mvMatrix, primitiveType);
	});
			   
}

//----------------------------------------------------------------------------
//
// Animation
//

// Animation --- Updating transformation parameters

var lastTime = 0;

function animate() {
	
	var timeNow = new Date().getTime();
	
	if( lastTime != 0 ) {
		
		var elapsed = timeNow - lastTime;
		
		// Global rotation
		// TODO: Translation, Scaling

		if( globalRotationYY_ON ) {

			globalAngleYY += globalRotationYY_DIR * globalRotationYY_SPEED * (90 * elapsed) / 1000.0;
	    }

		// Local rotations
		graphnodes.forEach(node => {
			node.model.rotateLocal(elapsed);
		});

	}
	
	lastTime = timeNow;
}


//----------------------------------------------------------------------------

// Timer

function tick() {
	
	requestAnimFrame(tick);
	
	drawScene();
	
	animate();
}




//----------------------------------------------------------------------------
//
//  User Interaction
//

function outputInfos(){
    
}


//----------------------------------------------------------------------------

function setEventListeners(){
	
	// arrow up / down to select node

	document.addEventListener('keydown',  (event) => {
		const keyName = event.key;
	
		if (keyName === 'ArrowUp') {
			selectNextNode();
			// TODO Do stuff
		}
		if (keyName === 'ArrowDown') {
			selectPreviousNode();
		}
	});
	
    // Dropdown list
	
	var projection = document.getElementById("projection-selection");
	projection.addEventListener("click", function(){		
		// Getting the selection
		var p = projection.selectedIndex;		
		switch(p){	
			case 0 : projectionType = 0;
				break;
			case 1 : projectionType = 1;
				break;
		}  	
	});      

	// Dropdown list
	
	var list = document.getElementById("rendering-mode-selection");
	list.addEventListener("click", function(){
		// Getting the selection
		var mode = list.selectedIndex;		
		switch(mode){
			case 0 : primitiveType = gl.TRIANGLES; break;
			case 1 : primitiveType = gl.LINE_LOOP; break;
			case 2 : primitiveType = gl.POINTS; break;
		}
	});      


	// // Button events
	document.getElementById("cube-to-root-button").onclick = function(){
		addModel(new Cube(), scenegraph);
	};

	document.getElementById("cube-to-selected-button").onclick = function(){
		var selected = getSelected();
		if(selected)
			addModel(new Cube(), selected);
		else
			addModel(new Cube(), scenegraph);
	};

	document.getElementById("tetrahedron-to-root-button").onclick = function(){
		addModel(new Tetrahedron(), scenegraph);
	};

	document.getElementById("tetrahedron-to-selected-button").onclick = function(){
		var selected = getSelected();
		if(selected)
			addModel(new Tetrahedron(), selected);
		else
			addModel(new Tetrahedron(), scenegraph);
	};

	

	document.getElementById("reset-button").onclick = function(){
		
		// The initial values

		tx = 0.0;

		ty = 0.0;

		tz = 0.0;

		angleXX = 0.0;

		angleYY = 0.0;

		angleZZ = 0.0;

		sx = 0.5;

		sy = 0.5;

		sz = 0.5;
		
		rotationXX_ON = 0;
		
		rotationXX_DIR = 1;
		
		rotationXX_SPEED = 1;

		rotationYY_ON = 0;
		
		rotationYY_DIR = 1;
		
		rotationYY_SPEED = 1;

		rotationZZ_ON = 0;
		
		rotationZZ_DIR = 1;
		
		rotationZZ_SPEED = 1;
	};      

	document.getElementById("face-culling-button").onclick = function(){
		
		if( gl.isEnabled( gl.CULL_FACE ) )
		{
			gl.disable( gl.CULL_FACE );
		}
		else
		{
			gl.enable( gl.CULL_FACE );
		}
	};      

	document.getElementById("depth-test-button").onclick = function(){
		
		if( gl.isEnabled( gl.DEPTH_TEST ) )
		{
			gl.disable( gl.DEPTH_TEST );
		}
		else
		{
			gl.enable( gl.DEPTH_TEST );
		}
	};
	
	//	Translation
	document.getElementById("t_submit").onclick = function(){
		
		var o_x = document.getElementById("t_orig_x").value;
		var o_y = document.getElementById("t_orig_y").value;
		var o_z = document.getElementById("t_orig_z").value;
		var d_x = document.getElementById("t_dest_x").value;
		var d_y = document.getElementById("t_dest_y").value;
		var d_z = document.getElementById("t_dest_z").value;
		var logmsg = "translation from: (" + o_x + "|" + o_y + "|" + o_z
						+ ") to (" + d_x + "|" + d_y + "|" + d_z + ")";
		console.log(logmsg);
		var node = graphnodes.pop();
		node.model.setTranslation(d_x,d_y,d_z);
		graphnodes.push(node);

	};      

	//	Rotation
	document.getElementById("r_submit").onclick = function(){		
		var x_a = document.getElementById("xx_angle").value;
		var x_s = document.getElementById("xx_speed").value;
		var x_d = document.getElementById("xx_dir").value;
		var y_a = document.getElementById("yy_angle").value;
		var y_s = document.getElementById("yy_speed").value;
		var y_d = document.getElementById("yy_dir").value;
		var z_a = document.getElementById("zz_angle").value;
		var z_s = document.getElementById("zz_speed").value;
		var z_d = document.getElementById("zz_dir").value;
		// var logmsg = "rotation in deg: (" + r_x + "|" + r_y + "|" + r_z + ")";
		// console.log(logmsg);
		var node = graphnodes.pop();
		// TODO: fix
		// node.model.setRotationXX(0,0,0)
		// node.model.setRotationYY(0,0,0)
		// node.model.setRotationZZ(0,0,0)
		node.model.setRotationXX(x_a,x_s,x_d)
		// node.model.setRotationYY(y_a,y_s,y_d)
		// node.model.setRotationZZ(z_a,z_s,z_d)
		graphnodes.push(node);
	};   
	
	// TODO fix rotation
		// rotation direction
	var direction = document.getElementById("direction-selection");
	direction.addEventListener("click", function(){
		// Getting the selection
		var p = direction.selectedIndex;
				// TODO: change rotation direction of last selected node	
		switch(p){
			case 0 : 
				break;
			
			case 1 : 
				break;
		}  	
	});  
	var rotation = document.getElementById("transformation-selection");
	rotation.addEventListener("click", function(){
		// Getting the selection
		var p = rotation.selectedIndex;	
		// TODO: change global or local matrix of last selected node
		switch(p){
			case 0 : 
				break;
			case 1 : 
				break;
		}  	
	});  
	

}

function addModel(model, parent){
    var x = Math.random()*10-5;
    var y = Math.random()*2-1; 
    var z = 0; 
    var scale = Math.random();
    model.setTranslation(x,y,z);
    model.setScale(factor=scale);
    model.setRotationXX(0.0,1.0,1);
    model.setRotationYY(0.0,1.0,-1);
    model.setRotationZZ(0.0,1.0,1);
    model.toggleRotationXX();
    model.toggleRotationYY();
    model.toggleRotationZZ();

    var n = new GraphNode(model);
    n.setParent(parent);
    graphnodes.push(n);
    selectLastNode();	

    scenegraph.print("", true);
}

// not used rn
/// Deprecated
function readFile(){
		
	var file = this.files[0];
	
	var reader = new FileReader();
	
	reader.onload = function( progressEvent ){
		
		// Entire file read as a string
		
		// The tokens/values in the file

		// Separation between values is 1 or mode whitespaces

		var tokens = this.result.split(/\s\s*/);

		// Array of values; each value is a string
		
		var numVertices = parseInt( tokens[0] );
		
		// For every vertex we have 6 floating point values
		
		var i, j;
		
		var aux = 1;
		
		var newVertices = [];
		
		var newColors = []
		
		for( i = 0; i < numVertices; i++ ) {
		
			for( j = 0; j < 3; j++ ) {
				
				newVertices[ 3 * i + j ] = parseFloat( tokens[ aux++ ] );
			}
			
			for( j = 0; j < 3; j++ ) {
				
				newColors[ 3 * i + j ] = parseFloat( tokens[ aux++ ] );
			}
		}
				
		// Assigning to the current model
		// TODO: append instead of replace
		
		// vertices.push(newVertices);
		// colors.push(newColors);
		// vertices.concat(newVertices.slice());
		// colors.concat(newColors.slice());
		vertices = newVertices.slice();
		
		colors = newColors.slice();
		
		// Rendering the model just read
	
		initBuffers();

		// RESET the transformations - NEED AUXILIARY FUNCTION !!
		
		tx = ty = tz = 0.0;
					
		angleXX = angleYY = angleZZ = 0.0;
		
		sx = sy = sz = 0.5;
	};
	
	// Entire file read as a string
		
	reader.readAsText( file );		
}
//----------------------------------------------------------------------------
//
// WebGL Initialization
//

function initWebGL( canvas ) {
	try {
		
		// Create the WebGL context
		
		// Some browsers still need "experimental-webgl"
		
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		
		// DEFAULT: The viewport occupies the whole canvas 
		
		// DEFAULT: The viewport background color is WHITE
		
		// Drawing the triangles defining the model
		
		primitiveType = gl.TRIANGLES;
		
		// DEFAULT: Face culling is DISABLED
		
		// Enable FACE CULLING
		
		gl.enable( gl.CULL_FACE );
		
		// DEFAULT: The BACK FACE is culled!!
		
		// The next instruction is not needed...
		
		gl.cullFace( gl.BACK );
        
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}        
}

//----------------------------------------------------------------------------

function runWebGL() {
	
	var canvas = document.getElementById("my-canvas");
	
	initWebGL( canvas );

	shaderProgram = initShaders( gl );
	
	setEventListeners(canvas);

	
	tick();		// A timer controls the rendering / animation    

	outputInfos();
}




