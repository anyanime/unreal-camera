 const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
  const context = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const btn = document.querySelector('.btn');


let getVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false})
        .then(localMediaStream => {
            console.log(localMediaStream);
            video.srcObject = localMediaStream;
            // video.src = window.URL.createObjectURL(localMediaStream);
            video.play(); 
        })
        .catch(error => console.error(`oh, no!!! give access to your webcam please`, error))
}

let paintToCanvas = () => {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        context.drawImage(video, 0, 0, width, height);
        //take pixels out
        let pixels = context.getImageData(0, 0, width, height);
        //mess with them
        // pixels = redEffects(pixels);
        // pixels = rgbSplit(pixels);
        context.globalAlpha = 0.1;
        // pixels = greenScreen(pixels);
        //put them back
        context.putImageData(pixels, 0, 0);
    }, 16)
}

let takePhoto = () => {
    snap.currentTime = 0;
    snap.play(); 

    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'engineer');
    link.textContent = 'Download Image';
    link.innerHTML = `<img src="${data}" alt="Handsome Man"/>`
    strip.insertBefore(link, strip.firstChild);
}

let redEffects = (pixels) => {
    for (let i =0; i < pixels.data.length; i+=4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 200;
        pixels.data[i + 1] = pixels.data[i + 1] - 50;
        pixels.data[i + 02] = pixels.data[i + 2] + 0.5;
    }
    return pixels;
}

let rgbSplit = (pixels) => {
    for (let i =0; i < pixels.data.length; i+=4) {
        pixels.data[i - 150] = pixels.data[i + 0];
        pixels.data[i + 100] = pixels.data[i + 1];
        pixels.data[i - 550] = pixels.data[i + 2];
    }
    return pixels;
}

let greenScreen = (pixels) => {

    const levels = {};

    document.querySelectorAll('.colour input').forEach((input) => {
        levels[input.name] = input.value;
    });

    // console.log(levels)  

    for (let i =0; i < pixels.data.length; i+=4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];

        if (red >= levels.rmin
            && green >= levels.gmin
            && blue >= levels.bmin
            && red <= levels.rmax
            && green <= levels.gmax
            && blue <= levels.bmax) {
                pixels.data[i + 3] = 0;
            }
    }
    return pixels;
}

video.addEventListener('canplay', paintToCanvas)
btn.addEventListener('click', takePhoto)

getVideo();

