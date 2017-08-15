const gulp = require( 'gulp' ),
		fs = require('fs'),
		through = require( 'through2' ),
		cheerio = require( './node_modules/juice/lib/cheerio' ),
		rename = require( 'gulp-rename' ),
		sass = require( 'gulp-sass' ),
		gcmq = require( 'gulp-group-css-media-queries' ),
		gutil = require( 'gulp-util' ),
		juice = require( '@akzhan/gulp-juice' ),
		del = require( 'del' ),
		stripComments = require( 'gulp-strip-comments' ),
		connect = require( 'gulp-connect' ),
		path = require( 'path' ),
		filesToSass = [
			'source/sass/inlined.scss',
			'source/sass/embedded.scss',
		],
		filesToWatch = [
			'source/sass/**/*.scss',
			'source/**/*.html',
		];

cheerio.codeBlocks = {};

// Clean project folder
gulp.task( 'clean', function( done ) {
	'use strict';

	return del( [
		'notifications/**/*.html'
	] )
	.then( function() {
		done();
	} );
} );

// Build SASS
gulp.task( 'build:sass', function( done ) {
	'use strict';

	return gulp.src( filesToSass )
		.pipe(
			sass( {
				outputStyle: 'compressed',
			} )
			.on( 'error', gutil.log )
		)
		.pipe( gcmq() )
		.pipe( gulp.dest( 'tmp/css/' ) )
		.on( 'end', done );
} );

// Inline CSS
gulp.task( 'inline:css', function( done ) {
	'use strict';

	return gulp.src( 'notifications/**/*.html' )
		.pipe(
			juice( {
				applyHeightAttributes: false,
				applyWidthAttributes: false,
				xmlMode: true,
				webResources: {
					relativeTo: path.resolve( __dirname, 'tmp/' ),
					images: false,
					svgs: false,
					scripts: false,
					links: false,
				},
			} )
			.on( 'error', gutil.log )
		)
		.pipe( gulp.dest( 'notifications/' ) )
		.pipe( connect.reload() )
		.on( 'end', done );
} );

// Clean CSS
gulp.task( 'clean:css', function( done ) {
	'use strict';

	return del( [
		'tmp'
	] )
	.then( function() {
		done();
	} );
} );

// Clean HTML
gulp.task( 'clean:html', function( done ) {
	'use strict';

	const base = fs.readFileSync('source/master.html', 'utf8');

	return gulp.src( 'source/*/**/*.html' )
		.pipe(
			stripComments( {
				safe: true,
				trim: true,
			} )
			.on( 'error', gutil.log )
		)
		.pipe( through.obj( function( file, encoding, done ) {
			file.contents = new Buffer( base.replace( /\{\{ *block content *\}\}/, file.contents ) );
			this.push(file);
			done();
		} ) )
		.pipe( gulp.dest( 'notifications' ) )
		.on( 'end', done );
} );

// Default (Build)
gulp.task(
	'default',
	gulp.series( [
		'clean',
		'build:sass',
		'clean:html',
		'inline:css',
		'clean:css'
	] )
);

// Start server w/ live reload
gulp.task( 'start', function( done ) {
	'use strict';

	connect.server( {
		port: 8000,
		root: 'notifications',
		livereload: true,
	} );

	done();
} );

// Watch
gulp.task( 'watch', function( done ) {
	'use strict';

	gulp.watch(
		filesToWatch,
		gulp.series( [
			'default',
		] )
	);

	done();
} );

// Development mode
gulp.task(
	'dev',
	gulp.series( [
		'default',
		gulp.parallel( [
			'start',
			'watch',
		] )
	] )
);
