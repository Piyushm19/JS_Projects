let url = 'https://people.cs.umass.edu/~joydeepb/robot.jpg';
let robot = lib220.loadImageFromURL(url);

//imageMapXY(img: Image, func: (img: Image, x: number, y: number) => Pixel): Image
function imageMapXY(img , f) {
  // create a copy of image and traverse through the width and height
  let tempCopy = img.copy();
  for (let x = 0; x < img.width; ++x) {
    for (let y = 0; y < img.height; ++y) {
      tempCopy.setPixel(x, y, f(img, x, y));
    }
  }
  return tempCopy;
}

//blurPixel(img: Image, x: number, y: number): Pixel
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
  return [red, green, blue];
}

//blurHalfImage(img: Image, right: boolean): Image
function blurHalfImage(img, right) {
  return imageMapXY(img, function(img, x, y) {
    // check if right side is true, if so blur that side. If not then check left side and blur the left side
    if(right) {
      if (x >= img.width / 2) {
        return blurPixel(img, x, y);
      } else { 
        return img.getPixel(x, y);
      }
    } else {
      if (x < img.width / 2) {
        return blurPixel(img, x, y);
      } else {
        return img.getPixel(x, y);
      }
    }
  });
}
//isGrayish(p: Pixel): boolean
function isGrayish(p) {
  if (p[0] >= 0.3 && p[0] <= 0.7) {
    if (p[1] >= 0.3 && p[1] <= 0.7) {
      if (p[2] >= 0.3 && p[2] <= 0.7) {
        return true;
      }
    }
  }
  return false;
}
//toGrayscale(img: Image): Image
function toGrayscale(img) { 
  return imageMapXY(img, grayHelper);
}

//grayHalfImage(img: Image): Image
function grayHalfImage(img) {
  return imageMapXY(img, grayHalfHelper);
}

//grayHalfHelper(img: Image, x: number, y: number): Image
function grayHalfHelper(img, x, y) {
  let tempPix = img.getPixel(x,y);
  if (x >= (img.width / 2)) {
    if (isGrayish(tempPix)) {
      let avg = (tempPix[0] + tempPix[1] + tempPix[2]) / 3;
      return [avg, avg, avg];
    }
  }  
  return tempPix;
}

//grayHelper(img: Image, x: number, y: number): Image
function grayHelper(img, x, y) {
  let tempPix = img.getPixel(x,y);
  if (isGrayish(tempPix)) {
    let avg = (tempPix[0] + tempPix[1] + tempPix[2]) / 3;
    return [avg, avg, avg];
  } else {
    return tempPix;
  }
}

//saturateHigh(img: Image): Image
function saturateHigh(img) {
  return imageMapXY(img, satHighHelper);
}

//satHighHelper(img: Image, x: number, y: number): Image
function satHighHelper(img, x, y){
  let arr = img.getPixel(x,y);
  if(arr[0] > 0.7) {
    arr[0] = 1;
  } 
  if(arr[1] > 0.7) {
    arr[1] = 1;
  }
  if(arr[2] > 0.7) {
    arr[2] = 1;
  }
  return arr;
}

//blackenLow(img: Image): Image
function blackenLow(img) {
  return imageMapXY(img, blackenHelper);
}

//blackenHelper (img: Image, x: number, y: number): Image
function blackenHelper(img, x, y) {
  let arr = img.getPixel(x,y);
  if(arr[0] < 0.3) {
    arr[0] = 0.0;
  } 
  if(arr[1] < 0.3) {
    arr[1] = 0.0;
  }
  if(arr[2] < 0.3) {
    arr[2] = 0.0;
  }
  return arr;
}

//reduceFunctions(fa: ((p: Pixel) => Pixel)[] ): ((x: Pixel) => Pixel)
function reduceFunctions(fa) {
  function result(f, g) {
    return x => f(g(x));
  }
  return fa.reduce(result, fa[0]);
}

//colorize(img: Image): Image
function colorize(img) {
  return saturateHigh(blackenLow(toGrayscale(img)));
}

// MY TESTS
function pixelEq (p1, p2) {
 const epsilon = 0.002;
 for (let i = 0; i < 3; ++i) {
 if (Math.abs(p1[i] - p2[i]) > epsilon) {
 return false;
 }
 }
 return true;
};

test('imageMapXY function definition is correct', function() {
 let identityFunction = function(image, x, y) {
 return image.getPixel(x, y);
 };
 let inputImage = lib220.createImage(10, 10, [0, 0, 0]);
 let outputImage = imageMapXY(inputImage, identityFunction);
 // Output should be an image, so getPixel must work without errors.
 let p = outputImage.getPixel(0, 0);
 assert(p[0] === 0);
 assert(p[1] === 0);
 assert(p[2] === 0);
 assert(inputImage !== outputImage);
});

test('identity function with imageMapXY', function() {
   let identityFunction = function(image, x, y ) {
   return image.getPixel(x, y);
   };
   let inputImage = lib220.createImage(10, 10, [0.2, 0.2, 0.2]);
   inputImage.setPixel(0, 0, [0.5, 0.5, 0.5]);
   inputImage.setPixel(5, 5, [0.1, 0.2, 0.3]);
   inputImage.setPixel(2, 8, [0.9, 0.7, 0.8]);
   let outputImage = imageMapXY(inputImage, identityFunction);
   assert(pixelEq(outputImage.getPixel(0, 0), [0.5, 0.5, 0.5]));
   assert(pixelEq(outputImage.getPixel(5, 5), [0.1, 0.2, 0.3]));
   assert(pixelEq(outputImage.getPixel(2, 8), [0.9, 0.7, 0.8]));
   assert(pixelEq(outputImage.getPixel(9, 9), [0.2, 0.2, 0.2]));
});

test ('isGrayish results in expected values', function() {
   let arr = [0, 0, 0];
   assert(!isGrayish(arr));
   arr = [0.23, 0.29, 0.6];
   assert(!isGrayish(arr));
   arr = [0.3, 0.3, 0.3];
   assert(isGrayish(arr));
   arr = [0.29, 0.3, 0.29];
   assert(!isGrayish(arr));
   arr = [1.0, 1.0, 1.0];
   assert(!isGrayish(arr));
   arr = [0.7, 0.7, 0.7];
   assert(isGrayish(arr));
   arr = [0.701, 0.7, 0.701];
   assert(!isGrayish(arr));
});
 
test('Checks if the pixels with color value over 0.7 are changed in saturateHigh', function() {
  let url = 'https://people.cs.umass.edu/~joydeepb/robot.jpg';
  let robot = lib220.loadImageFromURL(url);
  let check = saturateHigh(robot);
  for (let x = 0; x < robot.width; ++x) {
    for (let y = 0; y < robot.height; ++y) {
      let arr = robot.getPixel(x, y);
      if(arr[0] > 0.7) {
        assert(check.getPixel(x, y)[0] === 1); 
      } else if (arr[1] > 0.7) {
        assert(check.getPixel(x, y)[1] === 1); 
      }  else if (arr[2] > 0.7) {
        assert(check.getPixel(x, y)[2] === 1); 
      }
    }
  }
});
 
test('Checks if the pixels with color value under 0.3 are changed in blackenLow', function() {
  let url = 'https://people.cs.umass.edu/~joydeepb/robot.jpg';
  let robot = lib220.loadImageFromURL(url);
  let check = blackenLow(robot);
  for (let x = 0; x < robot.width; ++x) {
    for (let y = 0; y < robot.height; ++y) {
      let arr = robot.getPixel(x, y);
      if (arr[0] < 0.3) {
        assert(check.getPixel(x, y)[0] === 0); 
      } else if (arr[1] < 0.3) {
        assert(check.getPixel(x, y)[1] === 0); 
      } else if (arr[2] < 0.3) {
        assert(check.getPixel(x, y)[2] === 0); 
      }
    }
  }
});