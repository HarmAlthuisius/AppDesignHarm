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

function login(req, res)
{
  var kvs = getFormValuesFromURL(req.url);
  var db = new sql.Database('user_database.sqlite');
  var usr = kvs['username'];
  var pwd = kvs['password'];
  db.all("SELECT * FROM Users", function(err, rows)
   {
    if(err!==null)
    {
      console.log(err);
    }

    for(var i = 0; i < rows.length; i++)
    {
      if (rows[i].Username === usr && rows[i].Password === pwd)
      {
         req.url = "homepage.html";
         var filename = "./"+ req.url;

         try{
           var contents = fs.readFileSync(filename).toString();
           res.writeHead(200);
           res.end(contents);
           goHomePage=true;
         }

         catch(exp){
           console.log('failed');
         }
      }
     }
   }
  )
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

        else if (req.url.indexOf( "login_submit?" ) >= 0)
        {
            login( req, res);
        }
        else
        {
            res.writeHead( 404 );
            res.end( "Cannot find file: "+ req.url );
        }
    }
}

var server = http.createServer( server_fun );

server.listen( 8080 );
