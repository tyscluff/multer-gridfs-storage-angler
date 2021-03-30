import anyTest, {TestInterface} from 'ava';
import {cleanStorage, mongoVersion} from './utils/testutils';
import {storageOptions} from './utils/settings';
import {GridFsStorage} from '../src';

const test = anyTest as TestInterface<any>;

test.afterEach.always('cleanup', async (t) => {
	await cleanStorage(t.context.storage);
});

test('is compatible with an options object on url based connections', async (t) => {
	const [major] = mongoVersion;
	const {url, options} = storageOptions();
	const storage = new GridFsStorage({
		url,
		options: {...options, poolSize: 10}
	});
	t.context.storage = storage;

	await storage.ready();
	const value =
		major === 3
			? storage.db.serverConfig.s.options.poolSize
			: storage.db.serverConfig.s.poolSize;
	t.is(value, 10);
});
