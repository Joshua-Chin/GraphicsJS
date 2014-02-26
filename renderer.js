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
	    if(0<=point.x<raster.width && 0<=point.y<raster.height){
		buffer32[y*width+x] = colorToInt(color);
	    }
	};

	this.fastDraw = function(x, y, colorInt){
	    if(0<=x<raster.width && 0<=y<raster.height){
		buffer32[y*raster.width+x] = colorInt;
	    }
	}

	this.drawLine = function(p1, p2, color){
	    var colorInt = colorToInt(color);
	    var dx = Math.abs(p1.x-p2.x);
	    var dy = Math.abs(p1.y-p2.y);
	    var sx, sy;
	    if(p2.x > p1.x){sx=1;}else{sx=-1;};
	    if(p2.y > p1.y){sy=1;}else{sy=-1;};
	    var err = dy - dx;
	    var x = p1.x, y = p1.y;
	    while(true){
		if(x==p2.x && y==p2.y){
		    raster.fastDraw(x, y, colorInt);
		    break;
		}
		if(2*err<dy){
		    err += dy;
		    x += sx;
		}
		if(x==p2.x && y==p2.y){
		    raster.fastDraw(x, y, colorInt);
		    break;
		}
		if(2*err>-dx){
		    err -= dx;
		    y += sy;
		}
		raster.fastDraw(x, y, colorInt);
	    }
	};
	
    };

    this.matrix = function(){

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
	this.position = new Array(x,y,z,1);
    };

}();