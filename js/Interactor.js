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
  	//var _ThreeCameraPosition;
  	var _position_initial, _transitionCoeff;
  	var _isDrag=false;
  	var _oldX, _oldY, _dX=0, _dY=0; //rotation variables

  	var _states={
  		FPS: 0,
  		orbital: 1,
  		transition: 2,
  		splineMove: 3,
  		blocked: 4
  	};
  	var _state=_states.FPS;
  	var _spline, _stateRestored;

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


	function compute_orbitalPosition(camera){
		var centreOrbite=new THREE.Vector3(0,0,0);

		var zCamera=new THREE.Vector3(0,0,1); //vecteur Z (arrière) dans referentiel caméra
		zCamera.applyQuaternion(camera.quaternion); //vecteur Z dans référentiel scene/world
		zCamera.multiplyScalar(50); //rayon de l'orbite
		return zCamera.add(centreOrbite);
	}
	
	var that={
		init: function(spec){

		  _DOMcanvas=spec.canvas;

		  //instantiate Three.JS stuffs :
		  //_ThreeCameraPosition=new THREE.Vector3(0,5,20);
		  //Main.add_toggable(_ThreeCameraPosition, 'y', 'cameraPositionY');
		  
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
			var camera=Camera.get_renderCamera(); //instance de THREE.Camera
				    
			switch(_state){
				case _states.FPS:
					var cos=Math.cos(_rotY);
				    var sin=Math.sin(_rotY);

				    camera.position.x+=_speedX*cos+_speedZ*sin;
				    camera.position.z+=_speedX*-sin+_speedZ*cos;
				    
				    _rotY-=_dX*SETTINGS.mouseSensibilityX;
				    _rotX-=_dY*SETTINGS.mouseSensibilityY;

				    if (!_isDrag) { //rotation movement amortization
				      _dX*=0.9, _dY*=0.9;
				    }

				    camera.rotation.set(0,0,0);
					camera.rotateY(_rotY);
					camera.rotateX(_rotX);
				    break;

				case _states.orbital:
					//rotate la caméra (rotation)
					camera.rotation.set(0,0,0);
					_rotY-=_dX*SETTINGS.mouseSensibilityX;
				    _rotX-=_dY*SETTINGS.mouseSensibilityY;
				    camera.rotateY(_rotY);
					camera.rotateX(_rotX);

					//recule la caméra (position) 
					var position_orbital=compute_orbitalPosition(camera);
					camera.position.copy(position_orbital);

					//debugger;

					break;

				case _states.transition: //transition FPS -> Orbital
					var position_orbital=compute_orbitalPosition(camera);
					_transitionCoeff+=0.01; //0-> debut de la transition, 1-> fin de la transition

					if (_transitionCoeff>=1){ //transition is over
						console.log('TRANSITION IS OVER');
						_transitionCoeff=1;
						_state=_states.orbital;
					}

					//interpolation linéaire entre les positions initiales et finales
					camera.position.copy(_position_initial.clone().multiplyScalar(1-_transitionCoeff));
					camera.position.add(position_orbital.multiplyScalar(_transitionCoeff));
					break;

				case _states.splineMove:
					//le coeff de transition va de 0 (premier point de la spline à 1 -> le dernier)
					_transitionCoeff+=0.01; //ou on en est sur la spline ?
					if (_transitionCoeff>=1){ //transition is over
						console.log('SPLINE DISPLACEMENT');
						_transitionCoeff=1;
						_state=_states.blocked;
					}

					//_spline
					//debugger;
					camera.position.copy(_spline.getPointAt(_transitionCoeff));
					var cameraDirection=_spline.getTangentAt(_transitionCoeff);
					camera.lookAt(cameraDirection);

					break;

			} //end switch
		},

		switch_orbital: function(isOrbital){ //directly called from the DOM button
			_position_initial=Camera.get_renderCamera().position.clone(); //position au début du déplacement
			_transitionCoeff=0;
			_state=(isOrbital)?_states.transition:_states.FPS;
		},

		start_splineMovement: function(){
			_stateRestored=_state;
			_state=_states.splineMove;

			var cam=Camera.get_renderCamera();
			var points=[
				cam.position,
				cam.position.clone().add(new THREE.Vector3(0,10,0)),
				cam.position.clone().add(new THREE.Vector3(0, 0,10)),
				cam.position.clone().add(new THREE.Vector3(20, 1,10))
			];

			_spline=new THREE.CatmullRomCurve3(points); //Spline
			_transitionCoeff=0;
			debugger;
		}

	}; //end that

	return that;
})();
 
