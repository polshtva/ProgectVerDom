const itemImg = document.querySelectorAll(".hero__img-home");
let currentImg = 0;
let intervalId;

function imgSlider(item) {
  item[currentImg].style.display = "none";
  currentImg = (currentImg + 1) % item.length;
  item[currentImg].style.display = "block";
  item[currentImg].classList.add("hero__img-home");
}

function startSlider(item) {
  intervalId = setInterval(() => {
    imgSlider(item);
  }, 3000);
}

startSlider(itemImg);