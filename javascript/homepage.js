//MAIN

// standard global vars
let container, scene, camera, renderer, controls;
const clock = new THREE.Clock();

//custom global vars
let cube;

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
    //CUBE
    createCube();
    //BUBBLES 
    createBubbles();

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
    scene.add(camera)
    camera.lookAt(scene.position)

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

function createCube()   {

    let imagePrefix = "images/mp_midnight/midnight-silence_";
    let directions = ["ft", "bk", "dn", "up", "rt", "lf"];
    let imageSuffix = ".tga";
    let skyGeometry = new THREE.CubeGeometry( 5000, 5000, 5000 );

    let loader = new THREE.TGALoader();
    let materialArray = [];

    for(let i = 0; i < 6; ++i)
        materialArray.push( new THREE.MeshBasicMaterial({
            map: loader.load( imagePrefix + directions[i] + imageSuffix ),
            side: THREE.BackSide
        }));

    cube = new THREE.Mesh( skyGeometry, materialArray );

    cube.rotation.z = Math.PI;

    scene.add( cube );

}

function createBubbles()    {

    this.refractSphereCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
    scene.add( refractSphereCamera );

    let fShader = THREE.FresnelShader;

    let fresnelUniforms =
    {
        "mRefractionRation":    { type: "f", value: 1.02 },
        "mFresnelBias":         { type: "f", value: 0.1  },
        "mFresnelPower":        { type: "f", value: 2.0  },
        "mFresnelScale":        { type: "f", value: 1.0  },
        "tCube":                { type: "f", value: refractSphereCamera.renderTarget }
    };

    let customMaterial = new THREE.ShaderMaterial(
        {
            uniforms:       fresnelUniforms,
            vertexShader:   fShader.vertexShader,
            fragmentShader: fShader.fragmentShader
        }
    );

    let sphereGeometry = new THREE.SphereGeometry( 100, 64, 32 );
    this.sphere = new THREE.Mesh( sphereGeometry, customMaterial );
    sphere.position.set(0, 50, 100);
    scene.add(sphere);

    refractSphereCamera.position = sphere.position;


}

function animate()  {

    requestAnimationFrame( animate );
    render();
}

function render()   {
    sphere.visible = false;
    refractSphereCamera.updateCubeMap( renderer, scene );
    sphere.visible = true;

    renderer.render( scene, camera );
}

function onWindowResize()  {

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( container.clientWidth, container.clientHeight );

}

//EVENTS 
window.addEventListener( 'resize', onWindowResize );

init();
animate();



