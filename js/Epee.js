var Epee=(function(){

	var _mesh, _action;
	var _speed={
		speedVal: 0.016
	};

	var that={
		init: function(spec){
			var loader = new THREE.JSONLoader(spec.loadingManager);
			loader.load( "assets/models3D/knight.js", function ( geometry, materials ) {
				_mesh = new THREE.SkinnedMesh( geometry, materials );
				_mesh.onPick=that.onPick;

				for ( var i = 0; i < materials.length; i ++ ) {
					var m = materials[ i ];
					m.skinning = true;
					m.morphTargets = true;
				}

				var fragmentShaderSource=THREE.ShaderLib.phong.fragmentShader;
				fragmentShaderSource=fragmentShaderSource.replace("void", "uniform float ttime; varying float vPy; void");
				var endShader="float dy=pow(max(0.,cos(5.*vPy-ttime*0.02)), 10.);\n\
				gl_FragColor=mix(gl_FragColor, gl_FragColor*vec4(0.,1.,0.,1.), dy);\
				}\n";
				fragmentShaderSource=fragmentShaderSource.replace("}\n", endShader);

				var vertexShaderSource=THREE.ShaderLib.phong.vertexShader;
				vertexShaderSource=vertexShaderSource.replace("void", "varying float vPy; void");
				endShader="float py=worldPosition.y;\n\
				vPy=py;\
				}\n";
				vertexShaderSource=vertexShaderSource.replace("}\n", endShader);


				//debugger;
				var myshadermaterial=new THREE.ShaderMaterial({
					uniforms: Object.assign(THREE.ShaderLib.phong.uniforms, {ttime:{value: 1}}),
					vertexShader: vertexShaderSource,
                	fragmentShader: fragmentShaderSource,
                	morphTargets: true,
                	skinning: true,
                	lights:true,
                	transparent: true
				});
				window.mat=myshadermaterial;
				window.me=_mesh;
				//myshadermaterial.skinning=true;
				//myshadermaterial.morphTargets=true;
				materials[0]=myshadermaterial;


				var mixer = new THREE.AnimationMixer( _mesh );
				var bonesClip = geometry.animations[0];
				
				
				_action = mixer.clipAction( bonesClip, _mesh );

				//stop after 1 play, and in last keyframe (not rest position) :
				_action.loop=THREE.LoopOnce;
				_action.clampWhenFinished=true;

				//start in first keyframe (not rest position)
				_action.play();
				_action.paused=true;
				
				Main.add_toggable(_speed, 'speedVal', 'speedValSettings');
				
				var t0=Date.now();
				var a=true;

				setInterval(function(){
					mixer.update( _speed.speedVal );
					myshadermaterial.uniforms.ttime.value=Date.now()-t0;
					myshadermaterial.needsUpdate=true;

					window.ac=_action;
						
					if (_action.time > 1.3 && a){

						a=false;
						Main.start_particles();
					}
				}, 16);
			} );
  		}, //end init()

		get_sceneObjects: function(){
			return [_mesh];
		},

		onPick: function(intersection){
			_action.reset ();
			_action.play();
		}

	}; //end that
	return that;
})(); 
