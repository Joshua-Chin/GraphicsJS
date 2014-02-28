"use strict";
var engine2D=new function(){
    
    this.raster = function(canvas){

	this.height = canvas.height;
	this.width = canvas.width;
	
	var raster = this;

	var context = canvas.getContext("2d");
	var imageData = context.getImageData(0,0,this.width,this.height);
	
	var buffer = new ArrayBuffer(imageData.data.length);
	var buffer8 = new Uint8ClampedArray(buffer);
	var buffer32 = new Uint32Array(buffer);

	var isBigEndian = function(){
	    var b = new Uint32Array(1);
	    var b8 = new Uint8Array(b.buffer);
	    b[0] = 1;
	    return b8[3] == 1;
	}();
	
	var colorToInt;
	
	if(isBigEndian){
	    colorToInt = function(color){
		if(color.a === undefined){color.a = 255;}
		return color.r <<24 |color.g <<16 | color.b <<8 | color.a;
	    }
	}else{
	    colorToInt = function(color){
		if(color.a === undefined){color.a = 255;}
		return color.a <<24 | color.b <<16 | color.g <<8 | color.r;
	    }
	}

	this.render = function(){
	    imageData.data.set(buffer8);
	    context.putImageData(imageData,0,0);
	};

	this.clear = function(color){
	    if(color===undefined){color=colorToInt({a:255});}
	    for(var i=0;i<buffer32.length;i++){
		buffer32[i]=color;
	    }
	};

	this.draw = function(point, color){
	    raster.fastDraw(point.x, point.y, colorToInt(color));
	};

	this.fastDraw = function(x, y, colorInt){
	    if(0<=x && x<raster.width && 0<=y && y<raster.height){
		buffer32[y*raster.width+x] = colorInt;
	    }
	};

	this.drawLine = function(p1, p2, color){
	    raster.fastDrawLine(p1[0],p1[1], p2[0],p2[1], colorToInt(color));
	};

	this.fastDrawLine = function(x1,y1,x2,y2, colorInt){
	    x1=x1|0,x2=x2|0,y1=y1|0,y2=y2|0,colorInt=colorInt|0;
	    var dx = Math.abs(x1-x2);
	    var dy = Math.abs(y1-y2);
	    var sx, sy;
	    if(x2 > x1){sx=1;}else{sx=-1;};
	    if(y2 > y1){sy=1;}else{sy=-1;};
	    var err = dy - dx;
	    while(true){
		if(x1==x2 && y1==y2){
		    raster.fastDraw(x1, y1, colorInt);
		    break;
		}
		if(2*err<dy){
		    err += dy;
		    x1 += sx;
		}
		if(x1==x2 && y1==y2){
		    raster.fastDraw(x1, y1, colorInt);
		    break;
		}
		if(2*err>-dx){
		    err -= dx;
		    y1 += sy;
		}
		raster.fastDraw(x1, y1, colorInt);
	    }
	};
	
    };

    this.matrix = new function(){
	
	var matrix = this;

	this.ID = [
	    1,0,0,0,
	    0,1,0,0,
	    0,0,1,0,
	    0,0,0,1];

	this.rotationX= function(x){
	    var sin = Math.sin(x), cos = Math.cos(x);
	    return [
		1,  0,   0,0,
		0,cos,-sin,0,
		0,sin, cos,0,
		0,  0,   0,1];
	};

	this.rotationY= function(x){
	    var sin = Math.sin(x), cos = Math.cos(x);
	    return [
		cos,0,-sin,0,
		0,  1,   0,0,
		sin,0, cos,0,
		0,  0,   0,1];
	};

	this.rotationZ= function(x){
	    var sin = Math.sin(x), cos = Math.cos(x);
	    return [
		cos,-sin,0,0,
		sin, cos,0,0,
		0  ,   0,1,0,
		0  ,   0,0,1];
	};

	this.scale = function(x,y,z){
	    return [
		x,0,0,0,
		0,y,0,0,
		0,0,z,0,
		0,0,0,1];
	};

	this.translate = function(x,y,z){
	    return [
		1,0,0,x,
		0,1,0,y,
		0,0,1,z,
		0,0,0,1];
	};

	this.mulMatrix = function(M1, M2){
	    var out = [];
	    for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
		    var sum = 0;
		    for(var k=0;k<4;k++){
			sum += M1[4*i+k] * M2[j+4*k];
		    }
		    out[4*i+j] = sum;
		}
	    }
	    return out;
	};

	this.mulVector = function(M, v){
	    var out = [];
	    for(var i=0;i<4;i++){
		var sum = 0;
		for(var j=0;j<4;j++){
		    sum += M[4*i+j] * v[j];
		}
		out[i] = sum;
	    }
	    return out;
 	};

	this.mulScalar = function(s, M){
	    return M.map(function(x){return s*x;});
	};

    }();

    this.color = function(r,g,b,a){
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;
    };

    this.point = function(x,y,z){
	this.x = x;
	this.y = y;
	this.z = z;
	this.values = new Array(x,y,z,1);
    };

}();