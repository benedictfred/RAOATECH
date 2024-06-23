const inputElements = [...document.querySelectorAll("input.code-input")];
const fullName = document.getElementById("name");
const job = document.getElementById("job");
const email = document.getElementById("email");
const id = document.getElementById("id");
const register__btn = document.querySelector(".register__submit");
const formRegister = document.querySelector(".register__form");
const emailText = document.querySelector(".email__actual");
const loginEmail = document.querySelector(".login__email");
const loginId = document.querySelector(".login__id");
const formLogin = document.querySelector(".login__form");
const errorMessage = document.getElementById("error-message");
const fillMessage = document.querySelector(".fill__message");
const checkinDetails = document.querySelector(".details");
let formData = {};
const data = [];
const resendLink = document.querySelector(".timer__reset");
const timerElement = document.querySelector(".timer");
const loaderIndex = document.querySelector(".preloader");
const loaderRegister = document.querySelector(".preloader__register");
const loaderLogin = document.querySelector(".preloader__login");
const welcome = document.querySelector(".welcome");
let countdown = 60;
let timerInterval;
function showError() {
  errorMessage.classList.remove("hidden");
  errorMessage.classList.add("slide-in");
}

function hideError() {
  errorMessage.classList.remove("slide-in");
  errorMessage.classList.add("hidden");
}
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
  if (loaderLogin) {
    loaderLogin.classList.add("hidden");
  }
});

// inputElements.forEach((ele, index) => {
//   ele.addEventListener("keydown", (e) => {
//     if (e.keyCode === 8 && e.target.value === "") {
//       inputElements[Math.max(0, index - 1)].focus();
//     }
//   });

//   ele.addEventListener("input", (e) => {
//     const [first, ...rest] = e.target.value;
//     e.target.value = first ?? "";
//     const lastInputBox = index === inputElements.length - 1;
//     const didInsertContent = first !== undefined;
//     if (didInsertContent && !lastInputBox) {
//       inputElements[index + 1].focus();
//       inputElements[index + 1].value = rest.join("");
//       inputElements[index + 1].dispatchEvent(new Event("input"));
//     }
//   });

//   ele.addEventListener("paste", (e) => {
//     const paste = (e.clipboardData || window.clipboardData).getData("text");
//     const pasteArray = paste.split("");
//     pasteArray.forEach((char, pasteIndex) => {
//       if (index + pasteIndex < inputElements.length) {
//         inputElements[index + pasteIndex].value = char;
//         inputElements[index + pasteIndex].dispatchEvent(new Event("input"));
//       }
//     });
//     e.preventDefault();
//   });
// });

// function onSubmit(e) {
//   e.preventDefault();
//   const code = inputElements.map(({ value }) => value).join("");
//   console.log(code);
// }

// const updateTimer = () => {
//   if (countdown > 0) {
//     countdown--;
//     timerElement.textContent = `${countdown}s`;
//   } else {
//     clearInterval(timerInterval);
//     timerElement.textContent = " ";
//     resendLink.removeAttribute("disabled");
//     resendLink.href = "#";
//     resendLink.style.opacity = 1;
//   }
// };

// if (resendLink && timerElement) {
//   resendLink.setAttribute("disabled", "true");
//   resendLink.removeAttribute("href");
//   timerElement.style.opacity = 1;
//   resendLink.style.opacity = 0.5;
//   timerElement.textContent = `${countdown}s`;

//   timerInterval = setInterval(updateTimer, 1000);

//   resendLink.addEventListener("click", (e) => {
//     if (resendLink.hasAttribute("disabled")) {
//       e.preventDefault();
//     } else {
//       countdown = 60;
//       resendLink.setAttribute("disabled", "true");
//       resendLink.removeAttribute("href");
//       timerElement.style.opacity = 1;
//       resendLink.style.opacity = 0.5;
//       timerElement.textContent = `${countdown}s`;
//       setInterval(updateTimer, 1000);
//     }
//   });
// }

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
      setTimeout(() => (window.location.href = "dashboard.html"), 3000);
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

const now = new Date();
const formatTime = function (date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const meridian = hours > 12 ? "pm" : "am";
  const strMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${strMinutes} ${meridian}`;
};

if (checkinDetails) {
  const storedData = JSON.parse(localStorage.getItem("formData"));
  const html = ` <p>Login Details</p>
          <p>Name: ${storedData.fullName} </p>
          <p>Time of Check-in: ${formatTime(now)}</p>
          <p>Time of Check-out: N/A</p> `;

  checkinDetails.insertAdjacentHTML("beforeend", html);
}
