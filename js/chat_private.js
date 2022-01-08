document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("chat");
  const button = document.getElementById("send-message");
  const messages = document.querySelector(".messages");
  const spiner = document.querySelector(".spinner-border");
  const connectText = document.querySelector("#alert");
  spiner.classList.remove("d-none");
  const globalUser = await User();
  const chatWith = $_GET("user");
  const usersALL = await getAllUsers();

  async function getAllUsers() {
    const req = await fetch("/api/chat/users", {
      method: "POST",
    });
    return await req.json();
  }

  async function update(date) {
    const formData = new FormData();
    formData.append("method", "update");
    formData.append("chat", chatWith);
    formData.append("date_create", date);
    const req = await fetch("/api/chat/update", {
      method: "POST",
      body: formData,
    });
    try {
      return await req.json();
    } catch (err) {
      return false;
    }
  }

  async function sendMessage() {
    const formData = new FormData(form);
    formData.append("method", "send");
    formData.append("what_a_chat", chatWith);
    formData.append("chat", globalUser["success"]);
    const req = await fetch("/api/chat/sendMessage", {
      method: "POST",
      body: formData,
    });
    return await req.json();
  }

  function $_GET(key) {
    var p = window.location.search;
    p = p.match(new RegExp(key + "=([^&=]+)"));
    return p ? p[1] : false;
  }

  async function sendRead(array) {
    const req = await fetch("/api/chat/mesRead", {
      method: "POST",
      body: JSON.stringify(array),
    });
    return await req.json();
  }

  let max;
  async function updateMessage() {
    const mess = Array.from(messages?.querySelectorAll("div"));
    const response = await update(max || 0);
    let newMes = "";
    response.length &&
      response.forEach((el) => {
        if (el["type"] == "text") {
          newMes = document.createElement("div");
          newMes.dataset.id = el["id"];
          if (el["author"] == globalUser["success"]) {
            newMes.className = "self";
          } else {
            newMes.className = "other";
          }
          let name;
          usersALL.forEach((element) => {
            if (element["id"] == el["author"]) name = element["name"];
          });
          newMes.innerText =
            formatTime(el["date_create"]) +
            "\n" +
            name +
            "\n" +
            el["message"] +
            "\n\n";
        } else if (el["type"] == "audio") {
          newMes = new Audio();
          const source = document.createElement("source");
          if (el["author"] == globalUser["success"]) {
            newMes.className = "mine";
          } else {
            newMes.className = "not-mine";
          }
          source.src = el["message"];
          source.type = "audio/webm";
          newMes.append(source);
          newMes.controls = true;
          newMes.preload = "none";
        }
        messages.append(newMes);
        if (el["is_read"] == "1" || el["author"] == globalUser["success"]) {
          newMes.scrollIntoView({ block: "center", behavior: "smooth" });
        }
        max = el["date_create"];
      });
    response.length && (await sendRead(response));
  }

  async function User() {
    const req = await fetch("/api/login/userAuth", {
      method: "POST",
      body: "",
    });
    return await req.json();
  }

  function formatTime(unix) {
    const date = new Date(unix * 1000);
    return (
      date.getDate() +
      "/" +
      date.getMonth() +
      1 +
      "/" +
      date.getFullYear() +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds()
    );
  }

  button.addEventListener("click", async (e) => {
    e.preventDefault();
    await sendMessage();
    await updateMessage();
    form.reset();
  });

  setInterval(await updateMessage, 5000);

  await updateMessage();

  audioRecorder.requestDevice(function (recorder) {
    // Create a recorder object (this will ask browser for microphone access)

    recorder.start(); // Start recording

    setTimeout(function () {
      // Stop recording after 5 seconds

      recorder.stop();

      recorder.exportMP3(function (mp3Blob) {
        // Export the recording as a Blob

        console.log("Here is your blob: " + URL.createObjectURL(mp3Blob));
        //Do something with your blob
      });
    }, 5000);
  });

  mediaRecorder.addEventListener("stop", async function () {
    const audioBlob = new Blob(audioChunks, {
      type: "audio/webm",
    });
    var mp3Data = [];

    var mp3encoder = new lamejs.Mp3Encoder(1, 44100, 128); //mono 44.1khz encode to 128kbps
    var samples = new Int16Array(44100); //one second of silence replace that with your own samples
    var mp3Tmp = mp3encoder.encodeBuffer(samples); //encode mp3

    //Push encode buffer to mp3Data variable
    mp3Data.push(mp3Tmp);

    // Get end part of mp3
    mp3Tmp = mp3encoder.flush();

    // Write last data to the output data, too
    // mp3Data contains now the complete mp3Data
    mp3Data.push(mp3Tmp);

    console.debug(mp3Data);

    let fd = new FormData();
    fd.append("voice", mp3Data);
    fd.append("what_a_chat", chatWith);
    sendVoice(fd);
    updateMessage();
    audioChunks = [];
  });

  async function sendVoice(form) {
    let promise = await fetch("/api/chat/save", {
      method: "POST",
      body: form,
    });
    let response = await promise.json();
  }
  spiner.classList.add("d-none");
  connectText.innerText =
    "Соединение установлено: Чат с " +
    usersALL.filter((el) => el["id"] == chatWith)[0]["name"];
});
