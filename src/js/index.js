const searchScrollLines = (scrollLines) => {
  let height = 0;
  scrollLines.forEach((line, index) => {
    const pos = line.getBoundingClientRect();
    if (pos.top <= 800 && !line.classList.contains("scrolled")) {
      line.classList.add("scrolled");
    } else if (pos.top > 800 && line.classList.contains("scrolled")) {
      line.classList.remove("scrolled");
    }

    line.classList.contains("scrolled") &&
      (height += line.getBoundingClientRect().height);
  });
  document.querySelector(".loader-line-full").style.height = height + "px";
};

document.addEventListener("DOMContentLoaded", () => {
  //burger
  document.querySelector(".menu-wrapper").addEventListener("click", () => {
    document.querySelector(".hamburger-menu").classList.toggle("animate");
    document.querySelector(".mobile_menu").classList.toggle("show");
  });
  //scroll
  const scrollLines = document.querySelectorAll(
    ".second-section__infoblock-scroll"
  );

  if (scrollLines.length) {
    searchScrollLines(scrollLines);

    document.addEventListener("scroll", () => {
      searchScrollLines(scrollLines);
    });
  }

  //form
  const sendAnimation = (sending) => {
    if (!sending) {
      send_button.style.display = "block";
      sending_button.style.display = "none";
    } else {
      send_button.style.display = "none";
      sending_button.style.display = "flex";
    }
  };
  const form = document.querySelector("#send-form");
  const send_button = document.querySelector("#send-button");
  const sending_button = document.querySelector(".windows8");
  const modalContainer = document.querySelector(`.container-modal`);
  const modalContainerError = document.querySelector(`.container-modal-error`);
  let sending = false;

  const formName = document.querySelector("#form-name");
  const formEmail = document.querySelector("#form-email");
  const formText = document.querySelector("#form-text");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const inputs = [
      { value: formName, span: ".error-text-name" },
      { value: formEmail, span: ".error-text-mail" },
      { value: formText, span: ".error-text-message" },
    ];

    inputs.map((el) => {
      el.value.addEventListener("keyup", () => {
        if (el.value.value.replace(/\s/g, "").length === 0) {
          document.querySelector(`${el.span}`).style.display = "block";
        } else {
          document.querySelector(`${el.span}`).style.display = "none";
        }
      });
    });

    if (
      formName.value === "" ||
      formEmail.value === "" ||
      formText.value === ""
    ) {
      if (formName.value === "")
        document.querySelector(".error-text-name").style.display = "block";

      if (formEmail.value === "")
        document.querySelector(".error-text-mail").style.display = "block";

      if (formText.value === "")
        document.querySelector(".error-text-message").style.display = "block";

      return;
    }

    sending = true;
    sendAnimation(sending);
    const formData = new FormData(form);

    let object = {};
    formData.forEach((value, key) => {
      object[key] = value;
    });
    let json = JSON.stringify(object);

    fetch("/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    })
      .then(() => {
        setTimeout(() => {
          sending = false;
          sendAnimation(sending);
          modalContainer.classList.add("view");
        }, 1000);
      })
      .catch(() => {
        setTimeout(() => {
          sending = false;
          sendAnimation(sending);
          modalContainerError.classList.add("view");
        }, 1000);
      });
  });

  //modal
  document.querySelectorAll(`.modal-close-button`).forEach((item) =>
    item.addEventListener("click", () => {
      modalContainer.classList.remove("view");
      modalContainerError.classList.remove("view");
    })
  );

  document.querySelector(`#lets-see`).addEventListener("click", () => {
    modalContainer.classList.remove("view");
  });
});

var carousel = document.querySelector(".carousel");
var carouselContent = document.querySelector(".carousel-content");
var slides = document.querySelectorAll(".slide");
var arrayOfSlides = Array.prototype.slice.call(slides);
var carouselDisplaying;
var screenSize;
setScreenSize();
var lengthOfSlide;

function addClone() {
  var lastSlide = carouselContent.lastElementChild.cloneNode(true);
  lastSlide.style.left = -lengthOfSlide + "px";
  carouselContent.insertBefore(lastSlide, carouselContent.firstChild);
}

function removeClone() {
  var firstSlide = carouselContent.firstElementChild;
  firstSlide.parentNode.removeChild(firstSlide);
}

function moveSlidesRight() {
  var slides = document.querySelectorAll(".slide");
  var slidesArray = Array.prototype.slice.call(slides);
  var width = 0;

  slidesArray.forEach(function (el, i) {
    el.style.left = width + "px";
    width += lengthOfSlide;
  });
  addClone();
}
moveSlidesRight();

function moveSlidesLeft() {
  var slides = document.querySelectorAll(".slide");
  var slidesArray = Array.prototype.slice.call(slides);
  slidesArray = slidesArray.reverse();
  var maxWidth = (slidesArray.length - 1) * lengthOfSlide;

  slidesArray.forEach(function (el, i) {
    maxWidth -= lengthOfSlide;
    el.style.left = maxWidth + "px";
  });
}

window.addEventListener("resize", setScreenSize);

function setScreenSize() {
  if (window.innerWidth >= 500) {
    carouselDisplaying = 2;
  } else if (window.innerWidth >= 300) {
    carouselDisplaying = 1;
  } else {
    carouselDisplaying = 1;
  }
  getScreenSize();
}

function getScreenSize() {
  var slides = document.querySelectorAll(".slide");
  var slidesArray = Array.prototype.slice.call(slides);
  lengthOfSlide = carousel.offsetWidth / carouselDisplaying;
  var initialWidth = -lengthOfSlide;
  slidesArray.forEach(function (el) {
    el.style.width = lengthOfSlide + "px";
    el.style.left = initialWidth + "px";
    initialWidth += lengthOfSlide;
  });
}

var rightNav = document.querySelector(".nav-right");
rightNav.addEventListener("click", moveLeft);

var moving = true;
function moveRight() {
  if (moving) {
    moving = false;
    var lastSlide = carouselContent.lastElementChild;
    lastSlide.parentNode.removeChild(lastSlide);
    carouselContent.insertBefore(lastSlide, carouselContent.firstChild);
    removeClone();
    var firstSlide = carouselContent.firstElementChild;
    firstSlide.addEventListener("transitionend", activateAgain);
    moveSlidesRight();
  }
}

function activateAgain() {
  var firstSlide = carouselContent.firstElementChild;
  moving = true;
  firstSlide.removeEventListener("transitionend", activateAgain);
}

var leftNav = document.querySelector(".nav-left");
leftNav.addEventListener("click", moveRight);

function moveLeft() {
  if (moving) {
    moving = false;
    removeClone();
    var firstSlide = carouselContent.firstElementChild;
    firstSlide.addEventListener("transitionend", replaceToEnd);
    moveSlidesLeft();
  }
}

function replaceToEnd() {
  var firstSlide = carouselContent.firstElementChild;
  firstSlide.parentNode.removeChild(firstSlide);
  carouselContent.appendChild(firstSlide);
  firstSlide.style.left = (arrayOfSlides.length - 1) * lengthOfSlide + "px";
  addClone();
  moving = true;
  firstSlide.removeEventListener("transitionend", replaceToEnd);
}

carouselContent.addEventListener("mousedown", seeMovement);

var initialX;
var initialPos;
function seeMovement(e) {
  initialX = e.clientX;
  getInitialPos();
  carouselContent.addEventListener("mousemove", slightMove);
  document.addEventListener("mouseup", moveBasedOnMouse);
}

function slightMove(e) {
  if (moving) {
    var movingX = e.clientX;
    var difference = initialX - movingX;
    if (Math.abs(difference) < lengthOfSlide / 4) {
      slightMoveSlides(difference);
    }
  }
}

function getInitialPos() {
  var slides = document.querySelectorAll(".slide");
  var slidesArray = Array.prototype.slice.call(slides);
  initialPos = [];
  slidesArray.forEach(function (el) {
    var left = Math.floor(parseInt(el.style.left.slice(0, -2)));
    initialPos.push(left);
  });
}

function slightMoveSlides(newX) {
  var slides = document.querySelectorAll(".slide");
  var slidesArray = Array.prototype.slice.call(slides);
  slidesArray.forEach(function (el, i) {
    var oldLeft = initialPos[i];
    el.style.left = oldLeft + newX + "px";
  });
}

function moveBasedOnMouse(e) {
  var finalX = e.clientX;
  if (initialX - finalX > 0) {
    moveRight();
  } else if (initialX - finalX < 0) {
    moveLeft();
  }
  document.removeEventListener("mouseup", moveBasedOnMouse);
  carouselContent.removeEventListener("mousemove", slightMove);
}
