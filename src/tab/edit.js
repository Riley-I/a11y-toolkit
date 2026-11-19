import { __ } from '@wordpress/i18n';
import {
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import './editor.scss';

const TEMPLATE = [ [ 'core/paragraph' ] ];

// Only inline formats that are valid inside a <button>: view.js copies the
// title into a button, and links (interactive content) can't be nested there.
const ALLOWED_FORMATS = [ 'core/bold', 'core/italic' ];

/**
 * @param {Object}                    props
 * @param {Object}                    props.attributes
 * @param {( attrs: Object ) => void} props.setAttributes
 */
export default function Edit( { attributes, setAttributes } ) {
	const { title } = attributes;

	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'tab-panel' },
		{ template: TEMPLATE }
	);

	return (
		<div { ...blockProps }>
			<RichText
				tagName="h3"
				className="tab-title"
				aria-label={ __( 'Tab title', 'a11y-toolkit' ) }
				placeholder={ __( 'Tab title…', 'a11y-toolkit' ) }
				allowedFormats={ ALLOWED_FORMATS }
				withoutInteractiveFormatting
				value={ title }
				onChange={ ( value ) => setAttributes( { title: value } ) }
			/>
			<div { ...innerBlocksProps } />
		</div>
	);
}
