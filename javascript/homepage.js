//MAIN

// standard global vars
let container, scene, camera, renderer, controls;
const clock = new THREE.Clock();

//custom global vars
let cube;
let glow1, glow2, glow3, raycaster;
let projector, INTERSECTED;
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
    //CUBE
    createCube();
    //BUBBLES 
    createBubbles();
    //TEXT
    addText();

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

//add them to an array in for loop, stoopid

function createBubbles()    {

    this.refractSphereCamera1 = new THREE.CubeCamera( 0.1, 5000, 512 );
    scene.add( refractSphereCamera1 );

    this.refractSphereCamera2 = new THREE.CubeCamera( 0.1, 5000, 512 );
    scene.add( refractSphereCamera2 );

    this.refractSphereCamera3 = new THREE.CubeCamera( 0.1, 5000, 512 );
    scene.add( refractSphereCamera3 );

    let fShader1 = THREE.FresnelShader;
    let fShader2 = THREE.FresnelShader;
    let fShader3 = THREE.FresnelShader;

    let fresnelUniform1 =
    {
        "mRefractionRation":    { type: "f", value: 1.02 },
        "mFresnelBias":         { type: "f", value: 0.1  },
        "mFresnelPower":        { type: "f", value: 2.0  },
        "mFresnelScale":        { type: "f", value: 1.0  },
        "tCube":                { type: "f", value: refractSphereCamera1.renderTarget }
    };
    let fresnelUniform2 =
    {
        "mRefractionRation":    { type: "f", value: 1.02 },
        "mFresnelBias":         { type: "f", value: 0.1  },
        "mFresnelPower":        { type: "f", value: 2.0  },
        "mFresnelScale":        { type: "f", value: 1.0  },
        "tCube":                { type: "f", value: refractSphereCamera2.renderTarget }
    };
    let fresnelUniform3 =
    {
        "mRefractionRation":    { type: "f", value: 1.02 },
        "mFresnelBias":         { type: "f", value: 0.1  },
        "mFresnelPower":        { type: "f", value: 2.0  },
        "mFresnelScale":        { type: "f", value: 1.0  },
        "tCube":                { type: "f", value: refractSphereCamera3.renderTarget }
    };

    let customMaterial1 = new THREE.ShaderMaterial(
        {
            uniforms:       fresnelUniform1,
            vertexShader:   fShader1.vertexShader,
            fragmentShader: fShader1.fragmentShader
        }
    );
    let customMaterial2 = new THREE.ShaderMaterial(
        {
            uniforms:       fresnelUniform2,
            vertexShader:   fShader2.vertexShader,
            fragmentShader: fShader2.fragmentShader
        }
    );
    let customMaterial3 = new THREE.ShaderMaterial(
        {
            uniforms:       fresnelUniform3,
            vertexShader:   fShader3.vertexShader,
            fragmentShader: fShader3.fragmentShader
        }
    );

    let sphereGeometry1 = new THREE.SphereGeometry( 50, 64, 32 );
    let sphereGeometry2 = new THREE.SphereGeometry( 50, 64, 32 );
    let sphereGeometry3 = new THREE.SphereGeometry( 50, 64, 32 );

    this.sphere1 = new THREE.Mesh( sphereGeometry1, customMaterial1 );
    sphere1.position.set(-80, 30, 0);
    this.sphere2 = new THREE.Mesh( sphereGeometry2, customMaterial2 );
    sphere2.position.set(80, 30, 0);
    this.sphere3 = new THREE.Mesh( sphereGeometry3, customMaterial3 );
    sphere3.position.set(0, 110, 0);

    scene.add(sphere1);
    scene.add(sphere2);
    scene.add(sphere3);

    refractSphereCamera1.position = sphere1.position;
    refractSphereCamera2.position = sphere2.position;
    refractSphereCamera3.position = sphere3.position;

    let glowMaterial = new THREE.ShaderMaterial(
        {
            uniforms:
            {
                "c":    { type: "f", value: 1.0 },
                "p":    { type: "f", value: 1.4 },
                glowColor: { type: "c", value: new THREE.Color(0x8f2fd2) },
                viewVector: { type: "v3", value: camera.position }
            },
            vertexShader: document.getElementById( 'vertexShader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        }
    );
    
    glow1 = new THREE.Mesh( sphereGeometry1.clone(), glowMaterial.clone() );
    glow1.position.set(-80, 30, 0);
    glow1.scale.multiplyScalar(1.2);
    glow1.visible = false;
    scene.add( glow1 );
    
    glow2 = new THREE.Mesh( sphereGeometry1.clone(), glowMaterial.clone() );
    glow2.position.set(80, 30, 0);
    glow2.scale.multiplyScalar(1.2);    
    glow2.visible = false;
    scene.add( glow2 );

    glow3 = new THREE.Mesh( sphereGeometry1.clone(), glowMaterial.clone() );
    glow3.position.set(0, 110, 0);
    glow3.scale.multiplyScalar(1.2);
    glow3.visible = false;
    scene.add( glow3 );

    raycaster = new THREE.Raycaster();

}

function addText()  {

}

function animate()  {

    requestAnimationFrame( animate );
    render();
    update();

}

function update()   {

    raycaster.setFromCamera( mouse, camera );

    let intersects = raycaster.intersectObjects( scene.children );

    if( intersects.length > 1 )
    {
        /*
            TO DO!!!!
        */

        //create function calls for intersections, arg will be num
        //will set the glow, project the texture, and make the words appear
        //capture textures as screenshots of the webpages once they're built out a little

        if( intersects[ 0 ].object == sphere1 )
        {
            glow1.visible = true;
            glow2.visible = false;
            glow3.visible = false;
        }
        if( intersects[ 0 ].object == sphere2 )
        {
            glow1.visible = false;
            glow2.visible = true;
            glow3.visible = false;
        }
        if( intersects[ 0 ].object == sphere3 )
        {
            glow1.visible = false;
            glow2.visible = false;
            glow3.visible = true;
        }
    }
    else
    {
        glow1.visible = false;
        glow2.visible = false;
        glow3.visible = false;
    }

    controls.update();

}

function render()   {
    sphere1.visible = false;
    sphere2.visible = false;
    sphere3.visible = false;
    refractSphereCamera1.updateCubeMap( renderer, scene );
    refractSphereCamera2.updateCubeMap( renderer, scene );
    refractSphereCamera3.updateCubeMap( renderer, scene );
    sphere1.visible = true;
    sphere2.visible = true;
    sphere3.visible = true;

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



