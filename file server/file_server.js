var http = require( 'http' );
var fs   = require( 'fs' );

function readFileLines( filename )
{
    try
    {
        var f = fs.readFileSync( filename );
        console.log( filename );
    }
    catch( exp )
    {
        throw exp;
    }

    var contents = f.toString();
    return contents.split( '\n' );
}

function server_fun( req, res )
{
    var filename = req.url;
    var lines = readFileLines( filename );

    console.log( req.url );
    res.writeHead( 200 );
    res.end( lines + "");
}

var server = http.createServer( server_fun );

server.listen( 8084 );
