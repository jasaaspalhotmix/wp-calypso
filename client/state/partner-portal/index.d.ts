export interface APIError {
	status: number;
	code: string | null;
	message: string;
}

export interface PartnerKey {
	id: number;
	name: string;
	oauth2_token: string;
	disabled_on: string | null;
}

export interface Partner {
	id: number;
	slug: string;
	name: string;
	keys: PartnerKey[];
}

export interface PartnerStore {
	isFetching: boolean;
	activePartnerKey: number;
	current: Partner | null;
	error: string;
}

export interface License {
	licenseId: number;
	licenseKey: string;
	issuedAt: string;
	attachedAt: string;
	revokedAt: string;
	domain: string;
	product: string;
	username: string;
	blogId: number;
}

export interface LicensesStore {
	hasFetched: boolean;
	isFetching: boolean;
	all: License[];
}

export interface PartnerPortalStore {
	partner: PartnerStore;
	licenses: LicensesStore;
}

/**
 * Represents the entire Redux store but defines only the parts that the partner portal deals with.
 */
export interface PartnerPortalStore {
	partnerPortal: PartnerPortalStore;
}
