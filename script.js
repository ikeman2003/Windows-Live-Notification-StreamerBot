const WEBSOCKET_URI = "ws://127.0.0.1:8080/";
var maxemotes = 20;

// subscribe to Twitch events
const ws = new WebSocket(WEBSOCKET_URI);
ws.addEventListener("open", (event) => {
  console.log("Connected to Streamer.bot");

  ws.send(
    JSON.stringify({
      request: "Subscribe",
      id: "123",
      events: {
        Raw: ["SubAction"],
        Twitch: ["ChatMessage"]
      }
    })
  );
});

ws.addEventListener("message", (event) => {
  if (!event.data) return;

  const data = JSON.parse(event.data);
  console.log(event.data);
  // handle event response here
  if (!data.event || !data.event.type) return;
  //console.log(data.data.message.badges.length);

  if (data.event.type == "ChatMessage" && !data.data.meta.internal) {
    console.log(event.data);
    var user = data.data.user.name;
   // var display = data.data.message.username;
    data.data.user.badges.forEach((badges) => {
      var imageUrl = badges.imageUrl;
      var name = badges.name;
      user =
        `<img id="badge" class="${badges.name}" title="${badges.name}" src="${badges.imageUrl}">` +
        user;
    });
  var userData = user;
  localStorage.setItem('myDataKey', userData);

 
  }

  if (data.data.name == "Action (WLN)") {
    var message = data.data.arguments.message;
    if (message.length > 60) {
      message = message.substring(0, 60) + "...";
    }

    data.data.arguments.emotes.forEach((emotes) => {
      var imageUrl = emotes.imageUrl;
      var name = emotes.name;
      var end = emotes.endIndex;
      var start = emotes.startIndex;
      if (end <= 60) {
        message = message.replace(name, `<img id="emote" src="${imageUrl}">`);
      }
    });
    var pfp = data.data.arguments.targetUserProfileImageUrl;
    var broadcaster = data.data.arguments.broadcastUser; /*'Connected, Welco..';*/
    var username = localStorage.getItem('myDataKey');
    document.getElementById("message").innerHTML = message;
    document.getElementById("user").innerHTML = username;
    document.getElementById("pic").src = pfp;
    document.getElementById("broadcaster").textContent = broadcaster;
    animate()
  }
});

function animate() {
  gsap.to("#section", 0.2, {
    top: 0,
    position: "fixed",
    ease: Linear.easeNone,
    repeat: 0,
    delay: 1
  });
  setTimeout(soundPop, 500);
  gsap.to("#section", 0.2, {
    top: 320,
    position: "fixed",
    ease: Linear.easeNone,
    repeat: 0,
    delay: 5
  });
}

function soundPop() {
  var audio = new Audio("messenger-type.mp3");
  audio.volume = 1;
  audio.play();
}
