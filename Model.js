
var sceneModels = []; // IMPORTANT: global Array containing all Models

class Model {

    constructor() {
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
        this.scale = {x: 1, y: 1, z: 1};
     } // todo: interface  / abstract class ?
    
    setTranslation(x,y,z) { 
        this.translation.x = x;
        this.translation.y = y;
        this.translation.z = z;
    }
    get rotationXX() { return this.rotation.XX; }
    get rotationYY() { return this.rotation.YY; }
    get rotationZZ() { return this.rotation.ZZ; }
    
    setRotationXX(angle, speed, dir) { 
        this.rotation.XX.angle = angle;
        this.rotation.XX.speed = speed;
        this.rotation.XX.dir = dir;
    }
    setRotationYY(angle, speed, dir) { 
        this.rotation.YY.angle = angle;
        this.rotation.YY.speed = speed;
        this.rotation.YY.dir = dir;
    }
    setRotationZZ(angle, speed, dir) { 
        this.rotation.ZZ.angle = angle;
        this.rotation.ZZ.speed = speed;
        this.rotation.ZZ.dir = dir;
    }

    setScale(x,y,z) { 
        this.scale.x = x;
        this.scale.y = y;
        this.scale.z = z;
    }
    
    setScale(factor) { 
        this.scale.x = this.scale.y = this.scale.z = factor;
    }
    
    // TODO ? vorerst nicht verwendet
    get matrix(){
        // Reihenfolge ?? woher hab ich das? ist das richtig?...
        var mvMatrix = mult(rotationZZMatrix(this.rotation.ZZ.angle), 
                        scalingMatrix(this.scale.x, this.scale.y, this.scale.z));
        mvMatrix = mult(rotationYYMatrix(this.rotation.YY.angle), mvMatrix);
        mvMatrix = mult(rotationXXMatrix(this.rotation.XX.angle), mvMatrix);
        mvMatrix = mult(translationMatrix(this.translation.x, this.translation.y, this.translation.z), mvMatrix);    
        return mvMatrix;
    }
    
    setVertices(array){
        this.vertices = array;
    }
 
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

// Model 0 --- Top Left

// var c = new Cube();
// c.setTranslation(-0.5, 0.5, 0);
// c.setScale(0.5,0.5,0.5);
// sceneModels.push(c);
// sceneModels.push(new Tetrahedron());
// sceneModels[1].setScale(factor=0.25);
