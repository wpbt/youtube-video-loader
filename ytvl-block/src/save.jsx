import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";
import { previewImg, ytIcon, getVideoID } from "./assets";

export default function Save({ attributes }) {
    const {
        embedUrl,
        useCustomPreviewImage,
        customPreviewImage,
        ytThumb,
        thumbOpacity,
        thumbFit,
        frameWidth,
		aspectRatio,
		lazyLoadThumbnail,
		thumbnailAltText,
		muteOnAutoplay,
		captionText
    } = attributes;

    let videoId = getVideoID( embedUrl );
	let defaultThumbAlt = thumbnailAltText || __( 'Video Preview Thumbnail', 'youtube-video-loader' );

    let style = {
        opacity: thumbOpacity,
        objectFit: thumbFit,
        maxWidth: frameWidth ? frameWidth + 'px' : '100%'
    };

    let wrapperStyle = {
        maxWidth: frameWidth ? frameWidth + 'px' : undefined,
		aspectRatio
    };

    const blockProps = useBlockProps.save({
        className: "ytvl-wrapper-fe",
        'data-yt-id': videoId || '',
		'data-mute': muteOnAutoplay ? '1' : '0'
    });

    const VideoUrlMissing = () => {
        return <p>{ __( 'Video URL not set', 'youtube-video-loader' ) }</p>
    };

    const ThumbInfo = () => {
        if( ytThumb && !useCustomPreviewImage ) {
            return (
                <img className='ytvl-thumb-img' style={ style } src={ ytThumb } alt={ defaultThumbAlt } loading={ lazyLoadThumbnail ? 'lazy' : 'eager' } />
            );
        }

        if( useCustomPreviewImage && customPreviewImage?.length ) {
            return <img className='ytvl-thumb-img' style={ style } src={ customPreviewImage[1] } alt={ customPreviewImage[2] } loading={ lazyLoadThumbnail ? 'lazy' : 'eager' } />;
        }

        return previewImg( style );
    };

    const Data = () => {
        return (
            <div { ...blockProps }>
                { ( !embedUrl || !videoId ) ? <VideoUrlMissing /> : (
                    <div
                        className='ytvl-editor-preview-wrapper'
                        style={ wrapperStyle }
                        role="button"
                        tabIndex="0"
                        aria-label={ __( 'Play video', 'youtube-video-loader' ) }
                    >
                        <ThumbInfo />
                        <div className="ytvl-button-overlay"><span className='loader-icon'>{ytIcon}</span></div>
                    </div>
                )}
				{ captionText && <p className='ytvl-caption'>{ captionText }</p> }
            </div>
        );
    };

    return <Data />;
}
