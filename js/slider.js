document.addEventListener("DOMContentLoaded", function () {
  const carusel = document.querySelector(".carusel");
  const arrowIcons = document.querySelectorAll(".home-slider i");
  const bottomArrowIcons = document.querySelectorAll(".slider-controls i");
  const listImg = carusel.querySelectorAll("img");
  const wrapper = document.querySelector(".home-slider");
  const dotsContainer = document.querySelector(".slider-dots");

  // Создаем точки-индикаторы
  function createDots() {
    dotsContainer.innerHTML = "";
    // Для мобильных устройств создаем точки
    if (window.innerWidth <= 900) {
      for (let i = 0; i < listImg.length; i++) {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => {
          goToSlide(i);
        });
        dotsContainer.appendChild(dot);
      }
    }
  }

  // Переход к определенному слайду
  function goToSlide(index) {
    if (window.innerWidth <= 900) {
      // На мобильных - скроллим к конкретному изображению
      listImg[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    } else {
      // На десктопе - используем старый метод
      const imgWidth = listImg[0].clientWidth + 14;
      carusel.scrollLeft = imgWidth * index;
    }
    updateDots(index);
  }

  // Обновление активной точки
  function updateDots(activeIndex) {
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  // Определяем, на каком слайде мы находимся
  function getCurrentSlideIndex() {
    if (window.innerWidth <= 900) {
      // На мобильных - используем Intersection Observer для точного определения
      for (let i = 0; i < listImg.length; i++) {
        const img = listImg[i];
        const rect = img.getBoundingClientRect();
        if (rect.left >= 0 && rect.right <= window.innerWidth) {
          return i;
        }
      }
      // Если не нашли точного совпадения, возвращаем приблизительный индекс
      return Math.round(carusel.scrollLeft / carusel.offsetWidth);
    } else {
      // На десктопе - используем старый метод
      const imgWidth = listImg[0].clientWidth + 14;
      return Math.round(carusel.scrollLeft / imgWidth);
    }
  }

  // Обработчики для стрелок
  function setupArrowListeners(arrows) {
    arrows.forEach((icon) => {
      icon.addEventListener("click", () => {
        const currentIndex = getCurrentSlideIndex();
        let targetIndex;

        if (icon.id.includes("left")) {
          targetIndex = Math.max(0, currentIndex - 1);
        } else {
          targetIndex = Math.min(listImg.length - 1, currentIndex + 1);
        }

        goToSlide(targetIndex);
      });
    });
  }

  // Настройка обработчиков для всех стрелок
  setupArrowListeners(arrowIcons);
  setupArrowListeners(bottomArrowIcons);

  // Функция для изменения цвета кнопки закрытия
  function changeColorCloseButton(svgElement, defaultColor, hoverColor) {
    const paths = svgElement.querySelectorAll("rect");
    paths.forEach((path) => {
      path.setAttribute("fill", defaultColor);
    });

    svgElement.addEventListener("mouseover", () => {
      paths.forEach((path) => {
        path.setAttribute("fill", hoverColor);
      });
    });

    svgElement.addEventListener("mouseout", () => {
      paths.forEach((path) => {
        path.setAttribute("fill", defaultColor);
      });
    });
  }

  // Событие клика на картинку
  carusel.addEventListener("click", (event) => {
    const target = event.target;

    // Проверка, что кликнули по картинке
    if (target.tagName.toLowerCase() === "img") {
      const overlay = document.querySelector(".overlay");
      overlay.style.display = "block";

      // Создаем элемент для увеличенной картинки
      const enlargedImg = document.createElement("img");
      enlargedImg.src = target.src;
      enlargedImg.classList.add("enlarged-img");

      // Добавляем элемент в body
      document.body.appendChild(enlargedImg);

      // Создаем кнопку для закрытия
      const closeButton = document.createElement("button");
      closeButton.innerHTML = `<svg class="closeIcon" viewBox="0 0 31 31" width="31" height="31" xmlns="http://www.w3.org/2000/svg" fill="none">
                    <rect x="8.45361" y="7.39648" width="21.1548" height="1.4944" rx="0.747199" transform="rotate(45 8.45361 7.39648)" fill="#FAB005"/>
                    <rect x="23.8285" y="7.97754" width="22.416" height="1.41032" rx="0.705159" transform="rotate(135 23.8285 7.97754)" fill="#FAB005"/>
                </svg>`;

      closeButton.classList.add("close-button");
      document.body.appendChild(closeButton);

      const svgElement = closeButton.querySelector(".closeIcon");
      changeColorCloseButton(svgElement, "white", "#FAB005");

      // Добавляем событие на кнопку для закрытия
      function closeModal() {
        document.body.removeChild(enlargedImg);
        document.body.removeChild(closeButton);
        overlay.style.display = "none";

        // Удаляем обработчики событий
        overlay.removeEventListener("click", closeModal);
        document.removeEventListener("keydown", handleKeyDown);
      }

      // Закрытие по клику на overlay
      overlay.addEventListener("click", closeModal);

      // Закрытие по клавише Esc
      function handleKeyDown(e) {
        if (e.key === "Escape") {
          closeModal();
        }
      }
      document.addEventListener("keydown", handleKeyDown);

      closeButton.addEventListener("click", closeModal);
    }
  });

  // Обновление позиции точек при скролле
  carusel.addEventListener("scroll", () => {
    if (window.innerWidth <= 900) {
      // Используем debounce для оптимизации
      clearTimeout(carusel.scrollTimeout);
      carusel.scrollTimeout = setTimeout(() => {
        updateDots(getCurrentSlideIndex());
      }, 100);
    }
  });

  // Инициализация точек при загрузке
  createDots();

  // Обновление точек при изменении размера окна
  window.addEventListener("resize", createDots);

  // Перетаскивание для мобильных устройств
  let isDragStart = false,
    prevPageX,
    prevScrollLeft;

  const dragStart = (e) => {
    isDragStart = true;
    prevPageX = e.pageX || e.touches[0].pageX;
    prevScrollLeft = carusel.scrollLeft;
  };

  const dragging = (e) => {
    if (!isDragStart) return;
    e.preventDefault();
    let positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
    carusel.scrollLeft = prevScrollLeft - positionDiff;
  };

  const dragStop = () => {
    isDragStart = false;

    // После завершения перетаскивания, примагничиваемся к ближайшему слайду
    if (window.innerWidth <= 900) {
      const currentIndex = getCurrentSlideIndex();
      goToSlide(currentIndex);
    }
  };

  carusel.addEventListener("mousedown", dragStart);
  carusel.addEventListener("touchstart", dragStart);

  carusel.addEventListener("mousemove", dragging);
  carusel.addEventListener("touchmove", dragging);

  carusel.addEventListener("mouseup", dragStop);
  carusel.addEventListener("mouseleave", dragStop);
  carusel.addEventListener("touchend", dragStop);
});
