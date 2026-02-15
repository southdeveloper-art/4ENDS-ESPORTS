// --- Universal Card Tilt Effect ---
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.profile-card, .card');

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;

        if (card.classList.contains('profile-card')) {
            // Screen center logic for login card
            const midX = window.innerWidth / 2;
            const midY = window.innerHeight / 2;
            const offsetX = x - midX;
            const offsetY = y - midY;
            const rotateX = (offsetY / midY) * -10;
            const rotateY = (offsetX / midX) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        } else {
            // Hover-based logic for tournament cards
            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                const midX = rect.left + rect.width / 2;
                const midY = rect.top + rect.height / 2;
                const offsetX = x - midX;
                const offsetY = y - midY;
                const rotateX = (offsetY / (rect.height / 2)) * -10;
                const rotateY = (offsetX / (rect.width / 2)) * 10;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            } else {
                card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
            }
        }
    });
});
