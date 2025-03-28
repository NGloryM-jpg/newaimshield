document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    function refinedSmoothScroll(targetElement) {
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - 80; 
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const duration = 600;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easing = easeOutCubic(progress);
            window.scrollTo(0, startPosition + distance * easing);
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        requestAnimationFrame(animation);
    }

    document.querySelectorAll('nav ul li a, .cta-button').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                refinedSmoothScroll(targetElement);
            }
        });
    });

    document.querySelectorAll('.faq-item').forEach((item) => {
        item.querySelector('.faq-question').addEventListener('click', () => {
            const activeItem = document.querySelector('.faq-item.active');
            if (activeItem && activeItem !== item) {
                activeItem.classList.remove('active');
            }
            item.classList.toggle('active');
        });
    });

    const copyButton = document.getElementById("copy-discord-btn");
    const discordName = document.getElementById("discord-name").innerText;
    copyButton.addEventListener("click", () => {
        navigator.clipboard.writeText(discordName).then(() => {
            copyButton.innerText = "✅";
            setTimeout(() => {
                copyButton.innerText = "📋";
            }, 2000);
        }).catch(err => {
            console.error("Failed to copy:", err);
        });
    });

    const contactLink = document.querySelector('a.cta-header');
    const contactOverlay = document.getElementById('contact-overlay');
    const closeContactBtn = document.getElementById('close-contact');
    const contactForm = document.getElementById('contact-form');
    const notificationContainer = document.getElementById('notification-container');
    
    let lastSubmissionTime = 0;
    const spamInterval = 60000;
    
    // Open overlay & disable scroll
    contactLink.addEventListener('click', (event) => {
        event.preventDefault();
        contactOverlay.classList.add('active');
        document.body.classList.add('no-scroll');
    });
    
    // Close overlay & enable scroll
    function closeOverlay() {
        contactOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
    
    closeContactBtn.addEventListener('click', closeOverlay);
    
    // Close overlay by clicking outside content
    contactOverlay.addEventListener('click', (event) => {
        if (event.target === contactOverlay) {
        closeOverlay();
        }
    });
    
    // Close overlay on ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
        closeOverlay();
        }
    });
    
    // Custom notification function
    function showNotification(message, isError) {
        const notification = document.createElement('div');
        notification.classList.add('notification', isError ? 'error' : 'success');
        notification.textContent = message;
        notificationContainer.appendChild(notification);
        setTimeout(() => {
        notification.classList.add('show');
        }, 10);
        setTimeout(() => {
        notification.classList.add('fadeOut');
        setTimeout(() => {
            notification.remove();
        }, 300);
        }, 5000);
    }
    
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const now = Date.now();
        if (now - lastSubmissionTime < spamInterval) {
        showNotification('Please wait before sending another message.', true);
        return;
        }
        lastSubmissionTime = now;
    
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        const cfx = document.getElementById('cfx').value.trim() || 'Not provided';
    
        const payload = {
        username: 'AimShield',
        avatar_url: 'https://i.imgur.com/9tb50HK.png',
        embeds: [{
            title: subject,
            color: 5814783,
            fields: [
            { name: 'Email/Discord Name (Tag)', value: email, inline: false },
            { name: 'Cfx Username', value: cfx, inline: false },
            { name: 'Message', value: message, inline: false }
            ],
            footer: {
            text: `AimShield - ${new Date().toLocaleString()}`
            }
        }]
        };
    
        try {
        const response = await fetch('https://discord.com/api/webhooks/1350471821732085791/H0jMp05KMr8hJZef4eRudxoQqeDykWk65_npq4OEPdtQFoa0WQBipVbl_VlRu4pHKC5t', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    
        if (response.ok) {
            showNotification('Message sent successfully!', false);
            closeOverlay();
            contactForm.reset();
        } else {
            showNotification('Error sending message.', true);
        }
        } catch (error) {
        showNotification('An error occurred. Please try again.', true);
        console.error('Error:', error);
        }
    });
});
