var slider, value;

$(document).ready(function () {


    slider = document.getElementById("range");
    value = document.getElementById("value");

    if (sessionStorage.getItem("rotationDegree")) {
        slider.value = sessionStorage.getItem("rotationDegree");
    } else if (localStorage.getItem("rotationDegree")) {
        slider.value = localStorage.getItem("rotationDegree");
    } else {
        sessionStorage.setItem("rotationDegree", Number("5"));
        slider.value = sessionStorage.getItem("rotationDegree");
    }

    value.innerHTML = slider.value;

    slider.oninput = function () {
        value.innerHTML = this.value;
    }
})

function applySettings() {
    sessionStorage.setItem("rotationDegree", Number(value.innerHTML));
}

function saveSettings() {
    sessionStorage.setItem("rotationDegree", Number(value.innerHTML));
    localStorage.setItem("rotationDegree", Number(value.innerHTML));
}

function resetSettings() {
    localStorage.removeItem("rotationDegree");
    sessionStorage.removeItem("rotationDegree");
    // sessionStorage.setItem("rotationDegree", Number("5"));
    slider.value = sessionStorage.getItem("rotationDegree");
    value.innerHTML =  slider.value;
}