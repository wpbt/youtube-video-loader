import { __ } from '@wordpress/i18n';
import { InspectorControls, MediaPlaceholder, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, Button, SelectControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { ytIcon, previewImg, getVideoID, getYouTubeThumbnail } from './assets';


export default function Edit({ attributes, setAttributes, isSelected }) {
    const {
        embedUrl,
        useCustomPreviewImage,
        customPreviewImage,
        ytThumb,
        thumbOpacity,
        thumbFit,
        frameWidth,
        frameHeight
    }  = attributes;

    let wrapperStyle = {
        maxWidth: frameWidth ? frameWidth + 'px' : '640px',
        height: frameHeight ? frameHeight + 'px' : '360px'
    };

    const [ error, setError ]           = useState( { invalidUrl: '', invalidOpacity: '', invalidHeight: '', invalidWidth: '' } );
    const [ thumbStyle, setThumbStyle ] = useState( { opacity: thumbOpacity, objectFit: thumbFit || 'cover', ...wrapperStyle } );

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

    const handleWidthChange = value => {
        let width = parseFloat( value );

        if( width < 0 ) {
            setError( { ...error, invalidWidth: __( 'Please enter non-negative value', 'youtube-video-loader' ) } );
        } else {
            setError( { ...error, invalidWidth: '' } );
        }

        setAttributes( { frameWidth: width } );
    };

    const handleHeightChange = value  => {
        let height = parseFloat( value );

        if( height < 0 ) {
            setError( { ...error, invalidHeight: __( 'Please enter non-negative value', 'youtube-video-loader' ) } );
        } else {
            setError( { ...error, invalidHeight: '' } );
        }

        setAttributes( { frameHeight: height } );
    };

    const handleOpacityChange = value => {
        let opacity = parseFloat( value );

        if( opacity > 1 || opacity < 0 ) {
            setError( { ...error, invalidOpacity: __( 'Opacity value should be between "1" and "0"', 'youtube-video-loader' ) } );
        } else {
            setError( { ...error, invalidOpacity: '' } );
        }

        setAttributes( { thumbOpacity: opacity } );
        setThumbStyle( { ...thumbStyle, opacity } );
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
                <img className='ytvl-thumb-img' style={ thumbStyle } src={ ytThumb } alt={ __( 'Video Preview Thumbnail', 'youtube-video-loader' ) } />
            );
        }

        if( useCustomPreviewImage && customPreviewImage?.length ) {
            return <img className='ytvl-thumb-img' style={ thumbStyle } src={ customPreviewImage[1] } alt={ customPreviewImage[2] } />;
        }

        return previewImg( thumbStyle );
    };

    const Data = () => {
        return (
            <div { ...blockProps }>
                { isSelected && <span className='ytvl-info'>{ __( 'Enter YouTube video link and thumbnain information via settings.', 'youtube-video-loader' ) }</span> }

                <div className='ytvl-editor-preview-wrapper' style={ wrapperStyle }>
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

                    { error?.invalidUrl && <p className='ytvl-error'>{ error?.invalidUrl }</p> }

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

                    <TextControl
                        __nextHasNoMarginBottom
                        __next40pxDefaultSize
                        label={ __( 'Thumbnail Opacity', 'youtube-video-loader' ) }
                        value={ thumbOpacity ? thumbOpacity : null }
                        onChange={ ( value ) => handleOpacityChange( value ) }
                    />

                    { error?.invalidOpacity && <p className='ytvl-error'>{ error?.invalidOpacity }</p> }

                    <SelectControl
                        label={ __( 'Thumbnail Object Fit Control', 'youtube-video-loader' ) }
                        value={ thumbFit || 'cover' }
                        onChange={ ( fit ) => {
                            setAttributes( { thumbFit: fit } );
                            setThumbStyle( { ...thumbStyle, objectFit: fit } );
                        } }
                        options={ [
                            { value: 'cover', label: __( 'Cover', 'youtube-video-loader' ) },
                            { value: 'contain', label: __( 'Contain', 'youtube-video-loader' ) },
                        ] }
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                    />

                    <TextControl
                        __nextHasNoMarginBottom
                        __next40pxDefaultSize
                        label={ __( 'Container Max Width', 'youtube-video-loader' ) }
                        value={ frameWidth || '640' }
                        onChange={ ( value ) => handleWidthChange( value ) }
                    />

                    { error?.invalidWidth && <p className='ytvl-error'>{ error?.invalidWidth } </p>}

                    <TextControl
                        __nextHasNoMarginBottom
                        __next40pxDefaultSize
                        label={ __( 'Container Height', 'youtube-video-loader' ) }
                        value={ frameHeight || '360' }
                        onChange={ ( value ) => handleHeightChange( value ) }
                    />

                    { error?.invalidHeight && <p className='ytvl-error'>{ error?.invalidHeight } </p>}

                </PanelBody>
            </InspectorControls>

            <Data />
        </>
    );
}