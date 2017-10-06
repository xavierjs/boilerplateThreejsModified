/*
	Instancie les lumières de la scene

*/

var Lights=(function(){

	//private variables
	var _ThreeSpotLight, _ThreeAmbientLight;
	var _spotLightX=0, _spotLightZ=0, _spotLightTheta=0;

	var that={
		init: function(){
			//the spot
		 	_ThreeSpotLight= new THREE.SpotLight( 0xffffff );
		  	Main.add_toggable(_ThreeSpotLight, 'intensity', 'spotLightIntensity'); // equivalent of _ThreeSpotLight.intensity=TOGGABLESETTINGS.spotLightIntensity.val; but will update on toggableSettings change
		  	_ThreeSpotLight.position.set( 0,10,5 );
		  	_ThreeSpotLight.castShadow = true;

		  	_ThreeSpotLight.shadow.mapSize.width = 512;
		  	_ThreeSpotLight.shadow.mapSize.width.height = 512;

		  	_ThreeSpotLight.shadow.camera.near = 5;
		  	_ThreeSpotLight.shadow.camera.far = 20;
		  	_ThreeSpotLight.shadow.camera.fov = 60;

		  
		 	//the ambient light <-- DO NOT FORGET IT WITH THREE.JS !!!
		  	_ThreeAmbientLight = new THREE.AmbientLight(0xffaa33);
		  	_ThreeAmbientLight.intensity=1;
		}, //end init()

		update_cinematics: function(){ //called at each Main.update_cinematics iteration.
			_spotLightTheta+=0.1;
		    _spotLightX=5*Math.cos(_spotLightTheta);
		    _spotLightZ=5*Math.sin(_spotLightTheta);
		    _ThreeSpotLight.position.set(_spotLightX,10,_spotLightZ);
		},

		get_sceneObjects: function(){ //return stuffs to add to the scene
			return [_ThreeAmbientLight, _ThreeSpotLight];
		}

	}; //end that

	return that;
})();
