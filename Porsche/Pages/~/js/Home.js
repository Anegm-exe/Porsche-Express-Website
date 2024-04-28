document.addEventListener('scroll', function () {
    const adBanner = document.querySelector('.home-header');
    const video = document.querySelector('#Homevid');

    if (window.scrollY > adBanner.offsetHeight) {
        video.classList.add('fixed-video');
    } else {
        video.classList.remove('fixed-video');
    }
});