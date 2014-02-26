window.onload = function(){
    var canvas = document.getElementById("canvas");
    var raster = new engine2D.raster(canvas);
    var p0 = {x:100,y:100};
    var angle = 0;
    var red = {r:255, g:0, b:0};
    setInterval(function(){
	var p1 = {x:(50*Math.sin(angle)+p0.x)|0,
		  y:(50*Math.cos(angle)+p0.y)|0};
	angle += .1;
	raster.clear();
	raster.drawLine(p0,p1,red);
	raster.render();
    }, 30);
};