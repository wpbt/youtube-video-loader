import { __ } from '@wordpress/i18n';
import { InspectorControls, MediaPlaceholder, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { ytIcon, previewImg, getVideoID, getYouTubeThumbnail } from './assets';


export default function Edit({ attributes, setAttributes, isSelected }) {
    const { embedUrl, useCustomPreviewImage, customPreviewImage, ytThumb }  = attributes;
    const [ error, setError ]                                               = useState( { invalidUrl: '' } );

    const blockProps = useBlockProps( {
        className: `ytvl-wrapper ${isSelected ? 'selected' : ''}`,
    } );

    const handleUrlInputChange = value => {
        let id = getVideoID( value );

        if( id ) {
            let thumb = getYouTubeThumbnail( id );

            if( thumb ) {
                setAttributes( { ytThumb: thumb } );
            }
            setError( { ...error, invalidUrl: '' } );
        } else {
            setError( {...error, invalidUrl: __( 'Please use a valid YouTube video link', 'youtube-video-loader' ) } );
        }

        setAttributes( { embedUrl: value } );
    };

    const MediaComponent = ({ image }) => {
        return (
            <>
                { !image?.length ? (
                    <MediaPlaceholder
                        onSelect={ ( media ) => setAttributes( { customPreviewImage: [ media.id, media.url, media.alt || '' ] } ) }
                        allowedTypes={ [ 'image' ] }
                        multiple={ false }
                        labels={ { title: __( 'Insert Preview Image', 'youtube-video-loader' ) } }
                    />
                ) : (
                    <div className="ytvl-prev-image-wrapper">
                        <img src={ image[1]} alt={image[2] } />
                        <Button
                            isDestructive
                            onClick={ () => setAttributes( { customPreviewImage: [] } ) }
                        >
                            { __( 'Remove Image', 'youtube-video-loader' ) }
                        </Button>
                    </div>
                )}
            </>
        );
    };

    const ThumbInfo = () => {
        if( ytThumb && !useCustomPreviewImage ) {
            return (
                <img className='ytvl-thumb-img' src={ ytThumb } alt={ __( 'Video Preview Thumbnail', 'youtube-video-loader' ) } />
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
                { isSelected && <span className='ytvl-info'>Enter YouTube video information via settings.</span> }

                <div className='ytvl-editor-preview-wrapper'>
                    <ThumbInfo />
                    <span className='loader-icon'>{ ytIcon }</span>
                </div>
            </div>
        );
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={ __( 'Settings', 'youtube-video-loader' ) }>
                    <TextControl
                        __nextHasNoMarginBottom
                        __next40pxDefaultSize
                        label={ __( 'Video URL', 'youtube-video-loader' ) }
                        value={ embedUrl || '' }
                        onChange={ ( value ) => handleUrlInputChange( value ) }
                    />

                    {error?.invalidUrl && <p className='ytvl-error'>{error?.invalidUrl}</p>}

                    <ToggleControl
                        checked={ !! useCustomPreviewImage }
                        label={ __( 'Use custom image for video preview', 'youtube-video-loader' ) }
                        onChange={ () => setAttributes( { useCustomPreviewImage: ! useCustomPreviewImage, } ) }
                    />

                    { ( ytThumb && !useCustomPreviewImage ) && ( 
                        <>
                            <img className='ytvl-thumb-img' src={ ytThumb } alt={ __( 'Video Preview Thumbnail', 'youtube-video-loader' ) } />
                            <span className='ytvl-thumb-img-info'>{ __( 'Default thumbnail for the video url.', 'youtube-video-loader' ) }</span>
                        </>
                    ) }

                    { useCustomPreviewImage && <MediaComponent image={ customPreviewImage } />}
                </PanelBody>
            </InspectorControls>

            <Data />
        </>
    );
}