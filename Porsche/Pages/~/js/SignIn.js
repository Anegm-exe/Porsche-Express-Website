let passwordInput = document.getElementById("PI");
let hideIcon = document.getElementById("H");

hideIcon.addEventListener('mousedown', function () {
    passwordInput.type = "text";
    hideIcon.src = "~/css/images/Sign/Show-Pass.png";
});

hideIcon.addEventListener('mouseup', function () {
    passwordInput.type = "password";
    hideIcon.src = "~/css/images/Sign/Hide-Pass.png";
});