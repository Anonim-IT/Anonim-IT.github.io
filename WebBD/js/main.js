document.addEventListener("DOMContentLoaded", function() {
    fetch("WebBD/navbar/navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-container").innerHTML = data;
        });
});