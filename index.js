(() => {
    const SCRIPT_KEY = '__tweet_vanisher_script_running__';
    const STORAGE_KEY = 'deletedTweetIds';
    const USER_KEY = '__tweet_vanisher_username__';

    // Always clear script run state on load
    localStorage.removeItem(SCRIPT_KEY);

    const username = prompt("Enter your Twitter handle (include @):", localStorage.getItem(USER_KEY) || "@YourUsername");
    if (!username || !username.startsWith("@")) {
        alert("Invalid username. Script aborted.");
        return;
    }

    localStorage.setItem(USER_KEY, username);
    localStorage.setItem(SCRIPT_KEY, '1');

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const processedIds = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
    const yourHandle = username;

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
        blocker.innerText = 'Tweet Vanisher is running. Press Esc to cancel.';
        document.body.appendChild(blocker);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.getElementById('vanisherOverlay')?.remove();
                localStorage.removeItem(SCRIPT_KEY);
                console.log('[Tweet Vanisher] Script manually cancelled.');
            }
        });
    };

    const getTweetElements = () => Array.from(document.querySelectorAll('[data-testid="tweet"]'));
    const isOwnTweet = (tweet) => tweet.innerText.includes(yourHandle);
    const getTweetId = (tweet) => tweet.getAttribute('data-tweet-id') || tweet.innerText.slice(0, 50);
    const saveProgress = () => localStorage.setItem(STORAGE_KEY, JSON.stringify([...processedIds]));

    const clickCaretAndDelete = async (tweet) => {
        const caret = tweet.querySelector('[data-testid="caret"]');
        if (!caret) return false;

        caret.scrollIntoView({ behavior: "smooth", block: "center" });
        caret.click();
        await delay(300);

        const menuItems = Array.from(document.querySelectorAll('[role="menuitem"]'));
        const deleteOption = menuItems.find(item => item.textContent.trim() === 'Delete');

        if (deleteOption) {
            deleteOption.click();
            await delay(300);
            const confirm = document.querySelector('[data-testid="confirmationSheetConfirm"]');
            if (confirm) {
                confirm.click();
                await delay(500);
                return true;
            }
        } else {
            document.body.click(); // Close menu
            await delay(200);
        }

        return false;
    };

    const scrollAndDelete = async () => {
        let sameNoGrowthTries = 0;
        let cycleCount = 0;

        while (sameNoGrowthTries < 5) {
            const tweets = getTweetElements();

            for (const tweet of tweets) {
                const id = getTweetId(tweet);
                if (processedIds.has(id)) continue;
                if (!isOwnTweet(tweet)) continue;

                const deleted = await clickCaretAndDelete(tweet);
                if (deleted) {
                    processedIds.add(id);
                    saveProgress();
                }

                await delay(1500);
            }

            const previousCount = tweets.length;

            window.scrollTo(0, document.body.scrollHeight);
            await delay(3000);

            const newCount = getTweetElements().length;
            if (newCount <= previousCount) {
                sameNoGrowthTries++;
            } else {
                sameNoGrowthTries = 0;
            }

            // Force full scroll sweep every 3 passes
            cycleCount++;
            if (cycleCount % 3 === 0) {
                console.log('[Tweet Vanisher] Forcing full-page scroll to trigger more tweet loads...');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                await delay(3000);
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                await delay(3000);
            }
        }

        localStorage.removeItem(SCRIPT_KEY);
        console.log('[Tweet Vanisher] All deletable tweets processed.');
    };

    createOverlay();
    scrollAndDelete();
})();
