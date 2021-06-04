// class to handle typing indicator timing
class TypingTimer {
    constructor( typingElement ){
        this.timeRemaining = 0;
        this.typingElement = typingElement;
    }

    start = () => {
        this.timeRemaining = 5;
        this.updateTimer();
        this.interval = setInterval(this.updateTimer, 1000);
        //start showing typing
        this.typingElement.textContent = 'Typing...';   
    }

    updateTimer = () =>{
        if(this.timeRemaining <= 0){
            clearInterval(this.interval);
            // stop showing typing
            this.typingElement.textContent = '';
        }else{
            this.timeRemaining -= 1;
        }
    }

    stopTimer = () => {
      this.timeRemaining = 0;
      clearInterval(this.interval);
      this.typingElement.textContent = '';
    }
}


window.addEventListener("DOMContentLoaded", () => {
  function log(message) {
    document.getElementById("log").textContent += message + "\n";
  }

  // init Bugout with room name
  var b = new Bugout("yes-And", {
    announce: [
      "wss://tracker.openwebtorrent.com",
      "wss://tracker.btorrent.xyz",
      "wss://tracker.fastcast.nz",
      "wss://hub.bugout.link",
      "wss://tracker.webtorrent.io",
      "wss://tracker.sloppyta.co",
      "wss://video.blender.org",
      "wss://tube.privacytools.io",
      "wss://tracker.files.fm",
      "wss://peertube.cpy.re",
      "wss://open.tube",
      "ws://tracker.sloppyta.co",
      "ws://tracker.files.fm",
      "ws://hub.bugout.link",
    ],
  });

  // init user nickname
  const userNickname = generateName();

  // init unique user ID
  const userID = getRandomInt(0, 99999);

  // someone joins room handler
  b.once("seen", function () {
    log(" Adventure buddy joined \n ----------------------\n");
  });

  // write my adress on screen
  log(" Welcome to your Yes And adventure, here are the rules...\n");
  log(" Your nickname is: " + userNickname + "\n");

  // init typing indicator timer
  const typingIndicatorTimer = new TypingTimer(document.getElementById('typing'));

  // this function handles typing indication when needed
  function typingIndicatorHandler(senderId, finishedTyping){
    if(finishedTyping){
      typingIndicatorTimer.stopTimer();
    } else {
      if( senderId != userID ){
        if(typingIndicatorTimer.timeRemaining <= 0){
            typingIndicatorTimer.start();
        }else{
            typingIndicatorTimer.timeRemaining = 5;
        }
      }
    }
  }

  // message written in room handler
  b.on("message", function (address, message) {
    // the other user is typing
    if (message.startsWith("typing...")) {
        const senderId = message.split(":")[1];
        typingIndicatorHandler(senderId, finishedTyping=false);
    } else {
      typingIndicatorHandler(userID, finishedTyping=true);
      // regular message
      log(message);
    }
  });

  // if a partner left
  b.on("left", function (address) {
    log("Partner left");
  });

  // send message handler
  // the message is written to log element
  document.getElementById("input").onkeydown = function (ev) {
    // enter was pressed
    if (ev.keyCode == 13) {
      if (b.lastwirecount) {
        // helping start the convo

        if (document.getElementById("input").innerHTML == "help") {
          b.send(
            "[" +
              getTimestamp() +
              "]" +
              " " +
              userNickname +
              ": " +
              generateAdventure()
          );
        } else {
          // regular message
          b.send(
            "[" +
              getTimestamp() +
              "]" +
              " " +
              userNickname +
              ": " +
              ev.target.textContent
          );
        }
      }
      ev.target.textContent = "";
      ev.preventDefault();
    } else {
      // if backspace not pressed
      if (ev.keyCode != 8) {
        b.send("typing...:" + userID);
      }
    }
  };

  // send button
  document.querySelector("#btnSend").addEventListener("click", (ev) => {
    if (b.lastwirecount) {
      if (document.getElementById("input").innerHTML == "help") {
        b.send(
          "[" +
            getTimestamp() +
            "]" +
            " " +
            userNickname +
            ": " +
            generateAdventure()
        );
      } else {
        b.send(
          "[" +
            getTimestamp() +
            "]" +
            " " +
            userNickname +
            ": " +
            document.getElementById("input").innerHTML
        );
      }
    }
    document.getElementById("input").innerHTML = "";
    document.getElementById("input").focus();
    ev.preventDefault();
  });

  // save file to local computer
  const downloadToFile = (content, filename, contentType) => {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });

    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();

    URL.revokeObjectURL(a.href);
  };

  // save button
  document.querySelector("#btnSave").addEventListener("click", () => {
    const convoArea = document.getElementById("log");

    downloadToFile(convoArea.textContent, "transcript-file.txt", "text/plain");
  });

  // get Israel current time
  function getTimestamp() {
    var event = new Date();
    return event
      .toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" })
      .split(",")[1];
  }

  // random name generator
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function getRandomName() {
    var nameList = [
      "Alice",
      "Bob",
      "Carel",
      "Dan",
      "Ester",
      "Frank",
      "Ivan",
      "Jack",
      "Kim",
      "Liam",
      "Monica",
      "Nico",
      "Omer",
    ];
    var name = nameList[getRandomInt(0, nameList.length + 1)];
    return name;
  }

  // get random advernture
  function getRandomAdventure() {
    var adventurList = [
      "Remamber last week we were on a boat?",
      "Remamber yesterday we were in the zoo?",
      "Remember two years ago when we fought a tiger?",
      "Remamber when we were kids and won the lottery?",
      "Remember six months ago when we landed on the moon?",
      "Remamber last Passover we were in quarantine?",
    ];
    var adventure = adventurList[getRandomInt(0, adventurList.length + 1)];
    return adventure;
  }

  function generateAdventure() {
    let adventure;
    let i = 0;
    while ((adventure = getRandomAdventure()) == undefined) {
      adventure = getRandomAdventure();
      if (i > 9) {
        adventure =
          "Remember exactly one year ago when we won the vollyball championship?";
      }
      i++;
    }
    return adventure;
  }

  function generateName() {
    let nickname;
    let i = 0;
    while ((nickname = getRandomName()) == undefined) {
      nickname = getRandomName();
      if (i > 9) {
        nickname = "Arik";
      }
      i++;
    }
    return nickname;
  }

  // speech to text
  window.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("btnSpeech");
    const result = document.getElementById("input");
    // const main = document.getElementsByTagName("body")[0];
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (typeof SpeechRecognition === "undefined") {
      button.remove();
      const message = document.getElementById("message");
      message.removeAttribute("hidden");
      message.setAttribute("aria-hidden", "false");
    } else {
      let listening = false;
      const recognition = new SpeechRecognition();
      const start = () => {
        recognition.start();
        button.textContent = "Stop listening";
        // main.classList.add("speaking");
      };
      const stop = () => {
        recognition.stop();
        button.textContent = "Start listening";
        // main.classList.remove("speaking");
      };
      const onResult = (event) => {
        result.innerHTML = "";
        for (const res of event.results) {
          const text = document.createTextNode(res[0].transcript);
          const p = document.createElement("p");
          if (res.isFinal) {
            p.classList.add("final");
          }
          p.appendChild(text);
          result.appendChild(p);
        }
      };
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.addEventListener("result", onResult);

      button.addEventListener("click", () => {
        listening ? stop() : start();
        listening = !listening;
      });
    }
  });
});
