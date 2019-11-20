
var sceneModels = []; // IMPORTANT: global Array containing all Models

class Model {

    constructor() {
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
    toggleRotationXX(){
        this.rotation.XX.on = !this.rotation.XX.on;
    }
    toggleRotationYY(){
        this.rotation.YY.on = !this.rotation.YY.on;
    }
    toggleRotationZZ(){
        this.rotation.ZZ.on = !this.rotation.ZZ.on;
    }

    setScale(x,y,z) { 
        this.scale.x = x;
        this.scale.y = y;
        this.scale.z = z;
    }
    
    setScale(factor) { 
        this.scale.x = this.scale.y = this.scale.z = factor;
    }
    
    // TODO ? not used right now
    getMatrix(mvMatrix){
        var matrix;
        if(!mvMatrix)
            matrix = mat4();
        else
            matrix = mvMatrix;
        // order? where did i get this? is this right?...
        matrix = mult( matrix, translationMatrix( this.translation.x, this.translation.y, this.translation.z ) );
						 
        matrix = mult( matrix, rotationZZMatrix( this.rotation.ZZ.angle ) );
        
        matrix = mult( matrix, rotationYYMatrix( this.rotation.YY.angle ) );
        
        matrix = mult( matrix, rotationXXMatrix( this.rotation.XX.angle ) );
        matrix = mult( matrix, scalingMatrix( this.scale.x, this.scale.y, this.scale.z ) );
    
        // matrix = mult(rotationZZMatrix(this.rotation.ZZ.angle), 
        //                 scalingMatrix(this.scale.x, this.scale.y, this.scale.z));
        // matrix = mult(rotationYYMatrix(this.rotation.YY.angle), mvMatrix);
        // matrix = mult(rotationXXMatrix(this.rotation.XX.angle), mvMatrix);
        // matrix = mult(translationMatrix(this.translation.x, this.translation.y, this.translation.z), mvMatrix);    
        return matrix;
    }
    
    setVertices(array){
        this.vertices = array;
    }

    rotateLocal(elapsedTime){
        if( this.rotation.XX.on )
            this.rotation.XX.angle += this.rotation.XX.dir * this.rotation.XX.speed * (90 * elapsedTime) / 1000.0;
        if( this.rotation.YY.on )
            this.rotation.YY.angle += this.rotation.YY.dir * this.rotation.YY.speed * (90 * elapsedTime) / 1000.0;
        if( this.rotation.ZZ.on )
            this.rotation.ZZ.angle += this.rotation.ZZ.dir * this.rotation.ZZ.speed * (90 * elapsedTime) / 1000.0;
    }
 
  }
  
  class Cube extends Model {
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
