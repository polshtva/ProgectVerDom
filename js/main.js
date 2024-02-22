function changeColorCloseButton(btn, mouseoverColor, mouseoutColor){
    btn.addEventListener('mouseover', function () {
        btn.querySelectorAll('rect').forEach(rect => {
            rect.style.fill = mouseoverColor;
        });
    });
    
    // Добавляем обработчик события для ухода курсора с элемента
    btn.addEventListener('mouseout', function () {
        btn.querySelectorAll('rect').forEach(rect => {
            rect.style.fill = mouseoutColor;
        });
    });
}

const closeButtonMenu = document.querySelector(".menu-data__close-button");
const burgerButton = document.querySelector(".burger");
const menuData = document.querySelector(".menu-data");

burgerButton.addEventListener("click", () => {
    menuData.style.display = "flex";
})

closeButtonMenu.addEventListener("click", () => {
    menuData.style.display = "none";
})

changeColorCloseButton(closeButtonMenu, "black", "white");


