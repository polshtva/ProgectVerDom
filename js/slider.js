document.addEventListener("DOMContentLoaded", function () {
  const carusel = document.querySelector(".carusel");
  const arrowIcons = document.querySelectorAll(".home-slider i");
  const bottomArrowIcons = document.querySelectorAll(".slider-controls i");
  const listImg = carusel.querySelectorAll("img");
  const dotsContainer = document.querySelector(".slider-dots");

  let currentSlideIndex = 0;
  let isAnimating = false;

  // Создаем точки-индикаторы
  function createDots() {
    dotsContainer.innerHTML = "";
    if (window.innerWidth <= 900) {
      for (let i = 0; i < listImg.length; i++) {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => {
          if (!isAnimating) {
            goToSlide(i);
          }
        });
        dotsContainer.appendChild(dot);
      }
    }
  }

  // Получаем ширину одного слайда
  function getSlideWidth() {
    if (window.innerWidth <= 900) {
      // На мобильных - ширина контейнера
      return carusel.offsetWidth;
    } else {
      // На десктопе - ширина изображения + отступ
      return listImg[0].offsetWidth + 14;
    }
  }

  // Переход к определенному слайду
  function goToSlide(index) {
    if (isAnimating || index < 0 || index >= listImg.length) return;
    
    isAnimating = true;
    currentSlideIndex = index;
    
    const slideWidth = getSlideWidth();
    const scrollPosition = slideWidth * index;
    
    carusel.scrollTo({
      left: scrollPosition,
      behavior: "smooth"
    });
    
    updateDots(index);
    
    setTimeout(() => {
      isAnimating = false;
    }, 300);
  }

  // Обновление активной точки
  function updateDots(activeIndex) {
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === activeIndex);
    });
  }

  // Определяем текущий слайд на основе позиции скролла
  function getCurrentSlideIndex() {
    const scrollLeft = carusel.scrollLeft;
    const slideWidth = getSlideWidth();
    
    // Округляем до ближайшего слайда
    return Math.round(scrollLeft / slideWidth);
  }

  // Обработчики для стрелок
  function setupArrowListeners(arrows) {
    arrows.forEach((icon) => {
      icon.addEventListener("click", () => {
        if (isAnimating) return;
        
        let targetIndex;
        if (icon.id.includes("left")) {
          targetIndex = Math.max(0, currentSlideIndex - 1);
        } else {
          targetIndex = Math.min(listImg.length - 1, currentSlideIndex + 1);
        }
        
        if (targetIndex !== currentSlideIndex) {
          goToSlide(targetIndex);
        }
      });
    });
  }

  // Настройка обработчиков для всех стрелок
  setupArrowListeners(arrowIcons);
  setupArrowListeners(bottomArrowIcons);

  // Обновление индекса при скролле
  let scrollTimeout;
  carusel.addEventListener("scroll", () => {
    if (!isAnimating) {
      // Используем debounce для оптимизации
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const newIndex = getCurrentSlideIndex();
        if (newIndex !== currentSlideIndex) {
          currentSlideIndex = newIndex;
          updateDots(currentSlideIndex);
        }
      }, 100);
    }
  });

  // Touch события для улучшенного свайпа
  let touchStartX = 0;
  let touchEndX = 0;
  let isSwiping = false;

  carusel.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    isSwiping = true;
    // Временно отключаем скролл для определения жеста
    carusel.style.scrollSnapType = 'none';
  });

  carusel.addEventListener("touchmove", (e) => {
    if (!isSwiping) return;
    touchEndX = e.touches[0].clientX;
  });

  carusel.addEventListener("touchend", () => {
    if (!isSwiping || isAnimating) return;
    
    const swipeDistance = touchStartX - touchEndX;
    const minSwipeDistance = 50; // минимальное расстояние для свайпа
    
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Свайп влево - следующий слайд
        goToSlide(Math.min(listImg.length - 1, currentSlideIndex + 1));
      } else {
        // Свайп вправо - предыдущий слайд
        goToSlide(Math.max(0, currentSlideIndex - 1));
      }
    }
    
    // Восстанавливаем snap scroll
    setTimeout(() => {
      carusel.style.scrollSnapType = 'x mandatory';
    }, 300);
    
    isSwiping = false;
  });

  // Обработчик клика по картинке (модальное окно)
  carusel.addEventListener("click", (event) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === "img") {
      const overlay = document.querySelector(".overlay");
      overlay.style.display = "block";

      const enlargedImg = document.createElement("img");
      enlargedImg.src = target.src;
      enlargedImg.classList.add("enlarged-img");
      document.body.appendChild(enlargedImg);

      const closeButton = document.createElement("button");
      closeButton.innerHTML = `<svg class="closeIcon" viewBox="0 0 31 31" width="31" height="31" xmlns="http://www.w3.org/2000/svg" fill="none">
        <rect x="8.45361" y="7.39648" width="21.1548" height="1.4944" rx="0.747199" transform="rotate(45 8.45361 7.39648)" fill="#FAB005"/>
        <rect x="23.8285" y="7.97754" width="22.416" height="1.41032" rx="0.705159" transform="rotate(135 23.8285 7.97754)" fill="#FAB005"/>
      </svg>`;
      closeButton.classList.add("close-button");
      document.body.appendChild(closeButton);

      function closeModal() {
        if (document.body.contains(enlargedImg)) {
          document.body.removeChild(enlargedImg);
        }
        if (document.body.contains(closeButton)) {
          document.body.removeChild(closeButton);
        }
        overlay.style.display = "none";
        document.removeEventListener("keydown", handleKeyDown);
      }

      function handleKeyDown(e) {
        if (e.key === "Escape") closeModal();
      }

      overlay.addEventListener("click", closeModal);
      document.addEventListener("keydown", handleKeyDown);
      closeButton.addEventListener("click", closeModal);
    }
  });

  // Инициализация
  createDots();
  
  // Обработчик изменения размера окна
  window.addEventListener("resize", () => {
    createDots();
    // При изменении размера переходим к текущему слайду
    setTimeout(() => {
      goToSlide(currentSlideIndex);
    }, 100);
  });
});