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

function parseCookies( headers )
{
    var cookies = {};
    var hc = headers.cookie;
    //console.log( 'cookies ', hc )
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
   var profile_pic = '';
   var session_id  = '';
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
        profile_pic = rows[i].Profile;
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
         session_id = usr + "_" + profile_pic;
      }
      try{
        res.setHeader("Set-Cookie", ['session_id='+session_id]);
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
   var username = kvs['username'];
   var profile_pic = kvs['profile'];

   var profile_pic_catch = '';
   var session_id  = '';
   var cookies = parseCookies(req.headers);

   if( kvs[ 'password' ] === kvs[ 'password2' ])
   {
     profile_pic_catch = profile_pic;
     var password = kvs[ 'password' ];
     db.run( "INSERT INTO Users(Username, Password, Profile) VALUES ( ?, ?, ? )", username, password,
          profile_pic,
             function( err )
             {
               if( err === null )
               {
                 if( 'session_id' in cookies )
                 {
                    session_id = cookies.session_id;
                 }
                 else
                 {
                    session_id = username + "_" + profile_pic_catch;
                 }
                 try{
                   res.setHeader("Set-Cookie", ['session_id='+session_id]);
                   res.writeHead(302, {'Location': 'homepage.html'});
                   res.end();
                 }
                 catch(exp){
                   console.log('failed');
                 }
               }
               else
               {
                  console.log( err );
                  res.writeHead( 200 );
                  res.end( "Choose a profile picture!" );
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
  //console.log(resp);
  var kvs = getFormValuesFromURL(req.url);
  var emoji = kvs.mood;
  //console.log(req.headers.cookie);
  var session_user = req.headers.cookie.split('=');
  var user_id = session_user[1].split('_')[0];
  var profile = session_user[1].split('_')[1];
  //console.log(user_id);

  var gallery = {};
  gallery['happy']   = "http://emojipop.net/data/images/emoji_set_0.png";
  gallery['sleepy']  = "https://www.emojibase.com/resources/img/emojis/apple/x1f634.png.pagespeed.ic.9TkqDnFPjV.png";
  gallery['angry']   = "https://www.emojibase.com/resources/img/emojis/apple/" +
                       "x1f621.png.pagespeed.ic.WW_buT4c5P.png";
  gallery['hushed']  = "https://www.emojibase.com/resources/img/emojis/apple/x1f62f.png.pagespeed.ic.M7FFkuBeGW.png";
  gallery['kiss']    = "https://www.emojibase.com/resources/img/emojis/apple/1f617.png";
  gallery['default'] = "https://www.emojibase.com/resources/img/emojis/apple/x1f194.png.pagespeed.ic.HDJFpYD4oo.png";
  gallery['minato']  = "http://static.comicvine.com/uploads/original/11119/111193741/4332958-2495712508-42940.jpg";
  gallery['itachi']  = "http://static.comicvine.com/uploads/original/11124/111242221/4695565-7146195176-Itach.PNG";
  gallery['gama']    = "http://a3.att.hudong.com/77/41/300260829801132841410036268_950.jpg";
  res.writeHead(200);

  if(profile === "default")
  {
    resp = "<img width='50' height='50' src = " + gallery['default'] +"><br>"
            + user_id + ": " + decodeURI(kvs.txt_input)+"<br><br>" + resp;
  }

  if(profile === "gama")
  {
    resp = "<img width='50' height='50' src = " + gallery['gama'] +"><br>"
            + user_id + ": " + decodeURI(kvs.txt_input)+"<br><br>" + resp;
  }

  if(profile === "itachi")
  {
    resp = "<img width='50' height='50' src = " + gallery['itachi'] +"><br>"
            + user_id + ": " + decodeURI(kvs.txt_input)+"<br><br>" + resp;
  }

  if(profile === "minato")
  {
    resp = "<img width='50' height='50' src = " + gallery['minato'] +"><br>"
            + user_id + ": " + decodeURI(kvs.txt_input)+"<br><br>" + resp;
  }

  //console.log(emoji);
  if(emoji === "happy")
  {
    resp = "<img width='60' height='60' src = " + gallery['happy'] + "><br><br>" + resp;
  }
  if(emoji === "sleepy")
  {
    resp = "<img width='60' height='60' src = " + gallery['sleepy'] + "><br><br>" + resp;
  }
  if(emoji === "angry")
  {
    resp = "<img width='60' height='60' src = " + gallery['angry'] + "><br><br>" + resp;
  }
  if(emoji === "hushed")
  {
    resp = "<img width='60' height='60' src = " + gallery['hushed'] + "><br><br>" + resp;
  }
  if(emoji === "kiss")
  {
    resp = "<img width='60' height='60' src = " + gallery['kiss'] + "><br><br>" + resp;
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

    //console.log(req.headers.cookie);
    if(!req.headers.cookie && req.url === '/homepage.html')
    {
      res.writeHead(302, {'Location': 'sign_in.html'});
      res.end();
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
