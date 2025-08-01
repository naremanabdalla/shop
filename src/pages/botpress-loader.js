let webchatLoaded = false;

export async function loadBotpressComponents() {
    if (webchatLoaded) return;

    const { Webchat, Fab } = await import('@botpress/webchat');
    window.BotpressComponents = { Webchat, Fab };
    webchatLoaded = true;
}