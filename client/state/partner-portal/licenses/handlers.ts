/**
 * External dependencies
 */
import { AnyAction } from 'redux';
import { translate } from 'i18n-calypso';
import shuffle from 'lodash/shuffle';

/**
 * Internal dependencies
 */
import {
	JETPACK_PARTNER_PORTAL_LICENSES_REQUEST,
	JETPACK_PARTNER_PORTAL_LICENSES_RECEIVE,
} from 'calypso/state/action-types';
import { License } from 'calypso/state/partner-portal';
import { dispatchRequest } from 'calypso/state/data-layer/wpcom-http/utils';
import { http } from 'calypso/state/data-layer/wpcom-http/actions';
import { errorNotice } from 'calypso/state/notices/actions';

// Required for modular state.
import 'calypso/state/partner-portal/init';

interface APILicense {
	license_id: number;
	license_key: string;
	issued_at: string;
	attached_at: string;
	revoked_at: string;
	domain: string;
	product: string;
	username: string;
	blog_id: number;
}

function fetchLicenses( action: AnyAction ) {
	return http(
		{
			method: 'GET',
			apiNamespace: 'wpcom/v2',
			path: '/jetpack-licensing/licenses',
			query: {
				key_id: action.keyId,
			},
		},
		action
	);
}

function receiveLicenses( action: AnyAction, licenses: License[] ) {
	const data: APILicense[] = [
		{
			license_id: 1,
			license_key: 'jetpack-security-daily_AcNAyEhPaSXeFVgRj0gZkgn0Z',
			issued_at: '2020-11-26 15:24:02',
			attached_at: '2021-11-26 15:24:08',
			revoked_at: '',
			domain: 'yetanothersite.net',
			product: 'Jetpack Security Daily',
			username: 'ianramosc',
			blog_id: 883882032,
		},
		{
			license_id: 2,
			license_key: 'jetpack-backup-daily_AcNAyEhPaSXeFVgRj0gZkgn0Z',
			issued_at: '2021-11-25 15:24:08',
			attached_at: '',
			revoked_at: '',
			domain: '',
			product: 'Jetpack Backup Daily',
			username: 'ianramosc',
			blog_id: 883882032,
		},
		{
			license_id: 3,
			license_key: 'jetpack-security-realtime_AcNAyEhPaSXeFVgRj0gZkgn0Z',
			issued_at: '2021-11-23 15:24:08',
			attached_at: '2021-11-23 15:25:08',
			revoked_at: '',
			domain: 'mygroovysite.co.uk',
			product: 'Jetpack Security Real-time',
			username: 'ianramosc',
			blog_id: 883882032,
		},
		{
			license_id: 4,
			license_key: 'jetpack-anti-spam_AcNAyEhPaSXeFVgRj0gZkgn0Z',
			issued_at: '2021-01-21 15:24:08',
			attached_at: '2021-11-21 15:24:18',
			revoked_at: '2021-01-22 15:24:33',
			domain: 'mylicenselesssite.com',
			product: 'Jetpack Anti-Spam',
			username: 'ianramosc',
			blog_id: 883882032,
		},
	];

	// Stub data.
	return {
		type: JETPACK_PARTNER_PORTAL_LICENSES_RECEIVE,
		licenses: shuffle( formatLicenses( data ) ),
	};

	return {
		type: JETPACK_PARTNER_PORTAL_LICENSES_RECEIVE,
		licenses,
	};
}

function receiveLicensesError() {
	return errorNotice( translate( 'Failed to retrieve your licenses. Please try again later.' ) );
}

function formatLicenses( licenses: APILicense[] ): License[] {
	return licenses.map( ( license ) => ( {
		licenseId: license.license_id,
		licenseKey: license.license_key,
		issuedAt: license.issued_at,
		attachedAt: license.attached_at,
		revokedAt: license.revoked_at,
		domain: license.domain,
		product: license.product,
		username: license.username,
		blogId: license.blog_id,
	} ) );
}

export default {
	[ JETPACK_PARTNER_PORTAL_LICENSES_REQUEST ]: [
		dispatchRequest( {
			fetch: fetchLicenses,
			onSuccess: receiveLicenses,
			onError: receiveLicensesError,
			fromApi: formatLicenses,
		} ),
	],
};
