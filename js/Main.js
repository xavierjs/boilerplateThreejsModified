/*
Logique de la scene, ici on met tout ce qui ne va pas dans des classes tierces
*/
var Main=(function(){ //closure

	//private variables (bcoz in the closure). they are prefixed with _
	var _DOMcanvas; //HTML5 Canvas element which is in the DOM (Document Object Model), ie included in the HTML page
	var _ThreeRenderer, _ThreeScene, _ThreeLoadingManager, _ThreePickables=[];
	var _DatGUI, _toggableSettings={};

	//private functions
	function size_canvas(){
		_DOMcanvas.width=window.innerWidth;
		_DOMcanvas.height=window.innerHeight;
		Camera.update_aspectRatio();
		_ThreeRenderer.setSize(_DOMcanvas.width, _DOMcanvas.height);
	};
	function update_cinematics(){ //cinematic loop
		Lights.update_cinematics();
		Interactor.update_cinematics();
		Camera.update_cinematics();
		Particules.update_cinematics();
		Skybox.update_cinematics(Camera.get_position());
	};
	function animate() { //drawing loop
    	_ThreeRenderer.render(  _ThreeScene, Camera.get_renderCamera() );
    	requestAnimationFrame( animate );
  	};
  	function start() {
  		setInterval(update_cinematics, 16); //16 ms -> 60FPS
  		animate();
  	};


	var that={
		main: function(){ //launched by body.onload
			//inialize the DAT.GUI controler :
			_DatGUI = new dat.GUI();

			Object.keys(TOGGABLESETTINGS).forEach(function(toggableSettingKey){
				_toggableSettings[toggableSettingKey]=TOGGABLESETTINGS[toggableSettingKey].val;
				var controller = _DatGUI.add(_toggableSettings, toggableSettingKey, TOGGABLESETTINGS[toggableSettingKey].min, TOGGABLESETTINGS[toggableSettingKey].max);
				controller.onChange(function(newValue){
					if (TOGGABLESETTINGS[toggableSettingKey].objectToChange){
						TOGGABLESETTINGS[toggableSettingKey].objectToChange[TOGGABLESETTINGS[toggableSettingKey].attributeToChange]=newValue;
					}
				}) //end controller.onChange
			}) //end loop on toggable settings
			
			//get the canvas from the DOM
			_DOMcanvas = document.getElementById("your_canvas");
			
		    _ThreeRenderer=new THREE.WebGLRenderer({
		     antialias  : true,
		     canvas : _DOMcanvas
		    });
		    _ThreeRenderer.shadowMap.enabled = true;
		  	_ThreeRenderer.shadowMap.type = THREE.PCFShadowMap;

		  	//creating the loading manager
		  	//useful to launch the rendering loop only when all stuffs are loaded
		  	_ThreeLoadingManager = new THREE.LoadingManager();
		  	_ThreeLoadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {
				console.log( 'INFO in Main.main() : Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
			};
			_ThreeLoadingManager.onError = function (url) {
				console.log('ERROR in Main : _ThreeLoadingManager - url =', url);
			}

		  	//create the scene
  			_ThreeScene = new THREE.Scene();

			//init stuffs
			Lights.init();
			Camera.init({
				canvas: _DOMcanvas
			});
			Interactor.init({
				canvas: _DOMcanvas
			});
			Ground.init();
			Tux.init({
				loadingManager: _ThreeLoadingManager
			});
			Epee.init({
				loadingManager: _ThreeLoadingManager
			});
			Skybox.init({
				loadingManager: _ThreeLoadingManager
			});
			
			
			//auto resize canvas if window size change
		  	window.onresize=size_canvas;
		  	size_canvas();

			//add stuffs to the scene when all is loaded
			_ThreeLoadingManager.onLoad = function ( ) {
				console.log('INFO in Main.main() : all stuffs are loaded. Cool.');

				//all drawed objects :
				var allThreeObjects=Lights.get_sceneObjects()
									.concat(Ground.get_sceneObjects())
									.concat(Tux.get_sceneObjects(), Epee.get_sceneObjects(), Skybox.get_sceneObjects());
				_ThreeScene.add.apply(_ThreeScene, allThreeObjects);

				//objects which are pickables :
				_ThreePickables=_ThreePickables.concat(Tux.get_sceneObjects(), Epee.get_sceneObjects());

				start();
			};

		}, //end main()

		start_particles: function(){
			Particules.init();
			_ThreeScene.add.apply(_ThreeScene, Particules.get_sceneObjects());
		},

		add_toggable: function(toggleObject, toggleAttribute, toggleKey){
			toggleObject[toggleAttribute]=TOGGABLESETTINGS[toggleKey].val;
			TOGGABLESETTINGS[toggleKey].objectToChange=toggleObject;
			TOGGABLESETTINGS[toggleKey].attributeToChange=toggleAttribute;
		},

		get_pickables: function(){
			return _ThreePickables;
		}

	}; //end that

	return that;
})(); //end closure
