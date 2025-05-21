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
        frameWidth
    } = attributes;

    let videoId = getVideoID( embedUrl );

    let style = { 
        opacity: thumbOpacity,
        objectFit: thumbFit || 'cover',
        maxWidth: frameWidth ? frameWidth + 'px' : '100%'
    };

    let wrapperStyle = {
        maxWidth: frameWidth ? frameWidth + 'px' : ''
    };

    const blockProps = useBlockProps.save({
        className: "ytvl-wrapper-fe",
        'data-yt-id': videoId || ''
    });

    const VideoUrlMissing = () => {
        return <p>{ __( 'Video URL not set', 'youtube-video-loader' ) }</p>
    };
    
    const ThumbInfo = () => {
        if( ytThumb && !useCustomPreviewImage ) {
            return (
                <img className='ytvl-thumb-img' style={ style } src={ ytThumb } alt={ __( 'Video Preview Thumbnail', 'youtube-video-loaderk' ) } />
            );
        }

        if( useCustomPreviewImage && customPreviewImage?.length ) {
            return <img className='ytvl-thumb-img' style={ style } src={ customPreviewImage[1] } alt={ customPreviewImage[2] } />;
        }

        return previewImg( style );
    };

    const Data = () => {
        return (
            <div { ...blockProps }>
                { !embedUrl ? <VideoUrlMissing /> : (
                    <div className='ytvl-editor-preview-wrapper' style={wrapperStyle}>
                        <ThumbInfo />
                        <div className="ytvl-button-overlay"><span className='loader-icon'>{ytIcon}</span></div>
                    </div>
                )}
            </div>
        );
    };

    return <Data />;
}