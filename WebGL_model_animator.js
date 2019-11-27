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

var globalTz = 0.0;

 
// To allow choosing the way of drawing the model triangles

var primitiveType = null;
 
// To allow choosing the projection type

var projectionType = 0;
 
// storing their colours

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

function drawModel( node,
					mvMatrix,
					primitiveType ) {

	var localMatrix = node.model.getMatrix(mvMatrix);
	var matrix = mult( node.globalMatrix, localMatrix ); 
							 
	// Passing the Model View Matrix to apply the current transformation
	
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(matrix)));
	
	if(!node.model)
		return;					
	initBuffers(node.model);


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
		pMatrix = ortho( -6.0, 6.0, -2.0, 2.0, -2.0, 15.0 );
		
		// Global transformation !!
		
		globalTz = 0;		
	}
	else {	

		// A standard view volume.
		
		// Viewer is at (0,0,0)
		
		// Ensure that the model is "inside" the view volume
		
		pMatrix = perspective( 45, 3, 0.05, 15 );
		
		// Global transformation !!
		
		globalTz = -2.5;
	}
	
	// Passing the Projection Matrix to apply the current projection
	
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
	
	// GLOBAL TRANSFORMATION FOR THE WHOLE SCENE
	
	mvMatrix = translationMatrix( 0, 0, globalTz );
	
	// here, update the whole scenegraph and apply global transformation matrixes
	scenegraph.updateGlobalMatrix(mvMatrix);	

	// use graphnodes-array to draw everything
	graphnodes.forEach(node => {
		if(node.isSelected)
			drawModel(node,mvMatrix, gl.LINE_LOOP);
		else
			drawModel(node,mvMatrix, primitiveType);
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
		

		// update local transformations 
		graphnodes.forEach(node => {
			node.model.rotate(elapsed);
			node.model.translate(elapsed);
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
	
	// arrow left / right to select node

	document.addEventListener('keydown',  (event) => {
		const keyName = event.key;
	
		if (keyName === 'ArrowRight') {
			selectNextNode();
		}
		if (keyName === 'ArrowLeft') {
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
	document.getElementById("node-to-root-button").onclick = function(){
		addModel(new Model(), scenegraph);
	};

	document.getElementById("node-to-selected-button").onclick = function(){
		var selected = getSelected();
		if(selected)
			addModel(new Model(), selected);
		else
			addModel(new Model(), scenegraph);
	};

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
		
		var o_x = parseFloat(document.getElementById("t_orig_x").value);
		var o_y = parseFloat(document.getElementById("t_orig_y").value);
		var o_z = parseFloat(document.getElementById("t_orig_z").value);
		var d_x = parseFloat(document.getElementById("t_dest_x").value);
		var d_y = parseFloat(document.getElementById("t_dest_y").value);
		var d_z = parseFloat(document.getElementById("t_dest_z").value);
		var logmsg = "translation from: (" + o_x + "|" + o_y + "|" + o_z
						+ ") to (" + d_x + "|" + d_y + "|" + d_z + ")";
		var selectedNode = getSelected();
		if(selectedNode){
			selectedNode.model.setTranslationOrigin(o_x,o_y,o_z);
			selectedNode.model.setTranslationDestination(d_x,d_y,d_z);
			selectedNode.model.toggleTranslationAnimation(true);
		}

		console.log(logmsg);
	};      

	//	Rotation
	document.getElementById("r_submit").onclick = function(){		
		var x_a = parseFloat(document.getElementById("xx_angle").value);
		var x_s = parseFloat(document.getElementById("xx_speed").value);
		var x_d = parseFloat(document.getElementById("xx_dir").value);
		var y_a = parseFloat(document.getElementById("yy_angle").value);
		var y_s = parseFloat(document.getElementById("yy_speed").value);
		var y_d = parseFloat(document.getElementById("yy_dir").value);
		var z_a = parseFloat(document.getElementById("zz_angle").value);
		var z_s = parseFloat(document.getElementById("zz_speed").value);
		var z_d = parseFloat(document.getElementById("zz_dir").value);
		var logmsg = "rotation XX (" + x_a + "|" + x_s + "|" + x_d + ")" + 
					"YY (" + y_a + "|" + y_s + "|" + y_d + ")" + 
					"ZZ (" + x_a + "|" + x_s + "|" + x_d + ")";

		var selectedNode = getSelected();
		if(selectedNode){
			selectedNode.model.setRotationXX(x_a,x_s,x_d)
			selectedNode.model.setRotationYY(y_a,y_s,y_d)
			selectedNode.model.setRotationZZ(z_a,z_s,z_d)
			selectedNode.model.toggleRotationXX(true);
			selectedNode.model.toggleRotationYY(true);
			selectedNode.model.toggleRotationZZ(true);
		}

		console.log(logmsg);
	};   
	

	//Scaling
	document.getElementById("sc_submit").onclick = function () {
		var factor = parseFloat(document.getElementById("scaling").value);
		var selectedNode = getSelected();
		if(selectedNode){
			selectedNode.model.setScale(factor);
		}


	};
	

}

function addModel(model, parent){
    var x = Math.random()*10-5;
    var y = Math.random()*2-1; 
    var z = 0; 
    var scale = Math.random();
    model.setTranslationOrigin(x,y,z);
    model.setScale(factor=scale);

    var n = new GraphNode(model);
    n.setParent(parent);
    graphnodes.push(n);

    scenegraph.print("", true);
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




