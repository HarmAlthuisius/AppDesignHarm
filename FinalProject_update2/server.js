var fs = require( 'fs' );
var http = require( 'http' );
var sql = require( 'sqlite3' ).verbose();
var resp = "";

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

function login(req, res)
{
   var kvs = getFormValuesFromURL(req.url);
   var db = new sql.Database('user_database.sqlite');
   var usr = kvs['username'];
   var pwd = kvs['password'];
   var count = 0;
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
      try{
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

function reCreate(req, res)
{
  var kvs = getFormValuesFromURL(req.url);
  var emoji = kvs.mood;
  res.writeHead(200);
  resp += decodeURI(kvs.txt_input)+"<br>";
  if(emoji === "happy")
  {
    var img_src = "http://3.bp.blogspot.com/-ztHupiKrOGM/" +
    "U67wwqnuFdI/AAAAAAAAEf4/4qLgNoqeCo8/s1600/COMEDY.png";
    resp += "<img width='100' height='100' src = " + img_src + "><br><br>";
  }
  if(emoji === "sad")
  {
    var img_src = "http://indiepopmarket.com/wp_ipm/wp-content/uploads/2015/01/0767.png";
    resp += "<img width='100' height='100' src = " + img_src + "><br><br>";
  }
  if(emoji === "angry")
  {
    var img_src = "https://www.emojibase.com/resources/img/emojis/apple/" +
    "x1f621.png.pagespeed.ic.WW_buT4c5P.png";
    resp += "<img width='100' height='100' src = " + img_src + "><br><br>";
  }
  if(emoji === "excited")
  {
    var img_src = "https://techologybarn.files.wordpress.com/2014/09/excited-emoji.png";
    resp += "<img width='100' height='100' src = " + img_src + "><br><br>";
  }
  if(emoji === "shocked")
  {
    var img_src = "http://www.shiftcomm.com/wp-content/uploads/2014/05/fearful-emoji.png";
    resp += "<img width='100' height='100' src = " + img_src + "><br><br>";
  }
  if(emoji === "no_emoji")
  {}
  res.end(resp);
}

function get_txt(req, res)
{
   res.writeHead(200);
   res.end(resp);
}

function server_fun( req, res )
{
    //console.log( "The URL: '", req.url, "'" );

    if( req.url === "/" || req.url === "/sign_in.htm" )
    {
        req.url = "/sign_in.html";
    }

    try
    {
        if( req.url.indexOf( "add_user?" ) >= 0 )
        {
          addUser( req, res );
        }

        else if (req.url.indexOf( "login_submit?" ) >= 0)
        {
			    login( req, res);
        }

        else if (req.url.indexOf( "enter?" ) >= 0)
        {
          reCreate(req, res);
        }
        else if (req.url.indexOf( "get_txt" ) >= 0)

        {
          get_txt(req, res);
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
