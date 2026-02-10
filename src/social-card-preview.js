/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Modal, Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { store as coreStore } from '@wordpress/core-data';

const SocialCardPreview = ( { onClose } ) => {
	const { title, excerpt, imageUrl, siteUrl, postUrl } = useSelect( ( select ) => {
		const { getEditedPostAttribute, getPermalink } = select( editorStore );
		const featuredMediaId = getEditedPostAttribute( 'featured_media' );

		let featuredImageUrl = '';
		if ( featuredMediaId ) {
			const media = select( coreStore ).getMedia( featuredMediaId );
			featuredImageUrl =
				media?.media_details?.sizes?.large?.source_url ||
				media?.source_url ||
				'';
		}

		return {
			title: getEditedPostAttribute( 'title' ) || '',
			excerpt: getEditedPostAttribute( 'excerpt' ) || '',
			imageUrl: featuredImageUrl,
			siteUrl: select( coreStore ).getSite()?.url || '',
			postUrl: getPermalink() || '',
		};
	}, [] );

	const domain = siteUrl ? new URL( siteUrl ).hostname : '';
	const truncatedExcerpt =
		excerpt.length > 200 ? excerpt.substring( 0, 200 ) + '…' : excerpt;

	const shareUrl = `https://x.com/intent/tweet?url=${ encodeURIComponent( postUrl ) }&text=${ encodeURIComponent( title ) }`;

	return (
		<Modal
			title={ __( 'X Preview', 'social-card-preview' ) }
			onRequestClose={ onClose }
			size="medium"
		>
			<div className="social-card-preview">
				<div className="social-card-preview__card social-card-preview__card--twitter">
					{ imageUrl && (
						<img
							className="social-card-preview__image"
							src={ imageUrl }
							alt=""
						/>
					) }
					<div className="social-card-preview__content">
						<span className="social-card-preview__domain">
							{ domain }
						</span>
						<span className="social-card-preview__title">
							{ title }
						</span>
						<span className="social-card-preview__description">
							{ truncatedExcerpt }
						</span>
					</div>
				</div>

				<div className="social-card-preview__actions">
					<Button
						variant="primary"
						href={ shareUrl }
						target="_blank"
						rel="noopener noreferrer"
					>
						{ __( 'Share on X', 'social-card-preview' ) }
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default SocialCardPreview;
