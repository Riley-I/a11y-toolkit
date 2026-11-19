import { __ } from '@wordpress/i18n';
import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import {
	Notice,
	PanelBody,
	RadioControl,
	TextControl,
} from '@wordpress/components';

import './editor.scss';

const ALLOWED_BLOCKS = [ 'a11y/tab' ];
const TEMPLATE = [ [ 'a11y/tab' ], [ 'a11y/tab' ] ];

/**
 * In the editor the tabs are shown stacked (heading + panel per tab), which
 * mirrors the no-JS front-end output. That keeps every panel editable and
 * avoids re-implementing a tab widget inside the editor canvas.
 *
 * @param {Object}                    props
 * @param {Object}                    props.attributes
 * @param {( attrs: Object ) => void} props.setAttributes
 */
export default function Edit( { attributes, setAttributes } ) {
	const { label, activation } = attributes;

	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: TEMPLATE,
		renderAppender: InnerBlocks.ButtonBlockAppender,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Tabs settings', 'a11y-toolkit' ) }>
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Tab list label', 'a11y-toolkit' ) }
						help={ __(
							'Announced by screen readers as the name of the tab list, e.g. “Product details”.',
							'a11y-toolkit'
						) }
						value={ label }
						onChange={ ( value ) =>
							setAttributes( { label: value } )
						}
					/>
					{ ! label.trim() && (
						<Notice status="warning" isDismissible={ false }>
							{ __(
								'Add a label so assistive technology can tell this tab list apart from others on the page.',
								'a11y-toolkit'
							) }
						</Notice>
					) }
					<RadioControl
						label={ __( 'Activation', 'a11y-toolkit' ) }
						selected={ activation }
						options={ [
							{
								label: __(
									'Automatic – arrow keys show the panel',
									'a11y-toolkit'
								),
								value: 'automatic',
							},
							{
								label: __(
									'Manual – arrow keys move focus, Enter/Space shows the panel',
									'a11y-toolkit'
								),
								value: 'manual',
							},
						] }
						help={ __(
							'Use manual activation when panels are slow to display (e.g. heavy media), so keyboard users are not forced to load every panel they pass.',
							'a11y-toolkit'
						) }
						onChange={ ( value ) =>
							setAttributes( { activation: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...innerBlocksProps } />
		</>
	);
}
