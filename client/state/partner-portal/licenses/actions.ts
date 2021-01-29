/**
 * External dependencies
 */
import { AnyAction } from 'redux';

/**
 * Internal dependencies
 */
import {
	JETPACK_PARTNER_PORTAL_LICENSES_REQUEST,
	JETPACK_PARTNER_PORTAL_LICENSES_RECEIVE,
} from 'calypso/state/action-types';
import { ReduxDispatch } from 'calypso/state/redux-store';
import { License, PartnerPortalStore } from 'calypso/state/partner-portal';
import { getActivePartnerKeyId } from 'calypso/state/partner-portal/partner/selectors';

// Required for modular state.
import 'calypso/state/partner-portal/init';

export function fetchLicenses( dispatch: ReduxDispatch, getState: () => PartnerPortalStore ): void {
	dispatch( {
		type: JETPACK_PARTNER_PORTAL_LICENSES_REQUEST,
		keyId: getActivePartnerKeyId( getState() ),
	} );
}

export function receiveLicenses( licenses: License[] ): AnyAction {
	return { type: JETPACK_PARTNER_PORTAL_LICENSES_RECEIVE, licenses };
}
