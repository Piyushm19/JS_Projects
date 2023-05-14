let url = 'https://people.cs.umass.edu/~joydeepb/robot.jpg';
let robot = lib220.loadImageFromURL(url);
//imageMapXY(img: Image, func: (img: Image, x: number, y: number) => Pixel): Image
function imageMapXY(img , f) {
  let tempVar = img.copy();
  for (let x = 0; x < img.width; ++x) {
    for (let y = 0; y < img.height; ++y) {
      tempVar.setPixel(x, y, f(img, x, y));
    }
  }
  return tempVar;
}
// imageMask(img: Image,func: (img: Image, x: number, y: number) => boolean, maskValue: Pixel): Image
function imageMask(img, f, maskValue){
  return imageMapXY(img, function(img, x, y){
    if(!(f(img, x, y))){
      return img.getPixel(x,y);
    } else{
      return maskValue;
    }
  });
} 
// blurPixel(img: Image, x: number, y: number): Pixel
function blurPixel(img, x, y){
  let red = 0;
  let green = 0;
  let blue = 0;
  let rgbVals = [red, green, blue];
  for(let z = 0; z < 6; ++z){
  if(x + z < img.width){
    red = red + img.getPixel(x + z, y)[0];
    green = green + img.getPixel(x + z, y)[1];
    blue = blue + img.getPixel(x + z, y)[2];
    }
  }
  for(let z = 5; z > 0; --z){
    if(x - z > 0){
      red = red + img.getPixel(x - z, y)[0];
      green = green + img.getPixel(x - z, y)[1];
      blue = blue + img.getPixel(x - z, y)[2];
    }
  } 
  red = (red + rgbVals[0])/11;
  green = (green + rgbVals[1])/11;
  blue = (blue + rgbVals[2])/11;
  return [red, green, blue]
}
// blurImage(img: Image): Image
function blurImage(img){
  return imageMapXY(img, blurPixel);
}
// test('imageMapXY function definition is correct', function() {
//  let identityFunction = function(image, x, y) {
//  return image.getPixel(x, y);
//  };
//  let inputImage = lib220.createImage(10, 10, [0, 0, 0]);
//  let outputImage = imageMapXY(inputImage, identityFunction);
//  // Output should be an image, so getPixel must work without errors.
//  let p = outputImage.getPixel(0, 0);
//  assert(p[0] === 0);
//  assert(p[1] === 0);
//  assert(p[2] === 0);
//  assert(inputImage !== outputImage);
// });
// function pixelEq (p1, p2) {
//  const epsilon = 0.002;
//  for (let i = 0; i < 3; ++i) {
//  if (Math.abs(p1[i] - p2[i]) > epsilon) {
//  return false;
//  }
//  }
//  return true;
// };
// test('identity function with imageMapXY', function() {
//  let identityFunction = function(image, x, y ) {
//  return image.getPixel(x, y);
//  };
//  let inputImage = lib220.createImage(10, 10, [0.2, 0.2, 0.2]);
//  inputImage.setPixel(0, 0, [0.5, 0.5, 0.5]);
//  inputImage.setPixel(5, 5, [0.1, 0.2, 0.3]);
//  inputImage.setPixel(2, 8, [0.9, 0.7, 0.8]);
//  let outputImage = imageMapXY(inputImage, identityFunction);
//  assert(pixelEq(outputImage.getPixel(0, 0), [0.5, 0.5, 0.5]));
//  assert(pixelEq(outputImage.getPixel(5, 5), [0.1, 0.2, 0.3]));
//  assert(pixelEq(outputImage.getPixel(2, 8), [0.9, 0.7, 0.8]));
//  assert(pixelEq(outputImage.getPixel(9, 9), [0.2, 0.2, 0.2]));
// });
