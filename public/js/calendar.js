(() => {
    const clock = document.querySelector('[data-calendar-clock]');
    const liveDate = document.querySelector('[data-calendar-live-date]');

    if (!clock || !liveDate) {
        return;
    }

    const clockFormatter = new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
    const liveDateFormatter = new Intl.DateTimeFormat('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    function updateDigitalDisplay() {
        const now = new Date();
        clock.dateTime = now.toISOString();
        clock.textContent = clockFormatter.format(now);
        liveDate.dateTime = now.toISOString();
        liveDate.textContent = liveDateFormatter.format(now);
    }

    updateDigitalDisplay();
    window.setInterval(updateDigitalDisplay, 1_000);
})();
