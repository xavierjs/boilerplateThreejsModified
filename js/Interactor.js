/*
	Capture les évènements (souris, clavier) et agit en conséquence
*/

var Interactor=(function(){

	//private variables
	var _speedX=0, _speedZ=0; //camera speed
	var _rotX=0; //camera rotation up/down
	var _rotY=0; //camera rotation left/right
  	var _DOMcanvas;
  	var _ThreeViewportVector, _ThreeDirectionVector, _ThreeRaycaster; //picking variables
  	var _ThreeCameraPosition;
  	var _isDrag=false;
  	var _oldX, _oldY, _dX=0, _dY=0; //rotation variables

	//private functions
	function keyUpDown(keycode, sensibility) {
	    switch(keycode) {

	      case 37: //left arrow
	        _speedX=-1*sensibility;
	        break;

	      case 39: //right arrow
	        _speedX=1*sensibility;
	        break;

	      case 38: //up arrow
	        _speedZ=-1*sensibility;
	        break;

	      case 40: //down arrow
	        _speedZ=1*sensibility;
	        break;

	    } //end switch keycode
	}; //end keyUpDown()
	
	var that={
		init: function(spec){

		  _DOMcanvas=spec.canvas;

		  //instantiate Three.JS stuffs :
		  _ThreeCameraPosition=new THREE.Vector3(0,5,20);
		  Main.add_toggable(_ThreeCameraPosition, 'y', 'cameraPositionY');
		  _ThreeDirectionVector=new THREE.Vector3();
		  //_ThreeProjector = new THREE.Projector();
  		  _ThreeRaycaster = new THREE.Raycaster();


		  //catch keyboard events
		  window.onkeydown=function(event){
		    keyUpDown(event.keyCode, 0.1);
		  };
		  window.onkeyup=function(event){
		    keyUpDown(event.keyCode, 0);
		  };


		  //catch mouse events
		  _ThreeViewportVector=new THREE.Vector3();
		  _DOMcanvas.onmousedown=function(event) {
		  	//picking :
		    var x=2*event.clientX/_DOMcanvas.width-1; //between -1 (left) and 1 (right)  -> viewport horizontal coordinates
		    var y=-(2*event.clientY/_DOMcanvas.height-1); //between -1 (bottom) and 1 (top)

		    _ThreeViewportVector.set(x, y, 1);

		    _ThreeDirectionVector.copy(_ThreeViewportVector);
		    _ThreeDirectionVector.unproject(Camera.get_renderCamera());
		    //_ThreeDirectionVector is not a vector, but the targeted point which is in the camera Zfar plane.

		    //to get the real pointer direction, we must substract the camera position
		    _ThreeDirectionVector.sub(Camera.get_renderCamera().position);

		    //We normalize it
		    _ThreeDirectionVector.normalize();

		    //We give to the raycaster all information about the ray (origin, direction)
		    _ThreeRaycaster.set(Camera.get_renderCamera().position, _ThreeDirectionVector);

		    //Ask the raycaster for intersects with all objects in the scene:
		    // (The second arguments means "recursive")
		    var intersects = _ThreeRaycaster.intersectObjects(Main.get_pickables(), true);
		    if (intersects.length) { //some objects are picked
		    	var nearestIntersection = intersects[0];

		    	if (nearestIntersection.object.onPick){
		    		nearestIntersection.object.onPick(nearestIntersection);

		    		return;
		    	}
		    }

		    //end picking, stuffs for camera rotation :
		    _isDrag=true;
		    _oldX=event.clientX;
		    _oldY=event.clientY;
		  }; //end _DOMcanvas.onmousedown()

		  _DOMcanvas.onmouseup=function() {
		    _isDrag=false;
		  };

		  _DOMcanvas.onmousemove=function(event) {
		    if (!_isDrag) return false;

		    _dX=event.clientX-_oldX;
		    _dY=event.clientY-_oldY;

		    _oldX=event.clientX,
		    _oldY=event.clientY;
		  };

		}, //end init()

		update_cinematics: function(){
			var cos=Math.cos(_rotY);
		    var sin=Math.sin(_rotY);

		    _ThreeCameraPosition.x+=_speedX*cos+_speedZ*sin;
		    _ThreeCameraPosition.z+=_speedX*-sin+_speedZ*cos;
		    
		    _rotY-=_dX*SETTINGS.mouseSensibilityX;
		    _rotX-=_dY*SETTINGS.mouseSensibilityY;

		    if (!_isDrag) { //rotation movement amortization
		      _dX*=0.9, _dY*=0.9;
		    }
		},

		get_cameraPosition: function(){
			return _ThreeCameraPosition;
		},

		get_cameraRotation: function(){
			return [_rotX, _rotY];
		}

	}; //end that

	return that;
})();
 
