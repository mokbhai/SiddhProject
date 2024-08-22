document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("inputForm");
  const divClass = document.getElementById("divClass");
  const divId = document.getElementById("divId");
  const nextClass = document.getElementById("nextClass");
  const nextId = document.getElementById("nextId");
  const timer = document.getElementById("timer");
  const itr = document.getElementById("itr");
  const timerOutput = document.getElementById("timerOutput");
  const itrOutput = document.getElementById("itrOutput");
  const startButton = document.getElementById("startButton");

  // Load saved data
  const savedData = JSON.parse(localStorage.getItem("formData"));
  if (savedData) {
    divClass.value = savedData.divClass;
    divId.value = savedData.divId;
    nextClass.value = savedData.nextClass;
    nextId.value = savedData.nextId;
    timer.value = savedData.timer;
    itr.value = savedData.itr;
    timerOutput.innerText = savedData.timer + " seconds";
    itrOutput.innerText = savedData.itr;
  }

  timer.oninput = function () {
    timerOutput.innerText = this.value + " seconds";
  };

  itr.oninput = function () {
    itrOutput.innerText = this.value;
  };

  // Save data on button click
  startButton.addEventListener("click", function () {
    const formData = {
      divClass: divClass.value,
      divId: divId.value,
      nextClass: nextClass.value,
      nextId: nextId.value,
      timer: timer.value,
      itr: itr.value,
    };

    localStorage.setItem("formData", JSON.stringify(formData));
    console.log("Form data saved: ", formData); // Debugging line
    alert("Form data saved!");

    chrome.runtime.sendMessage({ event: "onStart" });
  });
});
