// Global vars
var container, stats;
var scene, camera, renderer, controls;
var brain;
var sizeX = 500, sizeY=500;

init();
animate();

function init() {

    // grab the html div to place scenes into
    var container = document.getElementById("container");

    // add camera -------------------------------------------
    camera = new THREE.PerspectiveCamera(45,
                sizeX/sizeY,
                1,
                1000);
    camera.position.z = -10

    // add scene -------------------------------------------
    scene = new THREE.Scene();

    // lights -------------------------------------------
    var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight( 0xffeedd );
    directionalLight.position.set( 0, 0, -1 );
    scene.add( directionalLight );

    // Load the objects  -------------------------------------------
    // var loader = new THREE.JSONLoader();
    // loader.load('/assets/subj04.obj.json', function (geometry, materials){
    //         var material = materials[0]
    //         var mesh = new THREE.Mesh(geometry, material);
    //
    //         // position and scale the brain
    //         mesh.position.set(0,0,0);
    //         mesh.scale.set(.1,.1,.1);
    //
    //         // add it to the scene
    //         scene.add(mesh);
    // });

    // texture
    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {
        console.log( item, loaded, total );
    };

    // model
    var loader = new THREE.OBJLoader( manager );
    loader.load( '/lh.obj', function ( object ) {
        brain = object;
        object.position.y = 0;
        console.log(object);
        scene.add( object );
    } );





    // renderer
    renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );


    // controls for mouse
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener( 'change', render );

    //stats
    stats = new Stats();
    container.appendChild(stats.dom);
}


function onWindowResize( event ) {
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}


function animate() {
    requestAnimationFrame( animate );
    stats.begin();
    controls.update();
    render();
    stats.end();
}


function render() {
    var timer = Date.now() * 0.0005;
    //camera.position.x = Math.cos( timer ) * 10;
    //camera.position.y = 4;
    //camera.position.z = Math.sin( timer ) * 10;

    camera.lookAt( scene.position );
    renderer.render( scene, camera );
}
