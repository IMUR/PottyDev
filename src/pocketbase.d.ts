declare module 'pocketbase' {
	interface RecordData {
		[key: string]: string | number | boolean | object;
	}

	class Record {
		id: string;
		collectionId: string;
		collectionName: string;
		created: string;
		updated: string;
		[key: string]: string | number | boolean | object;
	}

	class Collection {
		getFullList(): Promise<Record[]>;
		create(data: RecordData): Promise<Record>;
	}

	class PocketBase {
		constructor(baseURL: string);
		collection(collectionName: string): Collection;
	}

	export = PocketBase;
}
