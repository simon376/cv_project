
var sceneModels = []; // IMPORTANT: global Array containing all Models

class Model {

    constructor() {
        this.primitiveType = 0;
        //this.mvMatrix; // TODO = ?
        this.vertices = [];
        this.normals = []; // TODO: will be added later for illumination computation
    

        this.translation = {x: 0, y: 0, z: 0};

        this.rotation = {
            XX: {
                on: false,
                angle: 0,
                speed: 0,
                dir: 0
            },
            YY: {
                on: false,
                angle: 0,
                speed: 0,
                dir: 0
            },
            ZZ: {
                on: false,
                angle: 0,
                speed: 0,
                dir: 0
            }};
        this.scale = {x: 0, y: 0, z: 0};
     } // todo: interface  / abstract class ?
    
    get primType() { return this.primitiveType;}
    set primType(x) { this.primitiveType = x;}

    get translation() { return this.translation; }
    set translation(x,y,z) { 
        this.translation.x = x;
        this.translation.y = y;
        this.translation.z = z;
    }
    get rotation() { return this.rotation; }
    get rotationXX() { return this.rotation.XX; }
    get rotationYY() { return this.rotation.YY; }
    get rotationZZ() { return this.rotation.ZZ; }
    set rotationXX(angle, speed, dir) { 
        this.rotation.XX.angle = angle;
        this.rotation.XX.speed = speed;
        this.rotation.XX.dir = dir;
    }
    set rotationYY(angle, speed, dir) { 
        this.rotation.YY.angle = angle;
        this.rotation.YY.speed = speed;
        this.rotation.YY.dir = dir;
    }
    set rotationZZ(angle, speed, dir) { 
        this.rotation.ZZ.angle = angle;
        this.rotation.ZZ.speed = speed;
        this.rotation.ZZ.dir = dir;
    }
    get scale() { return this.scale; }
    set scale(x,y,z) { 
        this.scale.x = x;
        this.scale.y = y;
        this.scale.z = z;
    }
    
    // TODO ?
    get matrix(){
        var mvMatrix = mult(rotationZZMatrix(this.rotation.z), 
                        scalingMatrix(this.scale.x, this.scale.y, this.scale.z));
        mvMatrix = mult(rotationYYMatrix(this.rotation.y), mvMatrix);
        mvMatrix = mult(rotationXXMatrix(this.rotation.x), mvMatrix);
        mvMatrix = mult(translationMatrix(this.translation.x, this.translation.y, this.translation.z), mvMatrix);    
        return mvMatrix;
    }

    get vertices(){ return this.vertices; }
    set vertices(x){ this.vertices = x; }

 
  }
  
  class Cube extends Model {
      //TODO 
      // is it even necessary?
      // just construct a model with a predefined vertex array
      constructor(){
          super();
          super.vertices = [

            -1.000000, -1.000000,  1.000000, 
             1.000000,  1.000000,  1.000000, 
            -1.000000,  1.000000,  1.000000, 
            -1.000000, -1.000000,  1.000000,
             1.000000, -1.000000,  1.000000, 
             1.000000,  1.000000,  1.000000, 
             1.000000, -1.000000,  1.000000, 
             1.000000, -1.000000, -1.000000, 
             1.000000,  1.000000, -1.000000, 
             1.000000, -1.000000,  1.000000, 
             1.000000,  1.000000, -1.000000, 
             1.000000,  1.000000,  1.000000, 
            -1.000000, -1.000000, -1.000000, 
            -1.000000,  1.000000, -1.000000,
             1.000000,  1.000000, -1.000000, 
            -1.000000, -1.000000, -1.000000, 
             1.000000,  1.000000, -1.000000, 
             1.000000, -1.000000, -1.000000, 
            -1.000000, -1.000000, -1.000000, 
            -1.000000, -1.000000,  1.000000, 
            -1.000000,  1.000000, -1.000000, 
            -1.000000, -1.000000,  1.000000, 
            -1.000000,  1.000000,  1.000000, 
            -1.000000,  1.000000, -1.000000, 
            -1.000000,  1.000000, -1.000000, 
            -1.000000,  1.000000,  1.000000, 
             1.000000,  1.000000, -1.000000, 
            -1.000000,  1.000000,  1.000000, 
             1.000000,  1.000000,  1.000000, 
             1.000000,  1.000000, -1.000000, 
            -1.000000, -1.000000,  1.000000, 
            -1.000000, -1.000000, -1.000000,
             1.000000, -1.000000, -1.000000, 
            -1.000000, -1.000000,  1.000000, 
             1.000000, -1.000000, -1.000000, 
             1.000000, -1.000000,  1.000000, 	 
        ];
        }
  }

  class Tetrahedron extends Model {
    constructor(){
        super();
        super.vertices = [
            -1.000000,  0.000000, -0.707000, 
            0.000000,  1.000000,  0.707000, 
            1.000000,  0.000000, -0.707000, 
            1.000000,  0.000000, -0.707000, 
            0.000000,  1.000000,  0.707000, 
            0.000000, -1.000000,  0.707000, 
           -1.000000,  0.000000, -0.707000, 
            0.000000, -1.000000,  0.707000, 
            0.000000,  1.000000,  0.707000, 
           -1.000000,  0.000000, -0.707000, 
            1.000000,  0.000000, -0.707000, 
            0.000000, -1.000000,  0.707000,
      ];
    }
}

// IMPORTANT - add Models to global Array


//----------------------------------------------------------------------------
//
//  Instantiating scene models
//

var sceneModels = [];

// Model 0 --- Top Left

var c = new Cube();
c.primitiveType
sceneModels.push(new Cube() );
sceneModels.push(new Tetrahedron());
sceneModels.push( new singleTriangleModel() );

sceneModels[0].tx = -0.5; sceneModels[0].ty = 0.5;

sceneModels[0].sx = sceneModels[0].sy = sceneModels[0].sz = 0.5;
