//MAIN

// standard global vars
let container, scene, camera, renderer, controls;
const clock = new THREE.Clock();

//custom global vars
let mouse = new THREE.Vector2();

//EVENTS 
window.addEventListener( 'resize', onWindowResize );
window.addEventListener( 'mousemove', onDocumentMouseMove, false );

init();
animate();

//FUNCTIONS
function init()  {

    container = document.querySelector( '#scene-container' );

    //SCENE
    scene = new THREE.Scene();
    //CAMERA
    createCamera();
    //RENDERER
    createRenderer();
    //CONTROLS
    createControls();
    //LIGHTS 
    createLights();
    //MYHEAD
    addMyNoggin();

}

function createCamera() {

    let SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    let VIEW_ANGLE = 55, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
    camera = new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR
    );

    camera.position.set( 0, 150, 400 );
    scene.add(camera);
    camera.lookAt(scene.position);

}

function createRenderer() {

    renderer = new THREE.WebGLRenderer( {antialias:true} );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio( window.devicePixelRatio );
    container.appendChild(renderer.domElement);
    
}

function createControls() {

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    
}

function createLights()  {
    
    let light = new THREE.PointLight(0xffffff);
    light.position.set(0,250,0);
    scene.add(light);

}

function addMyNoggin() {
    let loader = new THREE.OBJLoader();

    loader.load(
        '../models/myNoggin.obj',
        funtion ( object ) {
            scene.add( object );
        }
    );
}

function animate()  {

    requestAnimationFrame( animate );
    render();

}

function render()   {

    renderer.render( scene, camera );
}

function onWindowResize()  {

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( container.clientWidth, container.clientHeight );

}

function onDocumentMouseMove( event )   {

    mouse.x = (event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}



