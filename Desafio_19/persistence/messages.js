import fs from 'fs';

async function readFile(fileName) {
	return await fs.promises.readFile(`${fileName}`, 'utf-8');
}

async function writeFile(fileName, data) {
	return await fs.promises.writeFile(fileName, JSON.stringify(data));
}

export { readFile, writeFile };
