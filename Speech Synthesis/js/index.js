const msg = new SpeechSynthesisUtterance();
let voices = []; //mảng voice này chứa những âm thanh mà ta có được từ google, nhưng hiện tại chỉ lấy được 2 voice
/**
 * Tham khảo tại: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/voice
 */

const voicesDropdown = document.querySelector('[name="voice"]'),
  options = document.querySelectorAll('[type="range"], [name="text"]'),
  speakButton = document.querySelector("#speak"),
  stopButton = document.querySelector("#stop");
msg.text = document.querySelector('[name="text"]').value; //giá trị của message (để phát ra tiếng nói) sẽ là dữ liệu mà ta ghi ở khung text

/**
 * Hàm lấy voice
 */
const body = document.querySelector("body");
function populateVoices() {
  (voices = this.getVoices()),
    (voicesDropdown.innerHTML = voices
      .filter(e => e.lang.includes("en"))
      /**
       * hàm filter: nhận đối số giống map & hoạt động giống map. callback trả về là true/false
       * nếu nó là true mảng không thay đổi nếu là false phần tử đó sẽ được lọc ra khỏi mảng ban đầu
       */
      .map(e => `<option value="${e.name}">${e.name} (${e.lang})</option>`)
      //dùng hàm map để khi ta muốn thay đổi/thêm các thuộc tính của từng đối tượng cho các object của mảng voice
      /**
       * Ví dụ tương ứng với name nào sẽ tương ứng với voice của name đó ==> đưa giá trị vào trong value của option của select bên file html
       * Hiện tại, k thể lấy nhiều hơn 2 web speech API cho voice ==> chưa sửa được vấn đề này
       */
      .join(""));
}
/**
 * Hàm set giọng nói tương ứng với option mà người dùng ch
 */
function setVoice() {
  (msg.voice = voices.find(e => e.name === this.value)), toggle();
}
function toggle(e = !0) {
  //e != 0 tương đương e == true (e ở đây là event)
  //nếu ta bấm nút speak thì ==> nói + gif wave cho background xuất hiện
  speechSynthesis.cancel(),
    e // e?true ==> hiển thị background:false==>không hiển thị background
      ? (speechSynthesis.speak(msg),
        (body.style.background = "url(img/wave.gif)"),
        (body.style.backgroundRepeat = "repeat-x"),
        (body.style.backgroundSize = "100% 100%"))
      : (body.style.background = "");
}
function setOption() {
  //hàm set option cho pitch (tông nói) và rate(tốc độ nói)
  console.log(this.name, this.value),
    (msg[this.name] = this.value),
    "rate" == this.name
      ? (document.getElementById("voice_range").innerHTML = this.value)
      : "pitch" == this.name &&
        (document.getElementById("voice_pitch").innerHTML = this.value),
    toggle();
}
/**
 * Thêm sự kiện vào cho các object
 */
speechSynthesis.addEventListener("voiceschanged", populateVoices),
  voicesDropdown.addEventListener("change", setVoice),
  options.forEach(e => e.addEventListener("change", setOption)),
  speakButton.addEventListener("click", toggle),
  stopButton.addEventListener("click", () => toggle(!1));
