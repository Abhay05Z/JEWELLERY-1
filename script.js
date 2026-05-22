// Premium Jewelry Interactions & Utilities

document.addEventListener('DOMContentLoaded', () => {

    // 1. Loading Screen
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 1000);
        }, 1500); // Premium wait time for effect
    }

    // 2. Custom Cursor
    const cursor = document.getElementById('customCursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Add hover effect to interactive elements
        const interactives = document.querySelectorAll('a, button, input, select, .product-card');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // 3. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 4. Dark / Light Mode Toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const body = document.body;
            if (body.getAttribute('data-theme') === 'light') {
                body.setAttribute('data-theme', 'dark');
                themeToggle.classList.remove('far', 'fa-moon');
                themeToggle.classList.add('fas', 'fa-sun');
            } else {
                body.setAttribute('data-theme', 'light');
                themeToggle.classList.remove('fas', 'fa-sun');
                themeToggle.classList.add('far', 'fa-moon');
            }
        });
    }



    // Navbar Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = 'var(--shadow-soft)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    // Run initial calc if on calc page
    if (document.getElementById('advCalcForm')) {
        liveCalculate();
    }
});


// Advanced Calculator Logic
function toggleMetalType() {
    const isGold = document.querySelector('input[name="metalType"][value="gold"]').checked;
    const purityGroup = document.getElementById('purityGroup');
    const rateLabel = document.getElementById('rateLabel');
    const rateInput = document.getElementById('calcRate');

    if (isGold) {
        purityGroup.style.display = 'block';
        rateLabel.innerText = 'Live Rate per 10g (₹)';
        rateInput.value = 72000;
    } else {
        purityGroup.style.display = 'none';
        rateLabel.innerText = 'Live Rate per 1kg (₹)';
        rateInput.value = 85000;
    }
    liveCalculate();
}

function liveCalculate() {
    const isGold = document.querySelector('input[name="metalType"][value="gold"]').checked;
    const rate = parseFloat(document.getElementById('calcRate').value) || 0;
    const weight = parseFloat(document.getElementById('calcWeight').value) || 0;
    const makingPercent = parseFloat(document.getElementById('calcMaking').value) || 0;
    const stoneCharges = parseFloat(document.getElementById('calcStone').value) || 0;

    let metalValue = 0;

    if (isGold) {
        const purity = parseInt(document.getElementById('calcPurity').value);
        let adjustedRate = rate;
        if (purity === 22) adjustedRate = rate * (22 / 24);
        else if (purity === 18) adjustedRate = rate * (18 / 24);
        metalValue = (adjustedRate / 10) * weight;
    } else {
        // Silver usually priced per KG
        metalValue = (rate / 1000) * weight;
    }

    const makingCharges = metalValue * (makingPercent / 100);
    const subtotal = metalValue + makingCharges + stoneCharges;
    const gst = subtotal * 0.03; // 3% GST

    const total = subtotal + gst;

    document.getElementById('calcTotal').innerText = '₹ ' + total.toLocaleString('en-IN', { maximumFractionDigits: 0 });

    // EMI Calc (mocking 6 months no cost + minimal fee)
    const emi = total / 6;
    document.getElementById('calcEmi').innerText = '₹ ' + emi.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}


// Global Lightbox Logic for all Images
document.addEventListener('DOMContentLoaded', () => {
    // Create Lightbox DOM structure
    const lightboxDiv = document.createElement('div');
    lightboxDiv.className = 'global-lightbox';
    lightboxDiv.id = 'globalLightbox';

    const closeSpan = document.createElement('span');
    closeSpan.className = 'lightbox-close';
    closeSpan.innerHTML = '&times;';

    const imgEl = document.createElement('img');
    imgEl.className = 'global-lightbox-img';
    imgEl.id = 'lightboxImg';

    lightboxDiv.appendChild(closeSpan);
    lightboxDiv.appendChild(imgEl);
    document.body.appendChild(lightboxDiv);

    // Add click event to all images
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        img.addEventListener('click', (e) => {
            // Prevent opening lightbox for tiny icons if any, but prompt said EVERY image.
            imgEl.src = e.target.src;
            lightboxDiv.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    // Close Lightbox on click
    const closeLightbox = () => {
        lightboxDiv.classList.remove('show');
        document.body.style.overflow = 'auto';
        setTimeout(() => { imgEl.src = ''; }, 300);
    };

    closeSpan.addEventListener('click', closeLightbox);
    lightboxDiv.addEventListener('click', (e) => {
        if (e.target === lightboxDiv) closeLightbox();
    });
});

