const image = document.querySelector("#my-image");
const canvas = document.querySelector("#my-canvas");
const text = document.querySelector("#ascii");
const button = document.querySelector("#button");
const WIDTH = 250;
const HEIGHT = 90;
const SIZE = 95;
canvas.height = HEIGHT;
canvas.width = WIDTH;
const ctx = canvas.getContext("2d");

const rgbMap = "%%#%&08??((<;+-/*,.";
// const rgbMap = "$%$&&@$@@%8@&&/(808{}???-_+~*<>i,.";
// const rgbMap = "$%$&$@%@/(808{}???-_+~*<>i,.";
// const rgbMap = "#@$#80??>>///*-+,.";
const mapToAscii = (data) => {
  var arr = "";
  for (var i = 0; i < data.length; i++) {
    data[i] = Math.ceil((data[i] * (rgbMap.length - 1)) / 255);
    arr += rgbMap[data[i]];
    if ((i + 1) % WIDTH === 0) {
      arr += "\n";
    }
  }
  text.textContent = arr;
};

// Prefer camera resolution nearest to 1280x720.
var constraints = { audio: false, video: { width: 500, height: 300 } };

var interval;
const captureFeed = (video) => {
  interval = setInterval(() => {
    ctx.drawImage(video, 0, 0, WIDTH, HEIGHT);
    drawAsciiArt();
  }, 100);
};

button.addEventListener("click", () => {
  console.log("button clicked");
  clearInterval(interval);
});

navigator.mediaDevices
  .getUserMedia(constraints)
  .then(function (mediaStream) {
    var video = document.querySelector("video");
    video.srcObject = mediaStream;
    video.onloadedmetadata = function (e) {
      video.play();
      captureFeed(video);
      console.log(video);
      console.log(e);
    };
  })
  .catch(function (err) {
    console.log(err.name + ": " + err.message);
  });

const drawAsciiArt = () => {
  const imgData = ctx.getImageData(0, 0, WIDTH, HEIGHT);

  const asciiArr = [];

  for (var i = 0; i < imgData.data.length; i += 4) {
    var r = imgData.data[i];
    var g = imgData.data[i + 1];
    var b = imgData.data[i + 2];

    r = b = g = (r + g + b) / 3;

    asciiArr.push(r);

    imgData.data[i] = r;
    imgData.data[i + 1] = g;
    imgData.data[i + 2] = b;
  }
  mapToAscii(asciiArr);
};

// image.onload = (e) => {
//   console.log("loading");
//   image.crossOrigin = "anonymous";
//   ctx.drawImage(image, 0, 0, WIDTH, HEIGHT);
//   const imgData = ctx.getImageData(0, 0, WIDTH, HEIGHT);

//   const asciiArr = [];

//   for (var i = 0; i < imgData.data.length; i += 4) {
//     var r = imgData.data[i];
//     var g = imgData.data[i + 1];
//     var b = imgData.data[i + 2];

//     r = b = g = (r + g + b) / 3;

//     asciiArr.push(r);

//     imgData.data[i] = r;
//     imgData.data[i + 1] = g;
//     imgData.data[i + 2] = b;
//   }
//   ctx.putImageData(imgData, 0, 0);
//   mapToAscii(asciiArr);
//};
