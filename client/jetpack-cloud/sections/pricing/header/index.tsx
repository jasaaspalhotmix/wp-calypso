/**
 * External dependencies
 */
import classNames from 'classnames';
import { useTranslate, TranslateResult } from 'i18n-calypso';
import React, { useMemo } from 'react';

/**
 * Internal dependencies
 */
import JetpackComMasterbar from '../jpcom-masterbar';
import FormattedHeader from 'calypso/components/formatted-header';
import OlarkChat from 'calypso/components/olark-chat';
import config from '@automattic/calypso-config';
import { preventWidows } from 'calypso/lib/formatting';
import { getCurrentCROIterationName } from 'calypso/my-sites/plans/jetpack-plans/iterations';
import { Iterations } from 'calypso/my-sites/plans/jetpack-plans/iterations';

// New Year 2021 promotion; runs from Jan 1 00:00 to Jan 18 23:59 UTC automatically.
// Safe to remove on or after Jan 19.
import NewYear2021SaleBanner from 'calypso/components/jetpack/new-year-2021-sale-banner';

/**
 * Style dependencies
 */
import './style.scss';

const Header: React.FC< Props > = ( { urlQueryArgs } ) => {
	const identity = config( 'olark_chat_identity' );
	const translate = useTranslate();
	const iteration = useMemo( getCurrentCROIterationName, [] ) as Iterations;
	const title =
		iteration === 'spp'
			? translate( 'Security, performance, and marketing tools for WordPress' )
			: translate( 'Security, performance, and marketing tools made for WordPress' );

	return (
		<>
			{ identity && <OlarkChat { ...{ identity } } /> }
			<JetpackComMasterbar />

			<NewYear2021SaleBanner urlQueryArgs={ urlQueryArgs } />

			<div className={ classNames( 'header', iteration ) }>
				<FormattedHeader
					className="header__main-title"
					headerText={ preventWidows( title ) }
					align="center"
				/>
			</div>
		</>
	);
};

type Props = {
	urlQueryArgs: { [ key: string ]: string };
};

export default Header;
