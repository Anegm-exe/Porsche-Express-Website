document.addEventListener('scroll', function () {
    const adBanner = document.querySelector('.home-header');
    const video = document.querySelector('#Homevid');

    if (window.scrollY > adBanner.offsetHeight) {
        video.classList.add('fixed-video');
    } else {
        video.classList.remove('fixed-video');
    }
});

$(document).ready(function () {
    // Check if the JWT exists
    var token = localStorage.getItem('jwt');
    if (token) {
        var payload = JSON.parse(atob(token.split('.')[1]));
        var name = payload.name;
        // If the JWT exists, disable the sign-in button and show the user's name
        $('a[href="SignIn"]').replaceWith('<span>' + name + '</span>');
    }
});