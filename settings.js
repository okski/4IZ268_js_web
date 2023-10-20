var slider, value;

/**
 *  This initializes variables.
 */
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

/**
 *  This function save settings in session storage.
 */
function applySettings() {
    sessionStorage.setItem("rotationDegree", Number(value.innerHTML));
}

/**
 *  This function save settings in session and local storage.
 */
function saveSettings() {
    sessionStorage.setItem("rotationDegree", Number(value.innerHTML));
    localStorage.setItem("rotationDegree", Number(value.innerHTML));
}

/**
 *  This function deletes values from session and local storage and set slider to default value.
 */
function resetSettings() {
    localStorage.removeItem("rotationDegree");
    sessionStorage.removeItem("rotationDegree");
    // sessionStorage.setItem("rotationDegree", Number("5"));
    slider.value = sessionStorage.getItem("rotationDegree");
    slider.value = 5;
    value.innerHTML =  slider.value;
}