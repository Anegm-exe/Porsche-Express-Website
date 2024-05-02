let passwordInput = document.getElementById("Passone");
let hideIcon = document.getElementById("Iconone");

hideIcon.addEventListener('mousedown', function () {
    passwordInput.type = "text";
    hideIcon.src = "~/css/images/Sign/Show-Pass.png";
});

hideIcon.addEventListener('mouseup', function () {
    passwordInput.type = "password";
    hideIcon.src = "~/css/images/Sign/Hide-Pass.png";
});

let passwordInput2 = document.getElementById("Passtwo");
let hideIcon2 = document.getElementById("Icontwo");

hideIcon2.addEventListener('mousedown', function () {
    passwordInput2.type = "text";
    hideIcon2.src = "~/css/images/Sign/Show-Pass.png";
});

hideIcon2.addEventListener('mouseup', function () {
    passwordInput2.type = "password";
    hideIcon2.src = "~/css/images/Sign/Hide-Pass.png";
});

$(document).ready(function () {
    $(".submitionbutton").click(function (e) {
        e.preventDefault();

        var Fname = $("#FirstName").val();
        var Lname = $("#LastName").val();
        var email = $("#Email").val();
        var password = $("#Passone").val();
        var confirmPassword = $("#Passtwo").val();
        var dob = $("#Birth_Date").val();

        $.ajax({
            url: '/SignUp',
            type: 'post',
            data: { Fname, Lname, email, password, confirmPassword, dob },
            success: function () {
                alert('User created');
                // Redirect to another page here if needed
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
            }
        });
    });
});