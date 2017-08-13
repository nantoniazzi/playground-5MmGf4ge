// { autofold
'use strict';

var localStream; // medial (webcam) local stream
var peer1; // peer connection 1
var peer2; // peer connection 2

var callButton = document.getElementById('callButton');
var hangupButton = document.getElementById('hangupButton');
var localVideo = document.getElementById('localVideo');
var remoteVideo = document.getElementById('remoteVideo');

var offerOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
}

callButton.disabled = false;
hangupButton.disabled = true;

// Acquire the media inputs, display it and store it in localStream
// (to send the stream accross the peer connection)
navigator.mediaDevices.getUserMedia({ audio: false, video: true })
    .then(function (stream) {
        localVideo.srcObject = localStream = stream;
    })

callButton.onclick = function () {
    callButton.disabled = true;
    hangupButton.disabled = false;

    // Objects containing information about STUN and TURN servers
    // We do not use it yet. STUN and TURN servers are explained later
    var servers = null;
// }

    // We simulate 2 clients (local and remote), each one use a peer connection

    // We create 2 Peer connections, one for each peer
    // (This is for a demo purpose, usually, you only have 1 peer connection)
    // The "servers" parameter will be explained later
    peer1 = new RTCPeerConnection(servers);
    peer2 = new RTCPeerConnection(servers);

    // We send the local stream into the peer connection
    peer1.addStream(localStream);

    // Creates an offer which will generate a SDP (Session Description Protocol).
    // The SDP contains all informations attached to the session like codecs, supported
    // options, and the list of all the already connected candidadtes.
    peer1.createOffer().then(function (desc) {
        // console.log('offer description', desc);
        // Uncomment the previous line to inspect the value of the desc.sdp;

        // We attach the desc as local description of peer1
        peer1.setLocalDescription(desc);
        
        // Now we should send the desc.dsp information to the peer2 (process of signaling,
        // described in the next chapter). For the demo purppose, we assume that it is
        // done and that we can assign the peer1 sdp as the the remote description on peer2
        peer2.setRemoteDescription(desc);

        // To complete the negociation, peer2 answer to the peer1 offer
        peer2.createAnswer().then(function (desc) {
            // Create answer generate the SDP of peer2. We assign the local description
            // value to peer2 and we should send the peer2 desc to peer1
            peer2.setLocalDescription(desc);
            
            // We assume that we have transfered the peer2 DSP to peer1 using a network mechanism
            peer1.setRemoteDescription(desc);
        });
    });

    peer2.onaddstream = function (e) { remoteVideo.srcObject = e.stream; }
    peer1.onicecandidate = function (e) { peer2.addIceCandidate(new RTCIceCandidate(e.candidate)); };
    peer2.onicecandidate = function (e) { peer1.addIceCandidate(new RTCIceCandidate(e.candidate)); };

// { autofold    
};

hangupButton.onclick = function () {
    peer1.close();
    peer2.close();
    peer1 = null;
    peer2 = null;
    hangupButton.disabled = true;
    callButton.disabled = false;
};

// }