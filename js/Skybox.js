var Skybox=(function(){

	var _mesh;
	

	var that={
		init: function(spec){
			var materials = [];
			for ( var i = 0; i < 6; i ++ ) {
				var textureURL='assets/skybox/'
				+['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg'][ i ];
				var texture=new THREE.TextureLoader(spec.loadingManager).load(textureURL);
				materials.push( new THREE.MeshBasicMaterial( {
					map: texture,
					side: THREE.DoubleSide
				} ) );

			}

			_mesh = new THREE.Mesh( new THREE.CubeGeometry( 200, 200, 200 ), materials );
  		}, //end init()

		get_sceneObjects: function(){
			return [_mesh];
		},

		update_cinematics: function(threeCenter){
			_mesh.position.copy(threeCenter);
		}

	}; //end that
	return that;
})(); 
