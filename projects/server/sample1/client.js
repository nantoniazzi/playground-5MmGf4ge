// { autofold
'use strict';

var localStream; // medial (webcam) local stream

var localVideo = document.getElementById('localVideo');
var remoteVideo = document.getElementById('remoteVideo');
var shareUrl = document.getElementById('shareUrl');

var peer = null;

var offerOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
};

shareUrl.value = document.location.href;

var STUN = {
    'url': 'stun:35.199.31.138:3478',
};

var TURN = {
    url: 'turn:35.199.31.138:3478',
    username: 'techio',
    credential: 'techio'
};

var config = 
{
    iceServers: [STUN, TURN]
};

// }
  
var post = function(path, params) {
    var body = params ? JSON.stringify(params) : null;
    
    return fetch(path, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: body
            });
};

var get = function(path, params) {
    var body = params ? JSON.stringify(params) : null;
    
    return fetch(path, {
              headers: { 'Content-Type': 'application/json' },
              body: body
            }).then((resp) => resp.json());
}

var pollCandidates = function() {
    get('/candidates').then(function(data) {
        for(var i = 0; i < data.length; i++) {
            peer.addIceCandidate(new RTCIceCandidate(data[i]));
        }
    });

    setTimeout(pollCandidates, 1000);
}

var register = function() {
    peer = new RTCPeerConnection(config);
    peer.addStream(localStream);
    peer.onaddstream = function (e) {
        if (e.stream) remoteVideo.srcObject = e.stream;
    }
    peer.onicecandidate = function (e) {
        if(e.candidate) {
            post('/candidate', {'candidate' : e.candidate});
        }
    };
    
    post('/register').then((resp) => resp.json()).then(function(data) {
        if(data.role === 'makeOffer') {
            makeOffer();
        } else if(data.role === 'pollOffer') {
            pollOffer();
        }
    });
};

var pollAnswer = function() {
    console.log('polling answer');
    get('/answer').then(function(data) {
        if(!data.desc) {
            setTimeout(pollAnswer, 1000);
        } else {
            peer.setRemoteDescription(data.desc);
            pollCandidates();
        }
    });
};

var makeOffer = function () {
    console.log('creating an offer');
    peer.createOffer().then(function (desc) {
        console.log('offer created');
        peer.setLocalDescription(desc);
        console.log('posting offer');
        post('/offer', { desc: desc }).then(function(data) {
            console.log('offer posted');
            pollAnswer();
        });
    });
};

var pollOffer = function() {
    
    get('/offer').then(function(data) {
        if(!data.desc) {
            setTimeout(pollOffer, 1000);
        } else {
            //debugger;
            peer.setRemoteDescription(data.desc);
            peer.createAnswer().then(function(desc) {
                peer.setLocalDescription(desc);
//                peer.setRemoteDescription(data.desc);
                
                post('/answer', { desc: desc })
                then((resp) => resp.json()).then(function(data) {
                    if(data.role === 'makeOffer') {
                        makeOffer();
                    } else if(data.role === 'pollOffer') {
                        pollOffer();
                    }
                });

                pollCandidates();
            });
        }
    });
};

// Acquire the media inputs, display it and store it in localStream
// (to send the stream accross the peer connection)

navigator.mediaDevices.getUserMedia({ audio: false, video: true })
    .then(function (stream) {
        localVideo.srcObject = localStream = stream;
        register();
    });



// }
