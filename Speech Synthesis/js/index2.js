const searchForm = document.querySelector("#search-form");
const searchFormInput = searchForm.querySelector("input"); // <=> document.querySelector("#search-form input") (có thể dùng 2 cách)
const info = document.querySelector(".info");

//Giao diện speech recognition nằm ở object toàn cục của trình duyệt windows
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition; // nếu không phát hiện ra giọng nói ==> gán undefined

if (SpeechRecognition) {
  console.log("Not Supported");

  const recognition = new SpeechRecognition();
  recognition.continuous = true;

  searchForm.insertAdjacentHTML(
    "beforeend",
    '<button type="button"><i class="fas fa-microphone"></i></button>'
  );
  //chèn icon microphone vào
  searchFormInput.style.paddingRight = "50px";

  const micBtn = searchForm.querySelector("button");
  const micIcon = micBtn.firstElementChild;

  micBtn.addEventListener("click", micBtnClick);
  function micBtnClick() {
    if (micIcon.classList.contains("fa-microphone")) {
      // Bắt đầu Voice Recognition
      recognition.start(); // Lần đầu tiên khi kết nối tới mic
    } else {
      recognition.stop();
    }
  }

  recognition.addEventListener("start", startSpeechRecognition); // <=> recognition.onstart = function() {...} (có 2 cách ghi)
  function startSpeechRecognition() {
    micIcon.classList.remove("fa-microphone");
    micIcon.classList.add("fa-microphone-slash");
    searchFormInput.focus();
    console.log("SPEAK!!!");
  }

  recognition.addEventListener("end", endSpeechRecognition); // <=> recognition.onend = function() {...}(có 2 cách ghi)
  function endSpeechRecognition() {
    micIcon.classList.remove("fa-microphone-slash"); //ngưng nói ==> trở lại icon microphone ban đầu
    micIcon.classList.add("fa-microphone");
    searchFormInput.focus();
    console.log("Speech recognition service disconnected");
  }

  recognition.addEventListener("result", resultOfSpeechRecognition); // <=> recognition.onresult = function(event) {...}
  function resultOfSpeechRecognition(event) {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;

    if (transcript.toLowerCase().trim() === "stop recording") {
      //dùng lệnh này để dừng record
      recognition.stop();
    } else if (!searchFormInput.value) {
      searchFormInput.value = transcript;
    } else {
      if (transcript.toLowerCase().trim() === "go") {
        //dùng lệnh này để bắt đầu search
        /**
         * phương thức trim(): Remove whitespace ở cả hai phía của chuỗi
         * ví dụ: var str = "       Hello World!        "; ==> console.log(str) ==> Hello World
         */
        searchForm.submit(); //khi submit, form bên file index2.html sẽ: dùng phương thức "get" (method = get), gọi đến hành động truy cập vào đường link của google "action = https://www.google.com/search")
      } else if (transcript.toLowerCase().trim() === "delete") {
        //dùng lệnh này để clear input và bắt đầu record lại
        searchFormInput.value = "";
      } else {
        searchFormInput.value = transcript;
      }
    }
  }

  info.textContent = 'Voice Commands: "stop recording", "delete", "go"';
} else {
  console.log(
    "Trình duyệt của bạn không hỗ trợ Speech Recognition/Oops...Your browser doesn't support Speech Recognition"
  );
  info.textContent = "Oops... Your browser doen't support Speech Recognition";
}
