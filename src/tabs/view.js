/**
 * Front-end enhancement for a11y/tabs, following the WAI-ARIA APG Tabs pattern:
 * https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 *
 * Saved markup (no ARIA, readable without JS):
 *
 *   <div class="wp-block-a11y-tabs" data-activation="automatic" data-label="…">
 *     <div class="wp-block-a11y-tab">
 *       <h3 class="tab-title">Title</h3>
 *       <section class="tab-panel">…</section>
 *     </div>
 *     …
 *   </div>
 *
 * Enhanced result:
 *
 *   <div class="wp-block-a11y-tabs is-enhanced" …>
 *     <div role="tablist" aria-label="…">
 *       <button type="button" role="tab" id aria-selected aria-controls tabindex>…</button>
 *       …
 *     </div>
 *     <div class="wp-block-a11y-tab">
 *       <h3 class="tab-title" hidden>Title</h3>
 *       <section class="tab-panel" role="tabpanel" id aria-labelledby tabindex="0" [hidden]>…</section>
 *     </div>
 *     …
 *   </div>
 */

let instanceCount = 0;

/**
 * Copy a heading's (bold/italic) content into a tab without duplicating ids.
 *
 * @param {HTMLElement} heading
 * @param {HTMLElement} tab
 */
function copyTitle( heading, tab ) {
	for ( const node of heading.childNodes ) {
		const clone = node.cloneNode( true );
		if ( clone instanceof window.Element ) {
			clone.removeAttribute( 'id' );
			clone
				.querySelectorAll( '[id]' )
				.forEach( ( el ) => el.removeAttribute( 'id' ) );
		}
		tab.append( clone );
	}
}

/**
 * @param {HTMLElement} root A .wp-block-a11y-tabs element.
 */
function enhance( root ) {
	if ( root.classList.contains( 'is-enhanced' ) ) {
		return;
	}

	// `:scope >` so a nested Tabs block only manages its own direct children.
	const items = Array.from(
		root.querySelectorAll( ':scope > .wp-block-a11y-tab' ),
		( el ) => ( {
			heading: el.querySelector( ':scope > .tab-title' ),
			panel: el.querySelector( ':scope > .tab-panel' ),
		} )
	).filter( ( { heading, panel } ) => heading && panel );

	if ( ! items.length ) {
		return;
	}

	const uid = `a11y-tabs-${ ++instanceCount }`;
	const isManual = root.dataset.activation === 'manual';

	// role="tablist" groups the tabs so screen readers announce "tab list" and
	// the tab count/position ("tab, 2 of 4"). A new container is needed because
	// the tabs must be owned by the tablist, while the saved headings are
	// interleaved with the panels.
	const tablist = document.createElement( 'div' );
	tablist.setAttribute( 'role', 'tablist' );
	tablist.className = 'tab-list';

	// APG: a tablist needs an accessible name when there's no visible label to
	// point aria-labelledby at. The author-supplied label lives in data-label in
	// the saved HTML (aria-label on a plain div is prohibited).
	if ( root.dataset.label ) {
		tablist.setAttribute( 'aria-label', root.dataset.label );
	}

	// aria-orientation is omitted: "horizontal" is the implicit default for
	// tablist, which matches the Left/Right arrow keys handled below.

	const panels = items.map( ( { panel } ) => panel );

	const tabs = items.map( ( { heading, panel }, i ) => {
		// A native <button> gives us Enter/Space activation, focusability and
		// a click event for free; role="tab" replaces its "button" semantics so
		// it is announced as a tab with selected state and position.
		const tab = document.createElement( 'button' );
		tab.type = 'button';
		tab.className = 'tab-button';
		tab.id = `${ uid }-tab-${ i + 1 }`;
		tab.setAttribute( 'role', 'tab' );

		if ( heading.textContent.trim() ) {
			copyTitle( heading, tab );
		} else {
			// Never ship a tab with no accessible name; fall back to its number.
			tab.textContent = String( i + 1 );
		}

		// Respect an existing id (e.g. an author-set anchor) so in-page links
		// keep working; otherwise generate one.
		if ( ! panel.id ) {
			panel.id = `${ uid }-panel-${ i + 1 }`;
		}

		// aria-controls ties the tab to the panel it shows (some screen
		// readers offer a "jump to controlled element" command).
		tab.setAttribute( 'aria-controls', panel.id );

		// role="tabpanel" on the <section> (an allowed role override) marks it
		// as the content region for a tab.
		panel.setAttribute( 'role', 'tabpanel' );

		// aria-labelledby names the panel after its tab, so entering the panel
		// announces e.g. "Specifications, tab panel" rather than nothing.
		panel.setAttribute( 'aria-labelledby', tab.id );

		// APG: panels get tabindex="0" so Tab from the tablist lands on the
		// panel itself, making its content reachable even when it contains no
		// focusable elements (e.g. only text). Hidden panels are skipped
		// automatically because [hidden] removes them from the tab order.
		panel.tabIndex = 0;

		// The heading text now lives in the tab and names the panel; leaving it
		// visible would duplicate the title for everyone. `hidden` removes it
		// from the accessibility tree as well as from view.
		heading.hidden = true;

		tablist.append( tab );
		return tab;
	} );

	/**
	 * Select a tab: update aria-selected, roving tabindex and panel visibility.
	 *
	 * @param {number}  index
	 * @param {boolean} moveFocus
	 */
	function select( index, moveFocus ) {
		tabs.forEach( ( tab, i ) => {
			const selected = i === index;

			// aria-selected is how AT knows which tab is current. Set it on
			// every tab explicitly ("false" rather than absent) so the state is
			// announced unambiguously.
			tab.setAttribute( 'aria-selected', String( selected ) );

			// Roving tabindex: only the selected tab is in the Tab sequence, so
			// the whole tablist is a single Tab stop and arrow keys move within
			// it. Tab from the tablist then goes straight to the active panel.
			tab.tabIndex = selected ? 0 : -1;

			// `hidden` hides inactive panels from sighted users, AT and the Tab
			// order in one go.
			panels[ i ].hidden = ! selected;
		} );

		if ( moveFocus ) {
			tabs[ index ].focus();
		}
	}

	tablist.addEventListener( 'keydown', ( event ) => {
		const current = tabs.indexOf( event.target.closest( '[role="tab"]' ) );
		if (
			current === -1 ||
			event.altKey ||
			event.ctrlKey ||
			event.metaKey
		) {
			// Leave modified keys alone (browser/AT shortcuts like Alt+Left).
			return;
		}

		// In RTL layouts the first tab is on the right, so "Right" visually
		// means "previous". Swap so arrows follow what the user sees.
		const step =
			window.getComputedStyle( tablist ).direction === 'rtl' ? -1 : 1;
		let next;

		switch ( event.key ) {
			case 'ArrowRight':
				next = current + step;
				break;
			case 'ArrowLeft':
				next = current - step;
				break;
			case 'Home':
				next = 0;
				break;
			case 'End':
				next = tabs.length - 1;
				break;
			default:
				return;
		}

		// APG: Left/Right wrap from last to first and vice versa.
		next = ( next + tabs.length ) % tabs.length;
		event.preventDefault();

		if ( isManual ) {
			// Manual activation: arrows only move focus. The user presses
			// Enter/Space (native button → click) to show the panel. The roving
			// tabindex stays on the *selected* tab, so tabbing away and back
			// returns to the tab whose panel is visible.
			tabs[ next ].focus();
		} else {
			// Automatic activation: focusing a tab also shows its panel.
			select( next, true );
		}
	} );

	// Handles mouse/touch and, via native <button> behaviour, Enter/Space.
	tablist.addEventListener( 'click', ( event ) => {
		const index = tabs.indexOf( event.target.closest( '[role="tab"]' ) );
		if ( index !== -1 ) {
			// Explicit focus: Safari doesn't focus buttons on click.
			select( index, true );
		}
	} );

	// The tablist must precede the panels in DOM order so Tab moves from the
	// tablist into the active panel, matching the visual order.
	root.prepend( tablist );
	select( 0, false );

	// Hook for CSS: tab styles only apply once the widget is fully wired up.
	root.classList.add( 'is-enhanced' );
}

document.querySelectorAll( '.wp-block-a11y-tabs' ).forEach( enhance );
