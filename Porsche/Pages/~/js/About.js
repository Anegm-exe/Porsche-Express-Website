/* Initialization */
let texts = [
    { h: "Porsche:A Legacy of Automotive Excellence", p: "Porsche stands as a symbol of automotive excellence, renowned for its precision engineering, timeless design, and unparalleled performance. Founded in 1931 by Ferdinand Porsche, the company has continually pushed the boundaries of innovation, setting new standards in the automotive industry. From the iconic Porsche 911 to the exhilarating Porsche Cayenne, every vehicle bearing the Porsche emblem embodies the brand's commitment to quality, craftsmanship, and driving pleasure. With a rich heritage rooted in racing success, Porsche has translated its motorsport DNA into road-going vehicles that deliver an unmatched driving experience." },
    { h: "Mission: Pursuing Perfection on Every Road", p: "At the core of Porsche's mission is the relentless pursuit of perfection. With a focus on innovation, sustainability, and customer satisfaction, Porsche strives to exceed expectations at every turn. Whether it's developing cutting-edge technology, reducing environmental impact, or enhancing customer service, Porsche remains committed to excellence in all aspects of its operations. Through its mission, Porsche seeks to inspire passion and excitement among drivers worldwide, creating vehicles that evoke emotions and elevate the driving experience to new heights.By staying true to its core values while embracing change, Porsche continues to shape the future of mobility while honoring its storied heritage." },
    { h: "Achievements: A Legacy of Racing Glory", p: "Porsche's achievements on the racetrack are the stuff of legends, spanning decades of dominance in motorsport. From winning the prestigious 24 Hours of Le Mans to conquering the grueling Nürburgring, Porsche has amassed an impressive collection of trophies and titles, solidifying its status as one of the most successful racing teams in history. With iconic cars like the Porsche 917 and the Porsche 956, the brand has left an indelible mark on motorsport, showcasing its engineering prowess and competitive spirit on the world stage.Through innovation, determination, and sheer skill, Porsche has achieved greatness in racing, setting records and pushing the limits of what's possible on the track." },
    { h: "Globality: Uniting Drivers Across Continents", p: "Porsche's global presence extends far beyond its headquarters in Stuttgart, Germany, reaching drivers on every continent. With a network of dealerships, service centers, and enthusiasts worldwide, Porsche has cultivated a diverse and passionate community united by a shared love for driving and craftsmanship. Whether it's cruising along the scenic roads of California, tackling the winding passes of the Swiss Alps, or navigating the bustling streets of Tokyo, Porsche owners experience the thrill of driving wherever they go. Through events, clubs, and online forums, Porsche fosters connections among enthusiasts, creating a global family that celebrates the joy of automotive excellence." },
    { h: "Future: Pioneering the Road Ahead", p: "As the automotive industry evolves, Porsche remains at the forefront of innovation, shaping the future of mobility with groundbreaking technologies and visionary concepts. From electric powertrains to autonomous driving systems, Porsche is redefining the driving experience for the 21st century, while staying true to its heritage of performance and craftsmanship.With initiatives like the Porsche Taycan, the brand's first all-electric sports car, Porsche is leading the charge towards a more sustainable and connected future. By embracing new challenges and opportunities, Porsche continues to inspire drivers around the world, proving that the spirit of innovation knows no bounds. As we look ahead, one thing is certain: the future of driving will be shaped by Porsche's unwavering commitment to excellence and innovation." }
];
let index = 0;
let leftArrow = document.getElementById("leftarrow");
let rightArrow = document.getElementById("rightarrow");
let dotsContainer = document.getElementById("dots");
let containerWidth = 600;
let dotWidth = 5;
let dotMargin = 5;
let totalDotWidth = (dotWidth + dotMargin) * texts.length - dotMargin;
let startLeft = (containerWidth - totalDotWidth) / 2;

/* Dot Code */
for (let i = 0; i < texts.length; i++) {
    let dot = document.createElement("span");
    dot.classList.add("dot");
    dot.style.left = (startLeft - 5 + i * (dotWidth + dotMargin)) + 'px';
    if (i === index) {
        dot.classList.add("active");
    }
    dotsContainer.appendChild(dot);
}

/* Left And Right Buttons */
leftArrow.addEventListener("click", function () {
    let textElement = document.getElementById("text");
    let subTextElement = document.getElementById("subText");

    leftArrow.style.pointerEvents = "none";
    rightArrow.style.pointerEvents = "none";

    leftArrow.style.animation = "fadeOut 0.5s forwards";
    rightArrow.style.animation = "fadeOut 0.5s forwards";

    textElement.style.animation = "fadeOutRight 0.5s forwards, glow 6s ease-in-out infinite";
    subTextElement.style.animation = "fadeOutRight 0.5s forwards";

    setTimeout(function () {
        index--;
        if (index < 0) index = texts.length - 1;
        updateText();

        textElement.style.animation = "fadeInRight 0.5s forwards, glow 6s ease-in-out infinite";
        subTextElement.style.animation = "fadeInRight 0.5s forwards";

        leftArrow.style.animation = "fadeIn 0.5s forwards";
        rightArrow.style.animation = "fadeIn 0.5s forwards";

        leftArrow.style.pointerEvents = "auto";
        rightArrow.style.pointerEvents = "auto";
    }, 500);
});

rightArrow.addEventListener("click", function () {
    let textElement = document.getElementById("text");
    let subTextElement = document.getElementById("subText");

    leftArrow.style.pointerEvents = "none";
    rightArrow.style.pointerEvents = "none";

    leftArrow.style.animation = "fadeOut 0.5s forwards";
    rightArrow.style.animation = "fadeOut 0.5s forwards";

    textElement.style.animation = "fadeOutLeft 0.5s forwards, glow 6s ease-in-out infinite";
    subTextElement.style.animation = "fadeOutLeft 0.5s forwards";

    setTimeout(function () {
        index++;
        if (index >= texts.length) index = 0;
        updateText();

        textElement.style.animation = "fadeInLeft 0.5s forwards, glow 6s ease-in-out infinite";
        subTextElement.style.animation = "fadeInLeft 0.5s forwards";

        leftArrow.style.animation = "fadeIn 0.5s forwards";
        rightArrow.style.animation = "fadeIn 0.5s forwards";

        leftArrow.style.pointerEvents = "auto";
        rightArrow.style.pointerEvents = "auto";
    }, 500);
});

/* Text Final Update */
function updateText() {
    document.getElementById("text").innerText = texts[index].h;
    document.getElementById("subText").innerText = texts[index].p;

    let dots = document.getElementsByClassName("dot");
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }
    dots[index].classList.add("active");
}

/* Down Arrow Function */
let arrowIcon = document.getElementById("arrowdown");
let C2 = document.getElementById("C2");
let isDown = false;

arrowIcon.addEventListener("click", function () {
    this.classList.toggle("open");
    if (!isDown) {
        window.scrollBy({ top: 825, behavior: 'smooth' });
        C2.style.backgroundColor = "black";
        isDown = true;
    } else {
        window.scrollBy({ top: -825, behavior: 'smooth' });
        C2.style.backgroundColor = "transparent";
        isDown = false;
    }
});
