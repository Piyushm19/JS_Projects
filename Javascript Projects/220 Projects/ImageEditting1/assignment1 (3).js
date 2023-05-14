let robot = lib220.loadImageFromURL(
 'https://people.cs.umass.edu/~joydeepb/robot.jpg');
robot.show();
removeBlueAndGreen(robot).show();
makeGrayscale(robot).show();
mapToRed(robot).show();
mapToGrayscale(robot).show();
function removeBlueAndGreen(robot) {
  let tempVar = robot.copy();
  for (let x = 0; x < robot.width; ++x) {
    for (let y = 0; y < robot.height; ++y) {
      let pixArray = tempVar.getPixel(x, y);
      tempVar.setPixel(x, y, [pixArray[0], 0.0, 0.0]);
    }
  }
  return tempVar;
}
function makeGrayscale(robot) {
  let tempVar = robot.copy();
  for (let x = 0; x < robot.width; ++x) {
    for (let y = 0; y < robot.height; ++y) {
      let pixArray = tempVar.getPixel(x, y);
      let average = (pixArray[0] + pixArray[1] + pixArray[2]) / 3;
      tempVar.setPixel(x, y, [average, average, average]);
    }
  }
  return tempVar;
} 
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

function mapToRed(robot) {
  return imageMap(robot, redHelper);
}
function mapToGrayscale(robot) {
  return imageMap(robot, grayHelper);
}
function redHelper(pixel) {
  return [pixel[0],0.0,0.0];
}
function grayHelper(pixel) {
  let average = (pixel[0] + pixel[1] + pixel[2]) / 3;
  return [average, average, average];
}
