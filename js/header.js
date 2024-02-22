let menuItem = document.querySelectorAll(".nav__list .nav__item");
let firstItem = menuItem[0];

menuItem.forEach((element, index) => {
    element.addEventListener("mouseover", () => {
        if (index != 0) {
            firstItem.style.color = "black";
        }
    });
    
    element.addEventListener("mouseout", () => {
        firstItem.style.color = "#EAAF57";
    });
});
