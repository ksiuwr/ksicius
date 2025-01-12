import * as fs from 'node:fs';
import * as path from 'node:path';

export const forEeachJs = (dir: string, handler: (param: unknown) => void) => {
	const dirContent = fs.readdirSync(dir);

	const promises: Promise<void>[] = dirContent.map(async dirElem => {
		const filepath = dir + '/' + dirElem;
		const file = path.parse(filepath);
		const stat = fs.statSync(filepath);
		if (stat.isDirectory()) {
			await Promise.all(forEeachJs(filepath, handler));
		} else if (file.ext === '.js') {
			try {
				const defaultExport = (await import(filepath)).default;
				if (defaultExport instanceof Array) {
					defaultExport.forEach(exported => handler(exported));
				} else {
					handler(defaultExport);
				}
			} catch (ex) {
				console.error('Failed importing file content');
				console.error(ex);
			}
		}
	});

	return promises;
};
