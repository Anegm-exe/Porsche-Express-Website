document.addEventListener('scroll', function () {
    const adBanner = document.querySelector('.home-header');
    const video = document.querySelector('#Homevid');

    if (window.scrollY > adBanner.offsetHeight) {
        video.classList.add('fixed-video');
    } else {
        video.classList.remove('fixed-video');
    }
});

// Helper function to get a cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

document.addEventListener('DOMContentLoaded', function () {
    const signInLink = document.getElementById('signInLink');
    const signInImage = document.getElementById('signInImage');
    console.log("token is false!")
    // Check if token exists
    const token = getCookie('token');
    const role = getCookie('role');

    if (token) {
        console.log("token is true!")
        // Change image source
        signInImage.src = '~/css/images/Header/Logout.png';

        // Change click event
        signInLink.addEventListener('click', function (e) {
            e.preventDefault();

            // Delete token and role
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

            // Refresh page
            location.reload();
        });
    }
});