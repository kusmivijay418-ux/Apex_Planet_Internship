// ===============================
// Smooth navigation
// ===============================

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (event) {

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});



// ===============================
// Apply button
// ===============================

const applyButton = document.getElementById("applyButton");

applyButton.addEventListener("click", function () {

    alert(
        "Thank you for your interest!\n\n" +
        "The internship application form will open here."
    );

});



// ===============================
// Reveal animation
// ===============================

const elements = document.querySelectorAll(
    ".skill-card, .benefit, .domain, .step, .about-content"
);

const observer = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

            }

        });

    },
    {
        threshold: 0.15
    }
);


elements.forEach(element => {

    element.style.opacity = "0";
    element.style.transform = "translateY(25px)";
    element.style.transition = "all 0.7s ease";

    observer.observe(element);

});