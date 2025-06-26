(() => {
    const SCRIPT_KEY = '__bookmark_vanisher_script_running__';
    localStorage.removeItem(SCRIPT_KEY);
    localStorage.setItem(SCRIPT_KEY, '1');

    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    const createOverlay = () => {
        const blocker = document.createElement('div');
        blocker.id = 'vanisherOverlay';
        blocker.style.position = 'fixed';
        blocker.style.top = '0';
        blocker.style.left = '0';
        blocker.style.width = '100vw';
        blocker.style.height = '100vh';
        blocker.style.background = 'rgba(0,0,0,0.6)';
        blocker.style.zIndex = '999999';
        blocker.style.color = '#fff';
        blocker.style.fontSize = '24px';
        blocker.style.display = 'flex';
        blocker.style.alignItems = 'center';
        blocker.style.justifyContent = 'center';
        blocker.innerText = 'Bookmark Vanisher is running. Press Esc to cancel.';
        document.body.appendChild(blocker);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.getElementById('vanisherOverlay')?.remove();
                localStorage.removeItem(SCRIPT_KEY);
                console.log('[Bookmark Vanisher] Script manually cancelled.');
            }
        });
    };

    const getUnbookmarkButtons = () => {
        return Array.from(document.querySelectorAll('button'))
            .filter(button => {
                const svg = button.querySelector('svg');
                const path = svg?.querySelector('path');
                return path?.getAttribute('d') === 'M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z';
            });
    };

    const scrollAndUnbookmark = async () => {
        let processed = new Set();
        let sameNoGrowthTries = 0;
        let cycle = 0;

        while (sameNoGrowthTries < 5) {
            const buttons = getUnbookmarkButtons().filter(b => !processed.has(b));

            for (const btn of buttons) {
                processed.add(btn);
                btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await delay(300);
                btn.click();
                await delay(800);
            }

            const prevCount = processed.size;

            window.scrollTo(0, document.body.scrollHeight);
            await delay(2500);

            const newCount = getUnbookmarkButtons().filter(b => !processed.has(b)).length;

            if (processed.size === prevCount && newCount === 0) {
                sameNoGrowthTries++;
            } else {
                sameNoGrowthTries = 0;
            }

            cycle++;
            if (cycle % 3 === 0) {
                console.log('[Bookmark Vanisher] Triggering top-to-bottom refresh...');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                await delay(2000);
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                await delay(2000);
            }
        }

        localStorage.removeItem(SCRIPT_KEY);
        document.getElementById('vanisherOverlay')?.remove();
        console.log('[Bookmark Vanisher] Done. All visible bookmarks should be removed.');
    };

    createOverlay();
    scrollAndUnbookmark();
})();
