import { prepare } from './src/prepare.js';

const main = async () => {
    await prepare({ devhubusername: 'trailhead', promote: true, codecoverage: true }, { nextRelease: { version: '0.1.2' }, logger: console });
}

main().then(() => console.log('done')).catch(console.error);


