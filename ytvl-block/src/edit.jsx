import { __ } from '@wordpress/i18n';
import { InspectorControls, MediaPlaceholder, RichText, PanelColorSettings, ContrastChecker, FontSizePicker, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, Button, SelectControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { ytIcon, previewImg, getVideoID, getYouTubeThumbnail, getConsentStyle } from './assets';


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
		captionText,
		consentEnabled,
		consentText,
		consentButtonLabel,
		consentTextColor,
		consentBackgroundColor,
		consentButtonBackground,
		consentButtonTextColor,
		consentFontSize
    }  = attributes;

	const defaultThumbAlt = thumbnailAltText || __( 'Video Preview Thumbnail', 'youtube-video-loader' );

	const defaultConsentText = __( 'This video is provided by YouTube. If you continue, your browser will connect to YouTube\'s servers, which may set cookies and collect data about your visit. Load the video?', 'youtube-video-loader' );
	const defaultConsentButtonLabel = __( 'Yes, load video', 'youtube-video-loader' );

    const wrapperStyle = {
        maxWidth: frameWidth ? frameWidth + 'px' : undefined,
		aspectRatio
    };

	// Opacity, object fit and lazy loading only apply to an image on screen.
	// With the notice on, that's a custom image and nothing else.
	const showImageSettings = ! consentEnabled || ( useCustomPreviewImage && customPreviewImage?.length );

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

	const handleConsentToggle = enabled => {
		const updates = { consentEnabled: enabled };

		// Seed the translatable defaults the first time the notice is turned on.
		if( enabled && ! consentText ) {
			updates.consentText = defaultConsentText;
		}

		if( enabled && ! consentButtonLabel ) {
			updates.consentButtonLabel = defaultConsentButtonLabel;
		}

		setAttributes( updates );
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
						className='ytvl-media-component'
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

    // Called as a plain function (see the return below), not rendered as
    // <Data />. As a component defined inside Edit it would be re-created on
    // every render, and the RichText in the consent notice would lose focus
    // after each keystroke.
    const Data = () => {
        return (
            <div { ...blockProps }>
                { isSelected && <span className='ytvl-info'>{ __( 'Enter YouTube video link and thumbnail information via settings.', 'youtube-video-loader' ) }</span> }

				{ consentEnabled ? (
					<div className='ytvl-editor-preview-wrapper ytvl-consent-mode' style={ wrapperStyle }>
						{ ( useCustomPreviewImage && customPreviewImage?.length ) ? (
							<img className='ytvl-thumb-img' style={ thumbStyle } src={ customPreviewImage[1] } alt='' />
						) : null }

						<div className='ytvl-consent' style={ getConsentStyle( attributes ) }>
							<RichText
								tagName='p'
								className='ytvl-consent-text'
								value={ consentText }
								onChange={ ( value ) => setAttributes( { consentText: value } ) }
								allowedFormats={ [ 'core/bold', 'core/italic', 'core/link' ] }
								placeholder={ __( 'Write the notice visitors see before the video loads…', 'youtube-video-loader' ) }
							/>
							<button type='button' className='ytvl-consent-accept' tabIndex={ -1 }>
								{ consentButtonLabel || defaultConsentButtonLabel }
							</button>
						</div>
					</div>
				) : (
					<div className='ytvl-editor-preview-wrapper' style={ wrapperStyle }>
						<ThumbInfo />
						<div className="ytvl-button-overlay"><span className='loader-icon'>{ ytIcon }</span></div>
					</div>
				) }

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

                    { ( ytThumb && !useCustomPreviewImage && !consentEnabled ) && (
                        <>
                            <img className='ytvl-thumb-img' src={ ytThumb } alt={ defaultThumbAlt } onError={ handleThumbError } onLoad={ handleThumbLoad } />
                            <span className='ytvl-thumb-img-info'>{ __( 'Default thumbnail for the video url.', 'youtube-video-loader' ) }</span>
                        </>
                    ) }

                    { useCustomPreviewImage && <MediaComponent image={ customPreviewImage } />}

					{ ( !useCustomPreviewImage && !consentEnabled ) && (
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

					{ ( !consentEnabled && !useCustomPreviewImage ) && (
						<TextControl
						    __next40pxDefaultSize
						    label={ __( 'Thumbnail Alt Text', 'youtube-video-loader' ) }
						    help={ __( 'Describes the thumbnail for screen readers. Leave blank to use the default text.', 'youtube-video-loader' ) }
						    value={ thumbnailAltText }
						    onChange={ ( value ) => setAttributes( { thumbnailAltText: value } ) }
						/>
					) }

                    { showImageSettings && (
						<>
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
						</>
					)}

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

					{ showImageSettings && (
						<ToggleControl
							checked={ !! lazyLoadThumbnail }
							label={ __( 'Lazy load thumbnail', 'youtube-video-loader' ) }
							onChange={ () => setAttributes( { lazyLoadThumbnail: ! lazyLoadThumbnail } ) }
							help={ __( 'Turn this off if this block sits above the fold (e.g. a hero section) — lazy loading it there can delay the image and hurt page load performance.', 'youtube-video-loader' ) }
						/>
					) }

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

				<PanelBody title={ __( 'Consent Notice', 'youtube-video-loader' ) } initialOpen={ !! consentEnabled }>
					<ToggleControl
						checked={ !! consentEnabled }
						label={ __( 'Ask visitors before loading YouTube', 'youtube-video-loader' ) }
						onChange={ handleConsentToggle }
						help={ __( 'Shows a notice instead of the thumbnail, and no YouTube thumbnail is loaded. The video only loads after a visitor clicks the button. Edit the notice text directly in the block.', 'youtube-video-loader' ) }
					/>

					{ consentEnabled && (
						<TextControl
							__next40pxDefaultSize
							label={ __( 'Button Label', 'youtube-video-loader' ) }
							value={ consentButtonLabel }
							onChange={ ( value ) => setAttributes( { consentButtonLabel: value } ) }
						/>
					) }
				</PanelBody>

				{ consentEnabled && (
					<PanelColorSettings
						title={ __( 'Notice Style', 'youtube-video-loader' ) }
						initialOpen={ false }
						colorSettings={ [
							{
								value: consentTextColor,
								onChange: ( color ) => setAttributes( { consentTextColor: color || '' } ),
								label: __( 'Text', 'youtube-video-loader' ),
							},
							{
								value: consentBackgroundColor,
								onChange: ( color ) => setAttributes( { consentBackgroundColor: color || '' } ),
								label: __( 'Background', 'youtube-video-loader' ),
								enableAlpha: true,
							},
							{
								value: consentButtonTextColor,
								onChange: ( color ) => setAttributes( { consentButtonTextColor: color || '' } ),
								label: __( 'Button text', 'youtube-video-loader' ),
							},
							{
								value: consentButtonBackground,
								onChange: ( color ) => setAttributes( { consentButtonBackground: color || '' } ),
								label: __( 'Button background', 'youtube-video-loader' ),
							},
						] }
					>
						<ContrastChecker textColor={ consentTextColor } backgroundColor={ consentBackgroundColor } />
						<ContrastChecker textColor={ consentButtonTextColor } backgroundColor={ consentButtonBackground } />

						<div className="ytvl-font-size-control">
							<FontSizePicker
								__next40pxDefaultSize
								value={ consentFontSize || undefined }
								onChange={ ( size ) => setAttributes( { consentFontSize: size || '' } ) }
								withReset
							/>
						</div>
					</PanelColorSettings>
				) }

            </InspectorControls>

            { Data() }
        </>
    );
}
