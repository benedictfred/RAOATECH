const inputElements = [...document.querySelectorAll("input.code-input")];

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

function onSubmit(e) {
  e.preventDefault();
  const code = inputElements.map(({ value }) => value).join("");
  console.log(code);
}

const resendLink = document.querySelector(".timer__reset");
const timerElement = document.querySelector(".timer");
let countdown = 5;

const updateTimer = () => {
  if (countdown > 0) {
    countdown--;
    timerElement.textContent = `${countdown}s`;
  } else {
    clearInterval(timerInterval);
    timerElement.textContent = " ";
    resendLink.removeAttribute("disabled");
    resendLink.href = "#";
    resendLink.style.opacity = 1;
  }
};

resendLink.setAttribute("disabled", "true");
resendLink.removeAttribute("href");
timerElement.style.opacity = 1;
resendLink.style.opacity = 0.5;
timerElement.textContent = `${countdown}s`;

const timerInterval = setInterval(updateTimer, 1000);

resendLink.addEventListener("click", (e) => {
  if (resendLink.hasAttribute("disabled")) {
    e.preventDefault(); // Prevent default action if the link is disabled
  } else {
    // Logic to resend the code
    console.log("Code resent");
    // Restart the countdown
    countdown = 60;
    resendLink.setAttribute("disabled", "true");
    resendLink.removeAttribute("href");
    timerElement.textContent = `${countdown}s`;
    setInterval(updateTimer, 1000);
  }
});
