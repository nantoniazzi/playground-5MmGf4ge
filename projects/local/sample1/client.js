// Enabling video and audio channels 
var constraints = {
    video: true,
    audio: true
};

// Request user permission to get media input 
navigator.mediaDevices.getUserMedia(constraints)
    .then(function (stream) {
        var video = document.querySelector('video');

        // Store the media stream in the video tag
        video.src = window.URL.createObjectURL(stream);
    })
    .catch(function (err) {
        console.log(err.name + ": " + err.message);
    });