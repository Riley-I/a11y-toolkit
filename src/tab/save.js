import {
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

/**
 * Saves a real heading + <section>, with no ARIA roles. Without JavaScript this
 * is a normal document: screen reader users can jump between tabs with heading
 * navigation and every panel is visible. view.js (on the parent Tabs block)
 * upgrades this to the APG tab pattern at runtime.
 *
 * @param {Object} props
 * @param {Object} props.attributes
 */
export default function save( { attributes } ) {
	const { title } = attributes;

	return (
		<div { ...useBlockProps.save() }>
			<RichText.Content
				tagName="h3"
				className="tab-title"
				value={ title }
			/>
			<section
				{ ...useInnerBlocksProps.save( { className: 'tab-panel' } ) }
			/>
		</div>
	);
}
