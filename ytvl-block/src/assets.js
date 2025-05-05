const previewImg = (
    <svg className="ytvl-preview-img-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.528"></g>
        <g id="SVGRepo_iconCarrier">
            <path d="M19 21H20.0104C20.9816 21 21.4671 21 21.7348 20.7975C21.968 20.6211 22.1123 20.3515 22.1297 20.0596C22.1497 19.7246 21.8804 19.3205 21.3417 18.5125L18.3313 13.9969C17.8862 13.3292 17.6636 12.9954 17.3831 12.8791C17.1378 12.7773 16.8622 12.7773 16.6169 12.8791C16.3364 12.9954 16.1139 13.3292 15.6687 13.9969L14.9245 15.1132M19 21L11.3155 9.90018C10.8736 9.26182 10.6526 8.94264 10.3766 8.83044C10.1351 8.73228 9.8649 8.73228 9.62344 8.83044C9.34742 8.94264 9.12645 9.26182 8.68451 9.90018L2.73822 18.4893C2.17519 19.3025 1.89368 19.7092 1.90971 20.0473C1.92366 20.3419 2.06688 20.6152 2.30109 20.7943C2.57002 21 3.06459 21 4.05373 21H19ZM21 6C21 7.65685 19.6569 9 18 9C16.3432 9 15 7.65685 15 6C15 4.34315 16.3432 3 18 3C19.6569 3 21 4.34315 21 6Z" stroke="#ffffff" stroke-width="0.288" stroke-linecap="round" stroke-linejoin="round"></path>
        </g>
    </svg>
);

const ytIcon = (
    <svg className='ytvl-video-icon' width='100%' height='100%' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
        <path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z" />
    </svg>
);

export function getVideoID( url ) {
    if( !url ) return null;
  
    const regExp    = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match     = url.match(regExp);
    
    return ( match && match[2].length === 11 ) ? match[2] : null;
}

export function getYouTubeThumbnail( videoId, quality = 'hqdefault' ) {
    if( !videoId ) return '';

    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

export { previewImg, ytIcon };