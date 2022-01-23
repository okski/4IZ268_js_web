var slider, value;

$(document).ready(function () {
    slider = document.getElementById("range");
    value = document.getElementById("value");

    slider.value = sessionStorage.getItem("rotationDegree");

    value.innerHTML = slider.value;

    slider.oninput = function () {
        value.innerHTML = this.value;
    }
})

function applySettings() {
    sessionStorage.setItem("rotationDegree", value.innerHTML);
}

function saveSettings() {
    sessionStorage.setItem("rotationDegree", value.innerHTML);
    localStorage.setItem("rotationDegree", value.innerHTML);
}

function resetSettings() {
    localStorage.removeItem("rotationDegree");
    sessionStorage.setItem("rotationDegree", "5");
    slider.value = sessionStorage.getItem("rotationDegree");
    value.innerHTML =  slider.value;
}