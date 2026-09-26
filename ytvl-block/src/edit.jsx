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
		aspectRatio,
		thumbnailQuality,
	    lazyLoadThumbnail,
		thumbnailAltText,
		muteOnAutoplay,
		captionText
    }  = attributes;

	const defaultThumbAlt = thumbnailAltText || __( 'Video Preview Thumbnail', 'youtube-video-loader' );

    const wrapperStyle = {
        maxWidth: frameWidth ? frameWidth + 'px' : undefined,
		aspectRatio
    };

    const [ error, setError ] = useState( { invalidUrl: '', invalidOpacity: '', invalidWidth: '', invalidThumbQuality: '' } );
	const [ opacityInput, setOpacityInput ] = useState( String( thumbOpacity ) );

    const thumbStyle = {
        opacity: thumbOpacity,
        objectFit: thumbFit,
        ...wrapperStyle,
    };

    const blockProps = useBlockProps( {
        className: `ytvl-wrapper ${isSelected ? 'selected' : ''}`,
    } );

    const handleUrlInputChange = value => {
        let id = getVideoID( value );

        if( id ) {
			let thumb = getYouTubeThumbnail( id, thumbnailQuality );

            if( thumb ) {
                setAttributes( { ytThumb: thumb } );
            }
            setError( { ...error, invalidUrl: '' } );
        } else {
            setError( {...error, invalidUrl: __( 'Please use a valid YouTube video link', 'youtube-video-loader' ) } );
        }

        setAttributes( { embedUrl: value } );
    };

	const handleQualityChange = quality => {
		let id = getVideoID( embedUrl );
	    let thumb = getYouTubeThumbnail( id, quality );

	    setError( { ...error, invalidThumbQuality: '' } );
	    setAttributes( { thumbnailQuality: quality, ytThumb: thumb } );
	};

	const handleThumbError = () => {
		setError( { ...error, invalidThumbQuality: __( 'This quality isn\'t available for this video. Pick a different one.', 'youtube-video-loader' ) } );
	};

	const handleThumbLoad = () => {
	    setError( { ...error, invalidThumbQuality: '' } );
	};

    const handleWidthChange = value => {
        let width = parseFloat( value );

        if( isNaN( width ) || width < 0 ) {
            setError( { ...error, invalidWidth: __( 'Please enter non-negative value', 'youtube-video-loader' ) } );
            width = 0;
        } else {
            setError( { ...error, invalidWidth: '' } );
        }

        setAttributes( { frameWidth: width } );
    };

    const handleOpacityChange = value => {
		setOpacityInput( value );

        let opacity = parseFloat( value );

        if( isNaN( opacity ) || opacity > 1 || opacity < 0 ) {
			setError( { ...error, invalidOpacity: __( 'Opacity value should be between "1" and "0"', 'youtube-video-loader' ) } );
			return;
		}

		setError( { ...error, invalidOpacity: '' } );
		setAttributes( { thumbOpacity: opacity } );
    };

	const handleOpacityBlur = () => {
		let opacity = parseFloat( opacityInput );

		if( isNaN( opacity ) ) {
			opacity = thumbOpacity;
		} else {
			opacity = Math.min( Math.max( opacity, 0 ), 1 );
		}

		setOpacityInput( String( opacity ) );
		setError( { ...error, invalidOpacity: '' } );
		setAttributes( { thumbOpacity: opacity } );
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
				<img className='ytvl-thumb-img' style={ thumbStyle } src={ ytThumb } alt={ defaultThumbAlt } onError={ handleThumbError } onLoad={ handleThumbLoad } />
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
                { isSelected && <span className='ytvl-info'>{ __( 'Enter YouTube video link and thumbnail information via settings.', 'youtube-video-loader' ) }</span> }

                <div className='ytvl-editor-preview-wrapper' style={ wrapperStyle }>
                    <ThumbInfo />
                    <div className="ytvl-button-overlay"><span className='loader-icon'>{ ytIcon }</span></div>
                </div>

				{ captionText && <p className='ytvl-caption'>{ captionText }</p> }
            </div>
        );
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={ __( 'Settings', 'youtube-video-loader' ) }>
                    <TextControl
                        __next40pxDefaultSize
                        label={ __( 'Video URL', 'youtube-video-loader' ) }
                        value={ embedUrl || '' }
                        onChange={ ( value ) => handleUrlInputChange( value ) }
						placeholder='https://youtube.com/watch?v=video_ID'
						help={ __( 'Enter YouTube video url', 'youtube-video-loader' ) }
                    />

                    { error?.invalidUrl && <p className='ytvl-error'>{ error?.invalidUrl }</p> }

                    <ToggleControl
                        checked={ !! useCustomPreviewImage }
                        label={ __( 'Use custom image for video preview', 'youtube-video-loader' ) }
                        onChange={ () => setAttributes( { useCustomPreviewImage: ! useCustomPreviewImage, } ) }
                    />

                    { ( ytThumb && !useCustomPreviewImage ) && (
                        <>
                            <img className='ytvl-thumb-img' src={ ytThumb } alt={ defaultThumbAlt } onError={ handleThumbError } onLoad={ handleThumbLoad } />
                            <span className='ytvl-thumb-img-info'>{ __( 'Default thumbnail for the video url.', 'youtube-video-loader' ) }</span>
                        </>
                    ) }

                    { useCustomPreviewImage && <MediaComponent image={ customPreviewImage } />}

					{ !useCustomPreviewImage && (
						<>
							<SelectControl
								label={ __( 'Thumbnail Quality', 'youtube-video-loader' ) }
								value={ thumbnailQuality }
								onChange={ ( quality ) => handleQualityChange( quality ) }
								options={ [
									{ value: 'mqdefault', label: __( 'Medium', 'youtube-video-loader' ) },
									{ value: 'hqdefault', label: __( 'High (default)', 'youtube-video-loader' ) },
									{ value: 'sddefault', label: __( 'Standard', 'youtube-video-loader' ) },
									{ value: 'maxresdefault', label: __( 'Max Resolution — not available for every video', 'youtube-video-loader' ) },
								] }
							/>

							{ error?.invalidThumbQuality && <p className='ytvl-error'>{ error?.invalidThumbQuality }</p> }
						</>
					) }

					<TextControl
					    __next40pxDefaultSize
					    label={ __( 'Thumbnail Alt Text', 'youtube-video-loader' ) }
					    help={ __( 'Describes the thumbnail for screen readers. Leave blank to use the default text.', 'youtube-video-loader' ) }
					    value={ thumbnailAltText }
					    onChange={ ( value ) => setAttributes( { thumbnailAltText: value } ) }
					/>

                    <TextControl
                        __next40pxDefaultSize
                        label={ __( 'Thumbnail Opacity', 'youtube-video-loader' ) }
                        value={ opacityInput }
                        onChange={ ( value ) => handleOpacityChange( value ) }
						onBlur={ handleOpacityBlur }
                    />

                    { error?.invalidOpacity && <p className='ytvl-error'>{ error?.invalidOpacity }</p> }

                    <SelectControl
                        label={ __( 'Thumbnail Object Fit Control', 'youtube-video-loader' ) }
                        value={ thumbFit }
                        onChange={ ( fit ) => {
                            setAttributes( { thumbFit: fit } );
                        } }
                        options={ [
                            { value: 'cover', label: __( 'Cover', 'youtube-video-loader' ) },
                            { value: 'contain', label: __( 'Contain', 'youtube-video-loader' ) },
                        ] }
                    />

					<SelectControl
						label={ __( 'Aspect Ratio', 'youtube-video-loader' ) }
						value={ aspectRatio }
						onChange={ ( ratio ) => {
							setAttributes( { aspectRatio: ratio } );
						} }
						options={ [
							{ value: '16/9', label: __( '16:9 (Standard widescreen)', 'youtube-video-loader' ) },
							{ value: '4/3', label: __( '4:3 (Classic)', 'youtube-video-loader' ) },
							{ value: '1/1', label: __( '1:1 (Square)', 'youtube-video-loader' ) },
							{ value: '9/16', label: __( '9:16 (Vertical / Shorts)', 'youtube-video-loader' ) },
						] }
					/>

                    <TextControl
                        __next40pxDefaultSize
                        label={ __( 'Container Max Width', 'youtube-video-loader' ) }
                        value={ frameWidth || '' }
                        onChange={ ( value ) => handleWidthChange( value ) }
						help={ __( 'Max width value is in (px)', 'youtube-video-loader' ) }
                    />

                    { error?.invalidWidth && <p className='ytvl-error'>{ error?.invalidWidth } </p>}

					<ToggleControl
						checked={ !! lazyLoadThumbnail }
						label={ __( 'Lazy load thumbnail', 'youtube-video-loader' ) }
						onChange={ () => setAttributes( { lazyLoadThumbnail: ! lazyLoadThumbnail } ) }
						help={ __( 'Turn this off if this block sits above the fold (e.g. a hero section) — lazy loading it there can delay the image and hurt page load performance.', 'youtube-video-loader' ) }
					/>

					<ToggleControl
						checked={ !! muteOnAutoplay }
						label={ __( 'Mute video on autoplay', 'youtube-video-loader' ) }
						onChange={ () => setAttributes( { muteOnAutoplay: ! muteOnAutoplay } ) }
						help={ __( 'Since the video only autoplays after a visitor clicks, browsers allow autoplay with sound here — turn this off if you want it to play unmuted.', 'youtube-video-loader' ) }
					/>

					<TextControl
						__next40pxDefaultSize
						label={ __( 'Caption', 'youtube-video-loader' ) }
						help={ __( 'Optional text shown below the video.', 'youtube-video-loader' ) }
						value={ captionText }
						onChange={ ( value ) => setAttributes( { captionText: value } ) }
					/>

                </PanelBody>

            </InspectorControls>

            <Data />
        </>
    );
}
