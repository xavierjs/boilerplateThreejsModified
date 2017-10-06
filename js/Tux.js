var Tux=(function(){

	var _ThreeTuxObject;

	var that={
		init: function(spec){
			var loader = new THREE.ColladaLoader(spec.loadingManager);
			loader.load( 'assets/models3D//tux.dae', function ( collada ) {
			    _ThreeTuxObject = collada.scene;

			    _ThreeTuxObject.scale.x = _ThreeTuxObject.scale.y = _ThreeTuxObject.scale.z = 5;
			    _ThreeTuxObject.position.set(10,1.6,-10);
			    _ThreeTuxObject.children[0].rotateX(-Math.PI/2);

			    window.tux=_ThreeTuxObject;

			    _ThreeTuxObject.updateMatrix();
			    _ThreeTuxObject.children[0].castShadow = true;
			    _ThreeTuxObject.children[0].receiveShadow = false;
			    _ThreeTuxObject.children[0].isTux=true;
			    _ThreeTuxObject.children[0].onPick=that.onPick;
			});
  		}, //end init()

		get_sceneObjects: function(){
			return [_ThreeTuxObject];
		},

		onPick: function(intersection){
			alert('TUX HAS BEEN PICKED !');
		}

	}; //end that
	return that;
})();