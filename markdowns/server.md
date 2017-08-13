Most WebRTC applications are not just being able to communicate through video and audio. They need many other features. In this article, we are going to build a basic signaling server.

# Signaling and Negotiation

To connect to another user you should know where he is located on the Web. The IP address of your device allows Internet-enabled devices to send data directly between each other. The RTCPeerConnection object is responsible for this. As soon as devices know how to find each other over the Internet, they start exchanging data about which protocols and codecs each device supports.

To communicate with another user you simply need to exchange contact information and the rest will be done by WebRTC. The process of connecting to the other user is also known as signaling and negotiation. It consists of a few steps

1. Create a list of potential candidates for a peer connection.
2. The user or an application selects a user to make a connection with.
3. The signaling layer notifies another user that someone want to connect to him. He can accept or decline.
4. The first user is notified of the acceptance of the offer.
5. The first user initiates RTCPeerConnection with another user.
6. Both users exchange software and hardware information through the signaling server.
7. Both users exchange location information.
8. The connection succeeds or fails.

The WebRTC specification does not contain any standards about exchanging information. So keep in mind that the above is just an example of how signaling may happen. You can use any protocol or technology you like.

# Building the Server

We are going to implement a little server dedicated in the exchange of the contact informations.

@[Server example]({"stubs":["server/sample1/server.js", "server/sample1/index.html", "server/sample1/client.js", "server/sample1/main.css", "server/sample1/run.sh"], "command": "sh /project/target/server/sample1/run.sh"})

