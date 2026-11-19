<?php
// This file is generated. Do not modify it manually.
return array(
	'tab' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'a11y/tab',
		'version' => '0.1.0',
		'title' => 'Tab',
		'category' => 'widgets',
		'icon' => 'text-page',
		'description' => 'A single tab and its panel. Use inside a Tabs block.',
		'parent' => array(
			'a11y/tabs'
		),
		'attributes' => array(
			'title' => array(
				'type' => 'string',
				'source' => 'html',
				'selector' => '.tab-title',
				'default' => ''
			)
		),
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'textdomain' => 'a11y-toolkit',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css'
	),
	'tabs' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'a11y/tabs',
		'version' => '0.1.0',
		'title' => 'Tabs',
		'category' => 'widgets',
		'icon' => 'index-card',
		'description' => 'Accessible tabs following the WAI-ARIA APG Tabs pattern. Content stays readable as headings and sections without JavaScript.',
		'keywords' => array(
			'tabs',
			'tablist',
			'aria'
		),
		'allowedBlocks' => array(
			'a11y/tab'
		),
		'attributes' => array(
			'label' => array(
				'type' => 'string',
				'default' => ''
			),
			'activation' => array(
				'type' => 'string',
				'enum' => array(
					'automatic',
					'manual'
				),
				'default' => 'automatic'
			)
		),
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'a11y-toolkit',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScriptModule' => 'file:./view.js'
	)
);
