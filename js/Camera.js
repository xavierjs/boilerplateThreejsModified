/*
	Wrapper autour de la caméra three.js
	Pas très utile dans le cas de base, avec une seule caméra,
	mais très util si on instancie plusieurs caméras pour passer de l'une à l'autre !
*/

var Camera=(function(){ //begin closure

	//private variables
	var _threeMainCamera, _DOMcanvas;

	var that={ //public methods
		init: function(spec){
			_DOMcanvas=spec.canvas;

			//create the camera
			_threeMainCamera = new THREE.PerspectiveCamera(35, _DOMcanvas.width / _DOMcanvas.height, 1, 1000 );
			_threeMainCamera.position.set(0,5,20);
		  //Main.add_toggable(_ThreeCameraPosition, 'y', 'cameraPositionY');
		},

		get_position: function(){
			return _threeMainCamera.position;
		},

		update_aspectRatio: function(){ //called when resize window for example
			_threeMainCamera.aspect=_DOMcanvas.width / _DOMcanvas.height;
			_threeMainCamera.updateProjectionMatrix();
		},

		get_renderCamera: function(){ //returns the camera used for the scene render (in Main)
 			return _threeMainCamera;
		},

		update_cinematics: function(){
			//synchronise the camera position with the interactor :
			// --> déménagé dans l'interactor car propre au mode FPS
			/*_threeMainCamera.position.copy(Interactor.get_cameraPosition());

			_threeMainCamera.rotation.set(0,0,0);
			var rotXY=Interactor.get_cameraRotation();
			_threeMainCamera.rotateY(rotXY[1]);
			_threeMainCamera.rotateX(rotXY[0]);*/
		}
	}; //end that

	return that;
})(); //end closure
  
