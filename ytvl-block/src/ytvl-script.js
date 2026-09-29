function loadVideo( placeholder ) {
    const container = placeholder.closest( '.ytvl-wrapper-fe' );
    const videoID   = container.dataset.ytId;
	const mute      = container.dataset.mute === '0' ? '0' : '1';

    placeholder.innerHTML = `
        <div class="ytvl-loading-overlay">
            <div class="ytvl-spinner"></div>
        </div>
        <iframe
            loading="lazy"
            src="https://www.youtube-nocookie.com/embed/${videoID}?autoplay=1&mute=${mute}&rel=0&modestbranding=1"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            style="width: 100%; height: 100%"
        ></iframe>
        `;

    // Once the video is loaded the placeholder is no longer a play button,
    // so it shouldn't stay focusable or be announced as one.
    placeholder.removeAttribute( 'role' );
    placeholder.removeAttribute( 'tabindex' );
    placeholder.removeAttribute( 'aria-label' );

    const iframe = placeholder.querySelector( 'iframe' );

    iframe.addEventListener( 'load', () => {
        placeholder.querySelector( '.ytvl-loading-overlay' )?.remove();
    });

    // The element that had focus (the placeholder or the consent button) is
    // gone now, so hand focus to the player instead of dropping it.
    iframe.focus();
}

document.addEventListener( 'click', function( e ) {
    // Consent mode: only the button loads the video, not the notice text or
    // links inside it.
    const accept = e.target.closest( '.ytvl-consent-accept' );

    if( accept ) {
        const consentWrapper = accept.closest( '.ytvl-editor-preview-wrapper' );

        if( consentWrapper ) loadVideo( consentWrapper );
        return;
    }

    const placeholder = e.target.closest( '.ytvl-editor-preview-wrapper' );
    if( !placeholder || placeholder.dataset.consent ) return;
    loadVideo( placeholder );
});

document.addEventListener( 'keydown', function( e ) {
    if( e.key !== 'Enter' && e.key !== ' ' ) return;

    // In consent mode the real button handles Enter/Space through a normal
    // click, and links in the notice keep their default behavior.
    const placeholder = e.target.closest( '.ytvl-editor-preview-wrapper' );
    if( !placeholder || placeholder.dataset.consent ) return;

    e.preventDefault();
    loadVideo( placeholder );
});
