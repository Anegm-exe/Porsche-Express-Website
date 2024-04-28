let passwordInput = document.getElementById("PI");
let hideIcon = document.getElementById("H");

hideIcon.addEventListener('mousedown', function () {
    passwordInput.type = "text";
    hideIcon.src = "/images/Sign/Show-Pass.png";
});

hideIcon.addEventListener('mouseup', function () {
    passwordInput.type = "password";
    hideIcon.src = "/images/Sign/Hide-Pass.png";
});