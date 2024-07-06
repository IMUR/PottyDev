declare module '@geoapify/geocoder-autocomplete' {
	interface GeoapifyGeocoderAutocompleteOptions {
		placeholder: string;
		apiKey: string;
	}

	export class GeoapifyGeocoderAutocomplete {
		constructor(element: HTMLElement, options: GeoapifyGeocoderAutocompleteOptions);
	}
}
