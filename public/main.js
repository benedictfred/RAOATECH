const inputElements = [...document.querySelectorAll("input.code-input")];
const fullName = document.getElementById("name");
const job = document.getElementById("job");
const email = document.getElementById("email");
const id = document.getElementById("id");
const registerBtn = document.querySelector(".register__submit");
const formRegister = document.querySelector(".register__form");
const emailText = document.querySelector(".email__actual");
const loginEmail = document.querySelector(".login__email");
const loginId = document.querySelector(".login__id");
const formLogin = document.querySelector(".login__form");
const errorMessage = document.getElementById("error-message");
const fillMessage = document.querySelector(".fill__message");
const checkinDetails = document.querySelector(".details");
const dashboard = document.querySelector(".dash__main");
const checkinBtn = document.querySelector(".checkin__btn");
const verifyEmail = document.querySelector(".verify__email");
let formData = {};
const resendLink = document.querySelector(".timer__reset");
const countdownElement = document.getElementById("countdown");
const circleWrap = document.querySelector(".circle-wrap");
const loaderIndex = document.querySelector(".preloader");
const loaderRegister = document.querySelector(".preloader__register");
const loaderLogin = document.querySelector(".preloader__login");
const welcome = document.querySelector(".welcome");
let countdownInterval;
const showError = function () {
  errorMessage.classList.remove("hidden");
  errorMessage.classList.add("slide-in");
};

const hideError = function () {
  errorMessage.classList.remove("slide-in");
  errorMessage.classList.add("hidden");
};
const showFillMessage = function () {
  fillMessage.classList.remove("hidden");
  fillMessage.classList.add("slide-in");
  setTimeout(() => {
    fillMessage.classList.remove("slide-in");
    fillMessage.classList.add("hidden");
  }, 3000);
};
window.addEventListener("load", function () {
  if (loaderIndex) {
    this.setTimeout(() => loaderIndex.classList.add("hidden"), 2000);
  }
  if (loaderRegister) {
    this.setTimeout(() => loaderRegister.classList.add("hidden"), 2000);
  }
});
window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    loaderLogin.classList.add("hidden");
    loaderLogin.style.display = "none";
  }
});

inputElements.forEach((ele, index) => {
  ele.addEventListener("keydown", (e) => {
    if (e.keyCode === 8 && e.target.value === "") {
      inputElements[Math.max(0, index - 1)].focus();
    }
  });

  ele.addEventListener("input", (e) => {
    const [first, ...rest] = e.target.value;
    e.target.value = first ?? "";
    const lastInputBox = index === inputElements.length - 1;
    const didInsertContent = first !== undefined;
    if (didInsertContent && !lastInputBox) {
      inputElements[index + 1].focus();
      inputElements[index + 1].value = rest.join("");
      inputElements[index + 1].dispatchEvent(new Event("input"));
    }
  });

  ele.addEventListener("paste", (e) => {
    const paste = (e.clipboardData || window.clipboardData).getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, pasteIndex) => {
      if (index + pasteIndex < inputElements.length) {
        inputElements[index + pasteIndex].value = char;
        inputElements[index + pasteIndex].dispatchEvent(new Event("input"));
      }
    });
    e.preventDefault();
  });
});

// function onSubmit(e) {
//   e.preventDefault();
//   const code = inputElements.map(({ value }) => value).join("");
//   console.log(code);
// }
let duration = 60;
let remainingTime = duration;
function loadSavedData() {
  const savedTime = localStorage.getItem("remainingTime");
  const savedTimestamp = localStorage.getItem("timestamp");

  if (savedTime && savedTimestamp) {
    const elapsed = Math.floor((Date.now() - parseInt(savedTimestamp)) / 1000);
    remainingTime = parseInt(savedTime) - elapsed;

    if (remainingTime <= 0) {
      remainingTime = duration;
      clearSavedData();
    }
  } else {
    remainingTime = duration;
  }

  countdownElement.innerHTML = remainingTime;
  const percentage = (360 * remainingTime) / duration;
  circleWrap.style.setProperty("--percentage", `${percentage}deg`);
}

function saveData() {
  localStorage.setItem("remainingTime", remainingTime);
  localStorage.setItem("timestamp", Date.now());
}

function clearSavedData() {
  localStorage.removeItem("remainingTime");
  localStorage.removeItem("timestamp");
}

function updateCountdown() {
  if (remainingTime > 0) {
    remainingTime--;
    countdownElement.innerHTML = remainingTime;
    const percentage = (360 * remainingTime) / duration;
    circleWrap.style.setProperty("--percentage", `${percentage}deg`);
    saveData();
  } else {
    clearInterval(countdownInterval);
    circleWrap.style.setProperty("--percentage", `360deg`);
    countdownElement.innerHTML = duration;
    resendLink.removeAttribute("disabled");
    resendLink.href = "#";
    resendLink.style.opacity = 1;
    clearSavedData();
  }
}

function startCountdown() {
  remainingTime = duration;
  countdownElement.innerHTML = remainingTime;
  countdownInterval = setInterval(updateCountdown, 1000);
  saveData();
  localStorage.setItem("remainingTime", remainingTime);
  localStorage.setItem("hasStartedCountdown", "true");
}

function refreshWhileCountdown() {
  const localRemainingTime = localStorage.getItem("remainingTime");
  remainingTime = localRemainingTime;
  countdownInterval = setInterval(updateCountdown, 1000);
  resendLink.setAttribute("disabled", "true");
  resendLink.href = "javascript:void(0);";
  resendLink.style.opacity = 0.5;
}

if (resendLink && countdownElement) {
  if (!localStorage.getItem("hasStartedCountdown")) {
    circleWrap.style.setProperty("--percentage", `360deg`);
    startCountdown();
    resendLink.setAttribute("disabled", "true");
    resendLink.href = "javascript:void(0);";
    resendLink.style.opacity = 0.5;
  } else {
    loadSavedData();
    refreshWhileCountdown();
  }

  resendLink.addEventListener("click", function (e) {
    if (resendLink.hasAttribute("disabled")) {
      e.preventDefault();
    } else {
      resendLink.setAttribute("disabled", "true");
      resendLink.href = "javascript:void(0);";
      resendLink.style.opacity = 0.5;
      clearInterval(countdownInterval);
      startCountdown();
    }
  });
}

if (formRegister) {
  formRegister.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!fullName.value || !job.value || !email.value || !id.value) {
      showFillMessage();
    } else {
      formData = {
        fullName: fullName.value,
        job: job.value,
        email: email.value,
        id: id.value,
      };
      localStorage.setItem("formData", JSON.stringify(formData));
      window.location.href = "verify.html";
    }
  });
}
if (formLogin) {
  formLogin.addEventListener("submit", function (e) {
    e.preventDefault();
    const storedData = JSON.parse(localStorage.getItem("formData"));
    if (!loginEmail.value || !loginId.value) {
      showFillMessage();
    } else if (
      loginEmail.value !== storedData.email ||
      loginId.value !== storedData.id
    ) {
      showError();
      setTimeout(() => hideError(), 3000);
    } else {
      loaderLogin.classList.remove("hidden");
      setTimeout(() => (window.location.href = "dashboard.html"), 1000);
    }
  });
}

// const verifyBtn = document.querySelector(".verify__btn");
// if (verifyBtn) {
//   verifyBtn.addEventListener("click", function () {
//     window.location.href = "reset.html";
//   });
// }

// if (emailText) {
//   const storedFormData = localStorage.getItem("formData");
//   if (storedFormData) {
//     const formData = JSON.parse(storedFormData);
//     const [padded, others] = formData.email.split("@");
//     const masked = "*".repeat(4) + padded.slice(3) + "@" + others;
//     emailText.textContent = masked;
//   }
// }

const formatTime = function (date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const meridian = hours > 12 ? "pm" : "am";
  const strMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${strMinutes} ${meridian}`;
};

const setCheckinTime = function () {
  const now = new Date();
  const formattedTime = formatTime(now);
  localStorage.setItem("checkinTime", formattedTime);
};

if (checkinDetails) {
  const storedData = JSON.parse(localStorage.getItem("formData"));
  const storedCheckinTime = localStorage.getItem("checkinTime");

  const html = ` <p>Login Details</p>
          <p>Name: ${storedData.fullName} </p>
          <p>Time of Check-in: ${storedCheckinTime}</p>
          <p>Time of Check-out: N/A</p> `;

  checkinDetails.insertAdjacentHTML("beforeend", html);
}

if (dashboard) {
  checkinBtn.addEventListener("click", function () {
    setCheckinTime();
  });
}
const verifyEmailBtn = document.querySelector(".verify__email--btn");
if (verifyEmail) {
  const storedEmail = JSON.parse(localStorage.getItem("formData"));
  verifyEmail.value = storedEmail.email;

  verifyEmailBtn.addEventListener("click", function () {
    localStorage.removeItem("hasStartedCountdown");
    window.location.href = "reset.html";
  });
}
