require(['vendor/threex.keyboardstate/package.require.js',
         'vendor/threex.spaceships/package.require.js',
         'vendor/threex.spaceships/threex.spaceships.js',
         'vendor/threex.spaceships/examples/vendor/three.js/examples/js/loaders/OBJMTLLoader.js',
         'vendor/threex.spaceships/examples/vendor/three.js/examples/js/loaders/OBJLoader.js',
         'vendor/threex.spaceships/examples/vendor/three.js/examples/js/loaders/MTLLoader.js',
        ], function(){

  // detect WebGL
  if( !Detector.webgl ){
    Detector.addGetWebGLMessage();
    throw 'WebGL Not Available'
  }
  // setup webgl renderer full page
  var renderer  = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  // setup a scene and camera
  var scene  = new THREE.Scene();
  var camera  = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
  camera.position.z = 3;

  // declare the rendering loop
  var onRenderFns = [];

  // handle window resize events
  var winResize  = new THREEx.WindowResize(renderer, camera);
  //////////////////////////////////////////////////////////////////////////////////
  //    space ships          //
  //////////////////////////////////////////////////////////////////////////////////

  var spaceship   = null;
  THREEx.SpaceShips.loadSpaceFighter03(function (object3d){
    scene.add(object3d);
    spaceship = object3d;
    spaceship.rotateY(Math.PI/2);
    spaceship.position.x = -1;

    spaceship.shots = [];
  });


  // create keyboard instance
  var keyboard  = new THREEx.KeyboardState();

  // add function in rendering loop
  onRenderFns.push(function(delta, now){

    // only if the spaceship is loaded
    if( spaceship === null )  return;

    // set the speed
    var speed = 1;
    // only if spaceships is loaded
    if( keyboard.pressed('down') ){
        spaceship.position.y  -= speed * delta;
    }else if( keyboard.pressed('up') ){
        spaceship.position.y  += speed * delta;
    }else if( keyboard.pressed('left') ){
        spaceship.position.x  -= speed * delta;
    }else if( keyboard.pressed('right') ){
        spaceship.position.x  += speed * delta;
    }else if( keyboard.pressed('space') ){
      if(true){
        var shoot = new THREEx.SpaceShips.Shoot();
        spaceship.shots.push(shoot);
        shoot.position.x = spaceship.position.x;
        shoot.position.y = spaceship.position.y;
        shoot.position.z = spaceship.position.z + 0.5;
        shoot.rotateY(Math.PI/2);
        scene.add(shoot);
      }
    }
    for(var i = 0; i < spaceship.shots.length; i++){
      spaceship.shots[i].position.x += speed * delta;
    }
  });
  //////////////////////////////////////////////////////////////////////////////////
  //    default 3 points lightning          //
  //////////////////////////////////////////////////////////////////////////////////

  var ambientLight= new THREE.AmbientLight( 0x010101 );
  scene.add( ambientLight);
  var frontLight  = new THREE.DirectionalLight('orange', 5);
  frontLight.position.set(0.5, 0.5, 2);
  scene.add( frontLight );
  var backLight  = new THREE.DirectionalLight('white', 1);
  backLight.position.set(-0.5, -0.5, -2);
  scene.add( backLight );

  //////////////////////////////////////////////////////////////////////////////////
  //    Helpers          //
  //////////////////////////////////////////////////////////////////////////////////

  var size = 10;
  var step = 1;
  var gridHelper = new THREE.GridHelper( size, step );
  scene.add( gridHelper );
  // var lightHelper1 = new THREE.DirectionalLightHelper(frontLight, 1);
  // scene.add( lightHelper1 );
  // var lightHelper2 = new THREE.DirectionalLightHelper(backLight, 1);
  // scene.add( lightHelper2 );
  var axisHelper = new THREE.AxisHelper( 5 );
  scene.add( axisHelper );

  //////////////////////////////////////////////////////////////////////////////////
  //    add an object and make it move          //
  //////////////////////////////////////////////////////////////////////////////////
  var geometry  = new THREE.BoxGeometry( 1, 1, 1);
  var material  = new THREE.MeshPhongMaterial();
  var mesh  = new THREE.Mesh( geometry, material );
  // scene.add( mesh );

  onRenderFns.push(function (delta, now){
    mesh.rotateX(0.5 * delta);
    mesh.rotateY(2.0 * delta);
  });

  //////////////////////////////////////////////////////////////////////////////////
  //    Camera Controls              //
  //////////////////////////////////////////////////////////////////////////////////
  var mouse  = {x : 0, y : 0};
  document.addEventListener('mousemove', function(event){
    mouse.x  = (event.clientX / window.innerWidth ) - 0.5;
    mouse.y  = (event.clientY / window.innerHeight) - 0.5;
  }, false);
  onRenderFns.push(function (delta, now){
    camera.position.x += (mouse.x*5 - camera.position.x) * (delta*3);
    camera.position.y += (mouse.y*5 - camera.position.y) * (delta*3);
    camera.lookAt( scene.position );
  })

  //////////////////////////////////////////////////////////////////////////////////
  //    render the scene            //
  //////////////////////////////////////////////////////////////////////////////////
  onRenderFns.push(function(){
    renderer.render( scene, camera );
  });

  //////////////////////////////////////////////////////////////////////////////////
  //    Rendering Loop runner            //
  //////////////////////////////////////////////////////////////////////////////////
  var lastTimeMsec = null;
  requestAnimationFrame(function animate(nowMsec){
    // keep looping
    requestAnimationFrame( animate );
    // measure time
    lastTimeMsec  = lastTimeMsec || nowMsec-1000/60;
    var deltaMsec  = Math.min(200, nowMsec - lastTimeMsec);
    lastTimeMsec  = nowMsec;
    // call each update function
    onRenderFns.forEach(function (onRenderFct){
      onRenderFct(deltaMsec/1000, nowMsec/1000);
    });
  });
});