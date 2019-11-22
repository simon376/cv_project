

// TODO: add ModelFactory for easy setup
class Model {

    constructor() {
        this.vertices = [];
        this.normals = []; // TODO: will be added later for illumination computation
    
        this.translation = {
            origin: {
                x: 0,
                y: 0,
                z: 0
            },
            current: {
                x: 0,
                y: 0,
                z: 0
            },
            destination: {
                x: 0,
                y: 0,
                z: 0
            },
            speed: 1,
            direction: 1,
            enabled: false
        }
        this.rotation = {
            XX: {
                on: false,
                angle: 0,
                speed: 1,
                dir: 1
            },
            YY: {
                on: false,
                angle: 0,
                speed: 1,
                dir: 1
            },
            ZZ: {
                on: false,
                angle: 0,
                speed: 1,
                dir: 1
            }};
        this.scale = {x: 1, y: 1, z: 1};
     } 
    
    toString(){ return "Model";} 

    setTranslationDestination(x,y,z) { 
        this.translation.destination.x = x;
        this.translation.destination.y = y;
        this.translation.destination.z = z;
    }
    setTranslationOrigin(x,y,z) { 
        this.translation.origin.x = this.translation.current.x =  x;
        this.translation.origin.y = this.translation.current.y = y;
        this.translation.origin.z = this.translation.current.z = z;
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
    
    getMatrix(mvMatrix){
        var matrix;
        if(!mvMatrix)
            matrix = mat4();
        else
            matrix = mvMatrix;
        
        // TRS

        matrix = mult( matrix, translationMatrix( this.translation.current.x, this.translation.current.y, this.translation.current.z ) );
						 
        matrix = mult( matrix, rotationZZMatrix( this.rotation.ZZ.angle ) );
        
        matrix = mult( matrix, rotationYYMatrix( this.rotation.YY.angle ) );
        
        matrix = mult( matrix, rotationXXMatrix( this.rotation.XX.angle ) );
        matrix = mult( matrix, scalingMatrix( this.scale.x, this.scale.y, this.scale.z ) );

        return matrix;
    }
    
    setVertices(array){
        this.vertices = array;
    }

    rotate(elapsedTime){
        if( this.rotation.XX.on )
            this.rotation.XX.angle += this.rotation.XX.dir * this.rotation.XX.speed * (90 * elapsedTime) / 1000.0;
        if( this.rotation.YY.on )
            this.rotation.YY.angle += this.rotation.YY.dir * this.rotation.YY.speed * (90 * elapsedTime) / 1000.0;
        if( this.rotation.ZZ.on )
            this.rotation.ZZ.angle += this.rotation.ZZ.dir * this.rotation.ZZ.speed * (90 * elapsedTime) / 1000.0;
    }

    toggleTranslationAnimation() { this.translation.enabled = !this.translation.enabled; }
    
    translate(elapsedTime){
        var x_dir, y_dir, z_dir;
        x_dir = y_dir = z_dir = 1;
        var error = 0.01;
        if(this.translation.enabled){
            // if destination was reached, turn back
            if( Math.abs(this.translation.destination.x - this.translation.current.x) < error && 
                Math.abs(this.translation.destination.y - this.translation.current.y) < error && 
                Math.abs(this.translation.destination.z - this.translation.current.z) < error )
                {
                    var dest = this.translation.destination;
                    this.translation.destination = this.translation.origin;
                    this.translation.origin = dest;
                }

            (this.translation.destination.x - this.translation.current.x)>0 ? x_dir = 1 : x_dir = -1;
            (this.translation.destination.y - this.translation.current.y)>0 ? y_dir = 1 : y_dir = -1;
            (this.translation.destination.z - this.translation.current.z)>0 ? z_dir = 1 : z_dir = -1;
    
            this.translation.current.x += x_dir * this.translation.speed * (90 * elapsedTime) / 1000.0; 
            this.translation.current.y += y_dir * this.translation.speed * (90 * elapsedTime) / 1000.0; 
            this.translation.current.z += z_dir * this.translation.speed * (90 * elapsedTime) / 1000.0;     
        }

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
        toString(){ return "Cube";} 

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
    toString(){ return "Tetrahedron";} 

}
