# Boilerplate projets THREEJS

## Présentation
Afin de démarrer rapidement les projets, et pour garder une homogénéité dans l'architecture des projets, voici une boilerplate THREE.JS. Elle contient déjà quelques lumières, une caméra qui fixe un objet 3D ainsi que des intéractions basiques. Elle est basée sur le résultat du [Tuto WebGLAcademy n°25: Three.JS picking](http://www.webglacademy.com/courses.php?courses=19|27|25#25). Par rapport aux TD, les changements suivant ont été effectués :

* Quelques petits changements liés au passage de Three.JS version 67 à Three.JS version 87,
* Passage d'un code linéaire à un code modulaire,
* Respect de convention de nommage et de patterns plus stricts.


## Architecture
* *assets* : les assets
  * *assets/models3D* : modèles 3D (modèles + textures ou fichiers annexes composant les modèles)
  * *assets/textures* : images utilisées pour générer des textures
* *css* : les feuilles de style CSS
* *dev* : development bundle -> mettre ici tous les fichiers inutiles pour le rendu final
* *js* : les scripts javascript
  * *js/libs* : les librairies javascript externes
* *index.html* : index du projet. N'oubliez pas d'inclure tous vos scripts ici
* *settings.js* : groupe les settings de l'application dans un fichier global, afin de ne pas avoir à sauter d'une classe à l'autre pour changer l'apparence


## Pattern javascript
Les classes sont écrites sous une forme particulière :
```javascript
var MaClasse=(function(){ //fonction auto-appelée

	var _truc = 'machin'; //c'est une variable privée

	function fonctionPrivee(){
		//c'est une fonction privée, inaccessible de l'exterieur de ma classe
	}

	var that={
		//methodes statiques publiques
		//accessibles via MaClasse.maMethode

		//that n'a que des fonction en attributs
		//(on ne fait jamais that.truc=_truc par exemple)
		get_truc: function(){
			return _truc; 
		}
	};
	return that;
})()
```


## Conventions de nommage
Pour un maximum de clarté, nous adopterons les conventions de nommage suivantes :
* Les classes sont en minuscules et commencent par une majuscule. Exemple : `Interactor`,
* Une classe, un fichier : on ne met pas plusieurs classes dans un même fichier javascript, ou on ne rajoute pas des attributs/méthodes à une classe ou à une instance de classe dans un autre fichier que le sien,
* Les variables globales sont toutes en majuscules. Exemple : `SETTINGS`,
* Les fonctions s'écrivent `verbe_groupeNominal`. Exemple : `compute_vectorParticulier`,
* Les variables internes à une classe sont prefixées par _ . Exemple : `_variablePrivee`,
* Les messages loggués dans la console sont au format suivant : `INFO/WARNING/ERROR in MaClasse.MaFonction : Chose qui ne va pas, variable1 = valeur1, variable2 = valeur2`,
* Les variables correspondant à des instances d'objet THREE.JS sont préfixées par `Three`. Exemple : `var ThreeDirection = new THREE.Vector3()`


## Noms réservés
Par convention, pour une classe données, nous réservons les noms de méthodes suivantes :
* `init` : lancé une seule fois lors de l'initialisation de l'application, par `Main`,
* `update_cinematics` : lancé lors de la boucle cinématique (toutes les 16 ms),
* `get_sceneObjects` : retourne un tableau d'instances d'objets THREE.JS, qui seront ajoutés à la scène.



## Références
* [Site officiel de THREE.JS](https://threejs.org/) : La documentation et les exemples sont à consommer sans modération,
* [Google 3D Warehouse](https://3dwarehouse.sketchup.com) : De nombreux modèles 3D gratuits à téléchargés, dont certain biens. Télécharger au format .DAE (collada) ou .KMZ (Google Earth). Dans le cas des fichiers .KMZ, les renommer en .ZIP et ils contiennent un Collada à l'intérieur (magique),
* [Site officiel de Blender](https://www.blender.org/) : Modeleur 3D Open source, multiplateformes de référence,
* [Site de MR DOOB](http://mrdoob.com/) : Créateur de THREE.JS, de nombreuses démo arty sur son site peuvent inspirer,
* [Site d'AlteredQualia](http://alteredqualia.com/) : Contributeur de THREE.JS.
* [Sublime text](https://www.sublimetext.com/) : Un éditeur de code très bien si vous n'avez pas déjà vos habitudes.


