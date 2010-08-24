/**
 * Simple webserver with logging. By default, serves whatever files are
 * reachable from the directory where node is running.
 */
var fs = require('fs'),
antinode = require('./lib/antinode'),
sys = require('sys')
;

fs.readFile('settings.json', function(err, data) {
    var settings = {};
    if (err) {
        sys.puts('No settings.json found. Using default settings');
    }
    try {
        settings = JSON.parse(data.toString());
    } catch (e) {
        sys.puts('Error parsing settings.json');
        process.exit(1);
    }
    settings.__proto__ = antinode.default_settings;
    settings.default_host.root = __dirname;
    antinode.start(settings);
});
