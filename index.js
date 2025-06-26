(() => {
    const SCRIPT_KEY = '__tweet_vanisher_script_running__';

    // If already running, prevent duplicate execution
    if (localStorage.getItem(SCRIPT_KEY) === '1') {
        console.warn('[Tweet Vanisher] Script is already running.');
        return;
    }

    const username = prompt("Enter your Twitter handle (include @):", "@YourUsername");
    if (!username || !username.startsWith("@")) {
        alert("Invalid username. Script aborted.");
        return;
    }

    localStorage.setItem('__tweet_vanisher_username__', username);
    localStorage.setItem(SCRIPT_KEY, '1');

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const processedIds = new Set(JSON.parse(localStorage.getItem('deletedTweetIds') || '[]'));
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
    const saveProgress = () => localStorage.setItem('deletedTweetIds', JSON.stringify([...processedIds]));

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
        let lastHeight = 0;
        let sameHeightTries = 0;

        while (sameHeightTries < 5) {
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

            window.scrollTo(0, document.body.scrollHeight);
            await delay(3000);

            const currentHeight = document.body.scrollHeight;
            if (currentHeight === lastHeight) {
                sameHeightTries++;
            } else {
                sameHeightTries = 0;
                lastHeight = currentHeight;
            }
        }

        localStorage.removeItem(SCRIPT_KEY);
        console.log('[Tweet Vanisher] All deletable tweets processed.');
    };

    createOverlay();
    scrollAndDelete();
})();
