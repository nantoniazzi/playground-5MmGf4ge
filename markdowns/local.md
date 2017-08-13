# Welcome!

The source code is on [GitHub](https://github.com/nantoniazzi/build-skype-in-30-minutes), please feel free
to come up with proposals to improve it.

In this playground, we will see how to use WebRTC to create a simple skype-like web application to make video calls.

*Note: you need a local webcam for this playground to work.*

# WebRTC

WebRTC is a set of APIs and protocols which allow easy streaming of video and audio directly
from local cameras and microphones to someone else's browser.

Is it now supported by all major browsers.

At the client level, WebRTC is implemented through two APIs: `MediaStream` and `RTCPeerConnection`

# MediaStream

The MediaStream API provides access to the media streams of local cameras and microphones.

Once you get hold of a MediaStream object you can either output it into a video or audio HTML element or send it to another
peer using the RTCPeerConnection API.

## Rendering the webcam stream into a &lt;video&gt; element

The `getUserMedia()` method is the primary way to access local input devices.

```javascript
var promise = navigator.mediaDevices.getUserMedia(constraints);
```

Let's create a simple WebRTC application: within a video HTML element we display the local webcam feed. The browser will
take care of asking the user permission to use the webcam.

@[Webcam demo]({"stubs":["local/sample1/client.js"], "command":"sh /project/target/local/sample1/run.sh"})

> We call the `getUserMedia` function which returns a promise providing the stream originating from the user's device.
Then we load our stream into the video element using `window.URL.createObjectURL` which creates a URL representing
the object given as a parameter.

# RTCPeerConnection

The RTCPeerConnection API is at the core of the peer-to-peer mechanism allowing to stream between browsers.
To create the RTCPeerConnection object simply write

```javascript
var peer = RTCPeerConnection(configuration);
```

## Sending a video stream to a peer

@[Webcam demo]({"stubs":["local/sample2/client.js", "local/sample2/index.html", "local/sample2/main.css"], "command":"sh /project/target/local/sample2/run.sh"})

In this example we connect two peers within the same browser, simulating a local to remote connection.

The local stream obtained using `getUserMedia` is sent from `peer1` (local, caller) to `peer2` (remote, callee).

The local stream and the stream from peer2 are both displayed in `<video>` elements.

## Caller

```javascript
// servers is an optional config parameter (STUN and TURN servers configuration, will be explained in a more advanced playground)
peer1 = new RTCPeerConnection(servers);
peer1.addStream(localStream);
peer1.onaddstream = function(e) {
  video1.src = URL.createObjectURL(e.stream);
};
```

## Callee

Create `peer2` and, when the stream from `peer1` is added, display it in a video element:

```javascript
peer2 = new RTCPeerConnection(servers);
peer2.onaddstream = function(e) {
  video2.src = URL.createObjectURL(e.stream);
};
```

## Offer/Answer between peer1 and peer2

`peer1` and `peer2` must go through the **Offer/Answer** protocol defined by WebRTC to exchange critical information regarding their capabilities and parameters
(use of udp or tcp?, what is my IP address? what is the format of my stream?, etc.)

The exchange is called **Signaling** and is done through a **Signal Channel** which is usually a web server using WebSockets.

In our simple example, however, everything is done within the same web page and the exchange is done directly in the code without the need to serialize data.

```javascript
peer1.createOffer(function(offer) {
  peer1.setLocalDescription(offer);
  peer2.setRemoteDescription(offer);
  peer2.createAnswer(function(answer) {
    peer2.setLocalDescription(answer);
    peer1.setRemoteDescription(answer);
  };
});
```

## ICE Candidates

A final part of the protocol is the exchange of ICE Candidates between the peers. Technically this is the result of the Offer/Answer: once each peer knows about the capabilities of the other peer, they agree on the proper way to communicate by each sending an `RTCIceCandidate` to the other peer.

The exchange also goes through the Signal Channel. Again, for this example, the Signal Channel is non-existant of both peers operate on the same Web Page and there is no need to go through a server.

```javascript
peer1.onicecandidate = function (e) { peer2.addIceCandidate(new RTCIceCandidate(e.candidate)); };
peer2.onicecandidate = function (e) { peer1.addIceCandidate(new RTCIceCandidate(e.candidate)); };
```
