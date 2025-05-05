import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";
import { previewImg, ytIcon, getVideoID } from "./assets";

export default function Save({ attributes }) {
    const { embedUrl, useCustomPreviewImage, customPreviewImage, ytThumb } = attributes;

    let videoId = getVideoID( embedUrl );

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
                <img className='ytvl-thumb-img' src={ ytThumb } alt={ __( 'Video Preview Thumbnail', 'youtube-video-loaderk' ) } />
            );
        }

        if( useCustomPreviewImage && customPreviewImage?.length ) {
            return <img className='ytvl-thumb-img' src={ customPreviewImage[1] } alt={ customPreviewImage[2] } />;
        }

        return previewImg;
    };

    const Data = () => {
        return (
            <div { ...blockProps }>
                { !embedUrl ? <VideoUrlMissing /> : (
                    <div className='ytvl-editor-preview-wrapper'>
                        <ThumbInfo />
                        <span className='loader-icon'>{ytIcon}</span>
                    </div>
                )}
            </div>
        );
    };

    return <Data />;
}