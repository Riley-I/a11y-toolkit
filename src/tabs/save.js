import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Progressive-enhancement markup: a plain wrapper around the child tabs, each
 * of which saves a heading + section. No ARIA roles are saved, because
 * role="tablist"/"tab"/"tabpanel" promise keyboard behaviour that only exists
 * once view.js runs. Without JS (or if it fails), screen reader users get an
 * ordinary, fully navigable document outline instead of a broken widget.
 *
 * The tab list label and activation mode are stored as data-* attributes,
 * not aria-label: aria-label is prohibited on a generic <div> and would be
 * ignored or announced inconsistently. view.js moves the label onto the
 * role="tablist" element, where it is valid and meaningful.
 *
 * @param {Object} props
 * @param {Object} props.attributes
 */
export default function save( { attributes } ) {
	const { label, activation } = attributes;

	const blockProps = useBlockProps.save( {
		'data-activation': activation,
		'data-label': label || undefined,
	} );

	return <div { ...useInnerBlocksProps.save( blockProps ) } />;
}
