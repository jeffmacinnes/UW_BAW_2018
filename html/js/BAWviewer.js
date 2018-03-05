// Global vars
var container, stats;
var scene, camera, renderer, controls;
var manager, loader;
var brainObjs = [];
var bgImgs = [];
var brain1, brain2;
var sizeX = 500, sizeY=500;

init();
animate();

function init() {

    // grab the html div to place scenes into
    var container = document.getElementById("container");

    // add camera -------------------------------------------
    camera = new THREE.PerspectiveCamera(45,
                window.innerWidth/window.innerHeight,
                1,
                1000);
    camera.position.z = 30

    // add scene -------------------------------------------
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );

    // lights -------------------------------------------
    var ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight( 0xffeedd );
    directionalLight.position.set( 0, 0, 1 );
    scene.add( directionalLight );

    // Load objects -------------------------------------------
    manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {
        console.log( item, loaded, total );
    };

    // create all objects
    for (var i=1; i<=1; i++){
        createBrainObj(i);

        console.log('in here')
        createImage(i);
    }

    // Add Coordinate Axes to the Scene
    axes = buildAxes(10);
    scene.add(axes);


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

    // // move objects
    for (var b in brainObjs){
        brainObjs[b].rotation.z += 0.01;
        bgImgs[b].rotation.y += 0.01;
    }

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

// Load a brain object
function createBrainObj(idx){
    var loader = new THREE.OBJLoader( manager );
    loader.load( '/assets/subj0' + idx + '.obj', function ( object ) {
        object.scale.set(.05, .05, .05);
        object.position.set(0,0,0);
        object.rotation.z = Math.PI / 2;
        object.rotation.x = Math.PI / 2 * 3;
        scene.add( object );
        brainObjs.push(object);
    });
}

// Load a Silhouette
// Build the Target (i.e. painting)
function createImage(idx){

    // loader function to load texture and apply to plane
    var loader = new THREE.TextureLoader();
    loader.load('/assets/subj0' + idx + '.png', function(texture){
        console.log('here');
        var geom = new THREE.PlaneGeometry(15, 15);
        var mat = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});
        var mesh = new THREE.Mesh(geom, mat);
        mesh.position.set(0, 0, 0);
        scene.add(mesh);
        bgImgs.push(mesh)
    });
}


// Add Axes to the room for reference
function buildAxes(length){
    var axes = new THREE.Object3D;

    axes.add( buildAxis( new THREE.Vector3(0,0,0), new THREE.Vector3(length, 0, 0), 0xFF0000, false) ); // +X
    axes.add( buildAxis( new THREE.Vector3(0,0,0), new THREE.Vector3(0, length, 0), 0x00FF00, false) ); // +Y
    axes.add( buildAxis( new THREE.Vector3(0,0,0), new THREE.Vector3(0, 0, length), 0x0000FF, false) ); // +Z

    return axes;
}

function buildAxis(src, dst, colorHex, dashed){
    var geom = new THREE.Geometry(),
        mat;

    if(dashed) {
        mat = new THREE.LineDashedMaterial({linewidth:3, color: colorHex, dashSize: 3, gapSize:3 });
    } else {
        mat = new THREE.LineBasicMaterial({linewidth: 3, color: colorHex});
    }

    geom.vertices.push(src.clone());
    geom.vertices.push(dst.clone());
    geom.computeLineDistances();

    var axis = new THREE.Line( geom, mat, THREE.LineSegments );
    return axis;
}
