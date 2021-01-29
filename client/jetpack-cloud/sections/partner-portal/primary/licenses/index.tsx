/**
 * External dependencies
 */
import React, { ReactElement, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslate } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Main from 'calypso/components/main';
import { Button } from '@automattic/components';
import Gridicon from 'calypso/components/gridicon';
import CardHeading from 'calypso/components/card-heading';
import DocumentHead from 'calypso/components/data/document-head';
import LicenseList from 'calypso/jetpack-cloud/sections/partner-portal/license-list';
import { fetchLicenses } from 'calypso/state/partner-portal/licenses/actions';

export default function Licenses(): ReactElement {
	const translate = useTranslate();
	const dispatch = useDispatch();

	// Development-only tool to test queries, debouncing and responses received out of order.
	// To be removed once a live API starts being used.
	const refresh = useCallback( () => {
		dispatch( fetchLicenses );
	}, [ dispatch ] );

	return (
		<Main wideLayout={ true } className="licenses">
			<DocumentHead title={ translate( 'Licenses' ) } />

			<CardHeading size={ 36 }>
				{ translate( 'Licenses' ) }
				<Button
					onClick={ refresh }
					compact
					style={ { verticalAlign: 'middle', marginLeft: '10px' } }
				>
					<Gridicon icon="refresh" />
				</Button>
			</CardHeading>

			<LicenseList />
		</Main>
	);
}
