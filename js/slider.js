const carusel = document.querySelector(".carusel");
const arrowIcons = document.querySelectorAll(".home-slider i");
const firstImg = carusel.querySelectorAll("img")[0];

const listImg = carusel.querySelectorAll("img");

const wrapper = document.querySelector(".home-slider");

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


        // Добавляем элемент в wrapper
        wrapper.appendChild(enlargedImg);

        // Создаем кнопку для закрытия
        const closeButton = document.createElement('button');
        closeButton.innerHTML = `<svg class="closeIcon" viewBox="0 0 31 31" width="31" height="31" xmlns="http://www.w3.org/2000/svg" fill="none">
        <rect x="8.45361" y="7.39648" width="21.1548" height="1.4944" rx="0.747199" transform="rotate(45 8.45361 7.39648)" fill="#FAB005"/>
        <rect x="23.8285" y="7.97754" width="22.416" height="1.41032" rx="0.705159" transform="rotate(135 23.8285 7.97754)" fill="#FAB005"/>
    </svg>`;

        closeButton.classList.add("close-button");
        document.body.appendChild(closeButton);

        const svgElement = closeButton.querySelector('.closeIcon');
        changeColorCloseButton(svgElement, "white", "#FAB005");
 

        // Добавляем событие на кнопку для закрытия
        closeButton.addEventListener("click", () => {
            // Удаляем увеличенную картинку и кнопку закрытия
            wrapper.removeChild(enlargedImg);
            wrapper.removeChild(closeButton);
            overlay.style.display = "none";
        });

        // Добавляем кнопку в wrapper
        wrapper.appendChild(closeButton);
    }
});

listImg.forEach(img => {
    img.addEventListener("click", (i)=>{
    
    })
})

let isDragStart = false, prevPageX, prevScrollLeft;
let firstImgWidth = firstImg.clientWidth + 14;
arrowIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        carusel.scrollLeft += icon.id == "left" ? -firstImgWidth : firstImgWidth;
    })
})

