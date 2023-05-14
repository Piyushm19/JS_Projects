let robot = lib220.loadImageFromURL(
 'https://people.cs.umass.edu/~joydeepb/robot.jpg');
function imageMap(img , func ) {
  let tempVar = img.copy();
  for (let x = 0; x < img.width; ++x) {
    for (let y = 0; y < img.height; ++y) {
      let pixel = func(tempVar.getPixel(x,y));
      tempVar.setPixel(x, y, pixel);
    }
  }
  return tempVar;
}
function highlightEdges(img){
  let tempVar = img.copy();
  for (let x = 0; x < img.width; ++x) {
    for (let y = 0; y < img.height; ++y) {
      let pix1 = img.getPixel(x,y);
      let pix2 = [];    
      if (x === img.width - 1) {
        pix2 = img.getPixel(x - 1, y);
      } else {
        pix2 = img.getPixel(x + 1, y);
      }
      let m1 = (pix1[0] + pix1[1] + pix1[2]) / 3;
      let m2 = (pix2[0] + pix2[1] + pix2[2]) / 3;
      let result = (m1 - m2);
      let result2 = (m1- m2) * -1;
      if (result < 0) {
        tempVar.setPixel(x, y, [result2, result2, result2]);
      } else {
        tempVar.setPixel(x, y, [result, result, result]);
      }
    }
  }
  tempVar.show();
  return tempVar;
}
function blur(img){
  let tempVar = img.copy();
  for (let x = 0; x < tempVar.width; ++x) {
    for (let y = 0; y < tempVar.height; ++y) {
      let red = 0;
      let green = 0;
      let blue = 0;
      for(let z = x - 4; z <= x + 4; ++z){
        let p = [];
        if(z < 1){
          p = img.getPixel(0, y);
        } else if(z >= tempVar.width) {
          p = img.getPixel(tempVar.width - 1, y)
        } else{
          p = img.getPixel(z, y);
        }
        let red2 = p[0];
        let green2 = p[1];
        let blue2 = p[2];
        red = (red + red2);
        green = (green + green2);
        blue = (blue + blue2);
        tempVar.setPixel(x, y, [red / 11 , green / 11, blue / 11]);
      }      
    }
  }
  return tempVar;
}
function swapRB(img) {
  return imageMap(img, swapHelper);
}
function shiftRGB(img) {
  return imageMap(img, shiftHelper);
}
function swapHelper(p) {
  let temp = p[0];
  p[0] = p[2];
  p[2] = temp;
  return p;
}
function shiftHelper(p) {
  let temp = p[0];
  p[0] = p[1];
  p[1] = p[2];
  p[2] = temp;
  return p
}
