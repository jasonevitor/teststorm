document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.bridge-form input[type="number"]');
    const bridgeButton = document.getElementById('bridge-button');
    const menuIcon = document.getElementById('menu-icon');
    const nav = document.querySelector('nav');

    inputs.forEach(input => {
        input.addEventListener('input', validateInputs);
    });

    function validateInputs() {
        const valid = Array.from(inputs).some(input => input.value > 0);
        bridgeButton.disabled = !valid;
    }

    menuIcon.addEventListener('click', function() {
        if (nav.style.display === 'flex') {
            nav.style.display = 'none';
        } else {
            nav.style.display = 'flex';
        }
    });
});

document.querySelector('.menu-icon').addEventListener('click', function() {
    this.classList.toggle('active');
    document.querySelector('nav').classList.toggle('active');
});


document.querySelectorAll('nav .nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        // Remove active class from all links
        document.querySelectorAll('nav .nav-link').forEach(link => link.classList.remove('active'));
        // Add active class to clicked link
        this.classList.add('active');
    });
});
