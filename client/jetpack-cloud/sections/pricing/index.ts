/**
 * Internal dependencies
 */
import { jetpackPricingContext } from './controller';
import config from '@automattic/calypso-config';
import userFactory from 'calypso/lib/user';
import { cloudSiteSelection } from 'calypso/jetpack-cloud/controller';
import jetpackPlans from 'calypso/my-sites/plans/jetpack-plans';

/**
 * Style dependencies
 */
import './style.scss';

export default function (): void {
	const user = userFactory();
	const isLoggedOut = ! user.get();

	jetpackPlans( `/:locale/pricing`, jetpackPricingContext );

	if ( isLoggedOut ) {
		jetpackPlans( `/pricing`, jetpackPricingContext );

		if ( config.isEnabled( 'jetpack-cloud/connect' ) ) {
			jetpackPlans( `/plans`, jetpackPricingContext );
		}
	} else {
		jetpackPlans( `/pricing/:site?`, cloudSiteSelection, jetpackPricingContext );

		if ( config.isEnabled( 'jetpack-cloud/connect' ) ) {
			jetpackPlans( `/plans/:site?`, cloudSiteSelection, jetpackPricingContext );
		}
	}
}
