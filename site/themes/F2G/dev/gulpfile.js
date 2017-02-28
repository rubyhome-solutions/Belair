'use strict';

var gulp = require('gulp'),
    path = require("path"),
    webpack = require('webpack'),
    named = require('vinyl-named'),
    $ = require('gulp-load-plugins')(),
    _ = require('lodash'),
    ExtractTextPlugin = require("extract-text-webpack-plugin");
    ;

var shell = require('shelljs');

require('ractive').DEBUG = false;

var config = function(options, extend) {
    options = options || {};
    extend = extend || {};

    var plugins = [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        ),
        new webpack.optimize.CommonsChunkPlugin("common", "js/common.js"),
        new ExtractTextPlugin("css/[name].css"),
        new webpack.ContextReplacementPlugin(/momentjs[\/\\]locale$/, /en|ru/),
        new webpack.DefinePlugin({
            MOBILE: options.mobile ? true : false
        })
    ];

    if (options.production) {
        plugins.push(new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}, sourceMap: false}));
    }

    var defaults = {
        devtool: "#inline-source-map",
        output: {
            filename: "js/[name].js",
            publicPath: "/themes/F2G/assets/" + (options.mobile ? 'mobile/' : '')
        },
        cache: true,
        watch: true,
        resolve: {
            root: [path.join(__dirname, "/js/app/" + ( options.mobile ? 'mobile' : 'web') + "/module/"), path.join(__dirname, "/"), path.join(__dirname, "./vendor"), path.join(__dirname, "./js"), path.join(__dirname, "./less")],
            alias: {
                moment: 'momentjs',
                page: 'page.js',
                base: 'js'
            }
        },
        module: {
            loaders: [
                { test: /\.html$/, loader: 'ractive' },
                { test: /\.(less|css)$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader") },
                { test: /\.png$/, loader: "url-loader?limit=100000&mimetype=image/png" },
                { test: /\.gif$/, loader: "url-loader?limit=100000&mimetype=image/gif" },
                { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
                { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
            ]
        },
        plugins: plugins
    };

    return _.extend(defaults, extend);
};

function changed() {
    shell.exec('touch ../assets/.stat', {silent: true});

    var size = parseInt(shell.exec("du -scb img js less gulpfile.js | grep total | awk '{print $1}'", {silent: true}).output),
        old = parseInt(shell.exec("cat ../assets/.stat", {silent: true}).output)
        ;

    return old ? old !== size : true;
}


gulp.task('web', function () {
    return gulp.src(['./js/app/web/*.js'])
        .pipe(named())
        .pipe($.webpack(config()))
        .pipe(gulp.dest('../assets/'));
});

gulp.task('mobile', function () {
    return gulp.src(['./js/app/mobile/*.js'])
        .pipe(named())
        .pipe($.webpack(config({mobile: true})))
        .pipe(gulp.dest('../assets/mobile/'));
});

gulp.task('web-build', function () {
    if (changed()) {
        return gulp.src(['./js/app/web/*.js'])
            .pipe(named())
            .pipe($.webpack(config({production: true}, {watch: false})))
            .pipe(gulp.dest('../assets/'));
    }
});

gulp.task('mobile-build', function () {
    if (changed()) {
        return gulp.src(['./js/app/mobile/*.js'])
            .pipe(named())
            .pipe($.webpack(config({mobile: true, production: true}, {watch: false})))
            .pipe(gulp.dest('../assets/mobile/'));
    }
});

gulp.task('default', ['mobile-build', 'web-build'], function() {
    var size = parseInt(shell.exec("du -scb img js less gulpfile.js | grep total | awk '{print $1}'", {silent: true}).output)
        ;

    ('' + size).to('../assets/.stat');
});



//gulp.task('default', ['web']);
