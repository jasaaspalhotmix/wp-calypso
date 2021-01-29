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
import { combineReducers, withoutPersistence } from 'calypso/state/utils';

export const initialState = {
	hasFetched: false,
	isFetching: false,
	all: [],
};

export const hasFetched = withoutPersistence(
	( state = initialState.hasFetched, action: AnyAction ) => {
		switch ( action.type ) {
			case JETPACK_PARTNER_PORTAL_LICENSES_RECEIVE:
				return true;
		}

		return state;
	}
);

export const isFetching = withoutPersistence(
	( state = initialState.isFetching, action: AnyAction ) => {
		switch ( action.type ) {
			case JETPACK_PARTNER_PORTAL_LICENSES_REQUEST:
				return true;

			case JETPACK_PARTNER_PORTAL_LICENSES_RECEIVE:
				return false;
		}

		return state;
	}
);

export const all = withoutPersistence( ( state = initialState.all, action: AnyAction ) => {
	switch ( action.type ) {
		case JETPACK_PARTNER_PORTAL_LICENSES_RECEIVE:
			return action.licenses;
	}

	return state;
} );

export default combineReducers( {
	hasFetched,
	isFetching,
	all,
} );
