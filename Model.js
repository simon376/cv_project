class Model {

    constructor(primitiveType) {
        this.primitiveType = primitiveType;
        //this.mvMatrix; // TODO = ?
        this.translation = {x: 0, y: 0, z: 0};
        this.rotation = {x: 0, y: 0, z: 0, dir: 0};
        this.scale = {x: 0, y: 0, z: 0};
        this.vertices = [];
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
    set rotation(x,y,z) { 
        this.rotation.x = x;
        this.rotation.y = y;
        this.rotation.z = z;
    }
    get scale() { return this.scale; }
    set scale(x,y,z) { 
        this.scale.x = x;
        this.scale.y = y;
        this.scale.z = z;
    }
    
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
  }