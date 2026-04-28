// what do I want to make?
// the forest?
// wake forest! no
// let's start with some trees

// Homework 2: Make procedural tree; user can shoot the tree into oblivion
//             using left controller trigger in XR mode

import * as cg from '../render/core/cg.js'
import * as clay from '../render/core/clay.js'
export const init = async model => {
  // Define model:

  // The ground will have trees
  let ground = model.add('square'); // ground

  let simple_tree = ground.add('square')

  // tree with branches
  let trunk = ground.add('coneY')
  let complex_tree = trunk.add('tubeY')
  complex_tree.add('tubeY');
  for (let n = 0; n < 7; n++) {
    complex_tree.child(0).add('coneY') // branches
    for (let m = 0; m < 5; m++) {
      complex_tree.child(0).child(n).add('coneY')
      for (let l = 0; l < 4; l++) {
        complex_tree.child(0).child(n).child(m).add('sphere')
      }
    }
  }

  let isCut = false;
  let cutTime = null;

  inputEvents.onMove    = hand => { }
  inputEvents.onPress   = hand => { 
    if (hand == 'left') isCut = true;
    if (hand == 'right') isCut = false; 
  }
  inputEvents.onDrag    = hand => { }
  inputEvents.onRelease = hand => { }
  inputEvents.onClick   = hand => { }
  
  // for ( let n = 0; n < 1; n++) {
  //   ground.add('square'); // trees
  // }
  
  // Textures:
  // - The ground will have leaves and mulch
  // - I'll use 3 oak textures and vary them between trees randomly
  model.txtrSrc(1, '../media/textures/forest_leaves_02_diffuse_4k.jpg')
  model.txtrSrc(2, '../media/textures/forest_leaves_02_nor_gl_4k.jpg')
  model.txtrSrc(3, '../media/textures/wind_waker_palm_tree.png')
  model.txtrSrc(4, '../media/textures/wood_0062_color_2k.jpg')
  model.txtrSrc(5, '../media/textures/wood_0062_normal_opengl_2k.png')
  
  ground.txtr(1);
  ground.bumptxtr(2);
  simple_tree.txtr(3);
  complex_tree.txtr(4);
  complex_tree.bumptxtr(5);
  complex_tree.color(0.388, 0.194, 0.0);
    complex_tree.child(0).txtr(4);
    complex_tree.child(0).bumptxtr(5);
    complex_tree.child(0).color(0.388, 0.194, 0.0);
    for (let n = 0; n < 7; n++) {
      complex_tree.child(0).child(n).txtr(4)
      complex_tree.child(0).child(n).bumptxtr(5);
      complex_tree.child(0).child(n).color(0.388, 0.194, 0.0);
      for (let m = 0; m < 5; m++) {
        complex_tree.child(0).child(n).child(m).txtr(4);
        complex_tree.child(0).child(n).child(m).bumptxtr(4);
        complex_tree.child(0).child(n).child(m).color(0.388, 0.194, 0.0);
        for (let l = 0; l < 4; l++) {
          complex_tree.child(0).child(n).child(m).child(l).color(0,.3,0)
        }
      }
    }
  trunk.txtr(4);
  trunk.bumptxtr(5);
  trunk.color(0.388, 0.194, 0.0);
  // for ( let n = 0; n < 1; n++) {
  //   ground.child(n).txtr(3);
  // }

  // Render model
  model.scale(5).move(0,2,0).animate(() => {
    let t = model.time;
    let sin = Math.sin;
    let cos = Math.cos;
    let pi = Math.PI;
    if (cutTime === null || !isCut) cutTime = t;
    let dt = t - cutTime;

    ground.identity()
      .move(0,-2,0)
      .turnX(-pi/2);
      //.turnZ(t);
    
    //for (let n = 0; n < 1; n++) {
    simple_tree.identity()
      .scale(.3)
      .turnX(pi/2)
      .move(0,0,isCut ? -.5*Math.pow(dt,2) : 0)
      .turnZ(isCut ? -dt : 0)
      .move(.1, 1, -1);
    //}

    trunk.dull().identity()
      //.turnZ(t)
      .scale(.3)
      .turnX(pi/2)
      //.turnY(t)
      .move(-1, .5, -1)
      .turnY(Math.PI/2)
      .scale(.3,.5,.3)
    
    
    
    complex_tree.identity()
      //.turnY(t)
      .turnX(.08*pi/2)
      .turnZ(.05*pi/2)
      .move(isCut ? .5*Math.pow(dt,2) : 0,0,0)
      .turnZ(isCut ? -dt : 0)
      .move(0,0,0.1)
      .scale(.7,.7,.7)
    
      complex_tree.child(0).identity()
        .move(0,2,0)
        //.turnX(-.06*pi/2)

        for (let n = 0; n < 7; n++) {
          complex_tree.child(0).child(n).identity()
            .turnX(4*cg.noise(pi*10%n,0,n))
            .turnY(2*cg.noise(2,pi*10%n,2))
            .scale(.5,1.5,.5)
            .move(-1.5+.5*n,1.5,.1*n)
          for (let m = 0; m < 5; m++) {
            complex_tree.child(0).child(n).child(m).identity()
              .turnX(8*cg.noise(pi*5%m,0,m))
              .turnY(2*cg.noise(2,2,2))
              .scale(.2,.8,.2)
              .move(-1.5+.5*m,1,.1*m)
            for (let l = 0; l < 4; l++) {
              complex_tree.child(0).child(n).child(m).child(l).identity()
                //cg.mAimY
                .move(0,1,0)
                .scale(1,.5,1)
            }
          }
        }
    
    //clay.billboard().identity();
    
    //console.log(complex_tree)
  });
}