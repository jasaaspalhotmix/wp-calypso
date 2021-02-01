/**
 * Internal dependencies
 */
import type { Plan, PlanFeature, FeaturesByType, PlanProduct } from './types';

type setFeaturesAction = {
	type: 'SET_FEATURES';
	features: Record< string, PlanFeature >;
};
export const setFeatures = ( features: Record< string, PlanFeature > ): setFeaturesAction => {
	return {
		type: 'SET_FEATURES' as const,
		features,
	};
};

type setFeaturesByTypeAction = {
	type: 'SET_FEATURES_BY_TYPE';
	featuresByType: Array< FeaturesByType >;
};
export const setFeaturesByType = (
	featuresByType: Array< FeaturesByType >
): setFeaturesByTypeAction => {
	return {
		type: 'SET_FEATURES_BY_TYPE' as const,
		featuresByType,
	};
};

type setPlansAction = {
	type: 'SET_PLANS';
	plans: Plan[];
};
export const setPlans = ( plans: Plan[] ): setPlansAction => {
	return {
		type: 'SET_PLANS' as const,
		plans,
	};
};

type setPlanProductsAction = {
	type: 'SET_PLAN_PRODUCTS';
	products: PlanProduct[];
};
export const setPlanProducts = ( products: PlanProduct[] ): setPlanProductsAction => {
	return {
		type: 'SET_PLAN_PRODUCTS' as const,
		products,
	};
};

type resetPlanAction = { type: 'RESET_PLAN' };
export const resetPlan = (): resetPlanAction => {
	return {
		type: 'RESET_PLAN' as const,
	};
};

export type PlanAction = ReturnType<
	| typeof setFeatures
	| typeof setFeaturesByType
	| typeof setPlans
	| typeof resetPlan
	| typeof setPlanProducts
	| ( () => { type: 'NOOP' } )
>;
