document.addEventListener( 'click', function( e ) {
    const placeholder = e.target.closest( '.ytvl-editor-preview-wrapper' );

    if (!placeholder) return;
  
    const container = placeholder.closest( '.ytvl-wrapper-fe' );
    const videoID   = container.dataset.ytId;
  
    console.log( 'vid id: ', videoID );

    placeholder.innerHTML = `
        <div class="ytvl-loading-overlay">
            <div class="ytvl-spinner"></div>
        </div>
        <iframe 
            loading="lazy"
            src="https://www.youtube-nocookie.com/embed/${videoID}?autoplay=1&mute=1&rel=0&modestbranding=1"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            style="width: 100%; height: 100%"
        ></iframe>
        `;
  
    placeholder.querySelector( 'iframe' ).addEventListener( 'load', () => {
        placeholder.querySelector( '.ytvl-loading-overlay' )?.remove();
    });
});