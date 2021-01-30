#!/usr/bin/env node

/* eslint-disable no-console*/
/* eslint-disable no-process-exit*/
/* eslint-disable import/no-nodejs-modules*/

const fs = require( 'fs' );
const path = require( 'path' );
const yaml = require( 'js-yaml' );

const { execSync } = require( 'child_process' );

const PROJECT_DIR = path.join( __dirname, '..' );
const BUILD_DIR = path.join( PROJECT_DIR, 'release' );
const ELECTRON_BUILDER_ARGS = process.env.ELECTRON_BUILDER_ARGS || '';

const circleTag = process.env.CIRCLE_TAG;
const isReleaseBuild = process.platform === 'darwin' && !! circleTag && circleTag.startsWith( 'v' );

const arches = [ 'x64', 'arm64' ];

for ( let i = 0; i < arches.length; i++ ) {
	const arch = arches[ i ];
	console.log( `  • Building artifacts for arch ${ arch }...` );

	// Need to use python3 - not python2 - for correct compilation for Apple Silicon.
	// (i.e. want arm64, not arm64e.)
	// https://github.com/apple/tensorflow_macos/issues/28#issuecomment-735368891
	//
	// Use `file $(which <path/to/python/executable>)` to verify.
	const pythonExe = process.env.PYTHON || '/Library/Developer/CommandLineTools/usr/bin/python3';

	try {
		// Manually rebuild native modules for the target architecture.
		//
		// Override SDKROOT and MACOSX_DEPLOYMENT_TARGET to ensure correct SDK configuration:
		// https://github.com/Homebrew/homebrew-core/pull/19296#issuecomment-352867571
		execSync(
			`SDKROOT='/Library/Developer/CommandLineTools/SDKs/MacOSX11.1.sdk' ` +
				`MACOSX_DEPLOYMENT_TARGET=11.1 ` +
				`PYTHON="${ pythonExe }" npx electron-rebuild --force --arch=${ arch }`,
			{
				stdio: 'inherit',
			}
		);

		// Note 1/30/21: There is a bug in electron-builder (v22.10.4) that rebuilds native dependencies
		// with the host architecture instead of the target architecture.
		//
		// Set `npmRebuild` to false to disable electron-builder's automatic native module rebuild
		// so that binaries manually generated by electron-rebuild are used instead.
		execSync(
			`npx electron-builder build ${ ELECTRON_BUILDER_ARGS } -c.npmRebuild=false --${ arch } --publish never`,
			{
				stdio: 'inherit',
			}
		);

		if ( isReleaseBuild ) {
			// Rename latest-mac.yml so it won't be overwritten by another invocation of electron-builder.
			execSync( `mv latest-mac.yml latest-mac-${ arch }.yml`, { cwd: BUILD_DIR } );
		}
	} catch ( e ) {
		console.error( `Build error: `, e );
		process.exit( 1 );
	}

	console.log( `  • OK built ${ arch } artifacts ${ '\n\n' }` );
}

if ( isReleaseBuild ) {
	try {
		// We need to build the arm64 and x64 application bundles with two separate invocations of
		// electron-builder so that native modules can be generated correctly for each target
		// architecture. The "files" key for latest-mac.yml of each architecture should be
		// combined into a single file prior to publishing.
		//
		// Use `otool -hv -arch all <path/to/native/module>` to verify.
		mergeYaml();
	} catch ( e ) {
		console.error( `Error generating artifact YML: `, e );
		process.exit( 1 );
	}
}

console.log( '  • OK built all artifacts\n\n' );

function mergeYaml() {
	const x64YAML = path.join( BUILD_DIR, 'latest-mac-x64.yml' );
	const arm64YAML = path.join( BUILD_DIR, 'latest-mac-arm64.yml' );

	const x64 = yaml.load( fs.readFileSync( x64YAML ), 'utf8' );
	const arm64 = yaml.load( fs.readFileSync( arm64YAML ), 'utf8' );

	x64.files = x64.files.concat( arm64.files );

	const merged = yaml.dump( x64, { indent: 2, lineWidth: -1 } );
	fs.writeFileSync( path.join( BUILD_DIR, 'latest-mac.yml' ), merged );

	fs.unlinkSync( x64YAML );
	fs.unlinkSync( arm64YAML );

	console.log( '  • Updated contents of latest-mac.yml: \n', x64 );
}
