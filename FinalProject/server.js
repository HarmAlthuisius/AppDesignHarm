var fs = require( 'fs' );
var http = require( 'http' );
var sql = require( 'sqlite3' ).verbose();

function getFormValuesFromURL( url )
{
    var kvs = {};
    var parts = url.split( "?" );
    var key_value_pairs = parts[1].split( "&" );
    for( var i = 0; i < key_value_pairs.length; i++ )
    {
        var key_value = key_value_pairs[i].split( "=" );
        kvs[ key_value[0] ] = key_value[1];
    }
    return kvs
}

function addUser( req, res )
{
    var kvs = getFormValuesFromURL( req.url );
    var db = new sql.Database( 'user_database.sqlite' );
    var username = kvs[ 'username' ];
    if( kvs[ 'password' ] === kvs[ 'password2' ])
    {
      var password = kvs[ 'password' ];
      db.run( "INSERT INTO Users(username, password) VALUES ( ?, ? )", username, password,
              function( err )
              {
                  if( err === null )
                  {
                      res.writeHead( 200 );
                      res.end( "New user has been created." );
                  }
                  else
                  {
                      console.log( err );
                      res.writeHead( 200 );
                      res.end( "FAILED" );
                  }
              }
            );
    }
    else
    {
      res.writeHead( 404 );
      res.end( "Passwords must match!" );
      //window.alert( "Passwords must match!" );
    }
}

function server_fun( req, res )
{
    console.log( "The URL: '", req.url, "'" );

    if( req.url === "/" || req.url === "/sign_in.htm" )
    {
        req.url = "/sign_in.html";
    }
    var filename = "./" + req.url;
    try
    {
        var contents = fs.readFileSync( filename ).toString();
        res.writeHead( 200 );
        res.end( contents );
    }
    catch( exp ) {
        if( req.url.indexOf( "add_user?" ) >= 0 )
        {
            addUser( req, res );
        }
        else
        {
            res.writeHead( 404 );
            res.end( "Cannot find file: "+filename );
        }
    }
}

var server = http.createServer( server_fun );

server.listen( 8080 );
