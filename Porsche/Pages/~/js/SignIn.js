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

$(document).ready(function () {
    $(".submitionbutton").click(function (e) {
        e.preventDefault();

        var email = $("#Email").val();
        var password = $("#Password").val();

        $.ajax({
            url: '/SignIn',
            type: 'post',
            data: { email, password },
            success: function () {
                alert('User signed in');
                // Redirect to another page here if needed
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
            }
        });
    });
});
