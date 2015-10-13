var fs = require( 'fs' );
var http = require( 'http' );
var sql = require( 'sqlite3' ).verbose();

function getFormValuesFromURL( url )
{
    var kvs = {};
    if(url)
    {
    var parts = url.split( "?" );
    }
    var key_value_pairs = parts[1].split( "&" );
    for( var i = 0; i < key_value_pairs.length; i++ )
    {
        var key_value = key_value_pairs[i].split( "=" );
        kvs[ key_value[0] ] = key_value[1];
    }
    return kvs
}

function parseCookies( headers )
{
    var cookies = {};
    var hc = headers.cookie;
    console.log( 'cookies ', hc )
    hc && hc.split( ';' ).forEach(
        function( cookie )
        {
            var parts = cookie.split( '=' );
            cookies[ parts.shift().trim() ] =
                decodeURI( parts.join( '=' ) );
        } );

    return cookies;
}

function login(req, res)
{
   var kvs = getFormValuesFromURL(req.url);
   var db = new sql.Database('user_database.sqlite');
   var usr = kvs['username'];
   var pwd = kvs['password'];
   var count = 0;
   var cookies = parseCookies(req.headers);

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
        count++;
      }
    }

    if(count > 0)
    {
      if( 'session_id' in cookies )
      {
         session_id = cookies.session_id;
      }
      else
      {
         session_id = usr;
      }
      try{
        res.setHeader( "Set-Cookie",
                   [ 'session_id='+session_id ] );
        res.writeHead(302, {'Location': 'homepage.html'});
        res.end();
      }
      catch(exp){
        console.log('failed');
      }
    }

    else{
      res.writeHead(200);
      res.end('username and password not found, pls go back and sign up...');
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
     db.run( "INSERT INTO Users(Username, Password) VALUES ( ?, ? )", username, password,
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
    }
}

function server_fun( req, res )
{
    if( req.url === "/" || req.url === "/password.htm" )
    {
        req.url = "/password.html";
    }
  try
  {
      if (req.url.indexOf( "login_submit?" ) >= 0)
      {
          login( req, res);
      }
      else
      {
			    var filename = "./"+ req.url;
			    var contents = fs.readFileSync(filename).toString();
			    res.writeHead( 200 );
			    res.end(contents);
	    }
    }
  catch( exp ) {
      res.writeHead( 404 );
      res.end( "Cannot find file: "+ req.url );
      }
}
  var server = http.createServer( server_fun );
  server.listen( 8080 );
