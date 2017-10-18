var Planet=(function(){

	var _ThreePlanetObject;

	var that={
		init: function(spec){
			var objLoader = new THREE.OBJLoader(spec.loadingManager);
			var mtlLoader = new THREE.MTLLoader(spec.loadingManager);


			mtlLoader.load( 'assets/models3D/planet/new-planet.mtl', function( materials ) {
				materials.preload();
				objLoader.setMaterials( materials );
				objLoader.load( 'assets/models3D/planet/new-planet.obj', function ( stuff ) {
				    //debugger;
				    _ThreePlanetObject=stuff.children[0];
				    //window.zou=_ThreePlanetObject;
				    _ThreePlanetObject.position.set(-10,3,0); //put it on the left

				    //WE ADD THE TEXTURE
				    var texture=new THREE.TextureLoader(spec.loadingManager).load('assets/textures/debug.jpg');
				    _ThreePlanetObject.material.map=texture;

				});
			});


			
  		}, //end init()

		get_sceneObjects: function(){
			return [_ThreePlanetObject];
		}

	}; //end that
	return that;
})();