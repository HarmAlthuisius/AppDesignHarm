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

function addStudent( req, res )
{
    var kvs = getFormValuesFromURL( req.url );
    var db = new sql.Database( 'registrar.sqlite' );
    var name = kvs[ 'name' ];
    var sandwich = kvs[ 'sandwich' ];
    db.run( "INSERT INTO Students(Name, SandwichPreference) VALUES ( ?, ? )", name, sandwich,
            function( err ) {
                if( err === null )
                {
                    res.writeHead( 200 );
                    res.end( "Added student" );
                }
                else
                {
                    console.log( err );
                    res.writeHead( 200 );
                    res.end( "FAILED" );
                }
            } );
}

function addTeacher( req, res )
{
    var kvs = getFormValuesFromURL( req.url );
    var db = new sql.Database( 'registrar.sqlite' );
    var name = kvs[ 'name' ];
    db.run( "INSERT INTO Teachers(Name) VALUES ( ? )", name,
            function( err ) {
                if( err === null )
                {
                    res.writeHead( 200 );
                    res.end( "Added teacher" );
                }
                else
                {
                    console.log( err );
                    res.writeHead( 200 );
                    res.end( "FAILED" );
                }
            } );
}

function addCourse( req, res )
{
    var kvs = getFormValuesFromURL( req.url );
    var db = new sql.Database( 'registrar.sqlite' );
    var name = kvs[ 'name' ];
    db.run( "INSERT INTO Courses(Name) VALUES ( ? )", name,
            function( err ) {
                if( err === null )
                {
                    res.writeHead( 200 );
                    res.end( "Added course" );
                }
                else
                {
                    console.log( err );
                    res.writeHead( 200 );
                    res.end( "FAILED" );
                }
            } );
}

function addEnrollment( req, res )
{
    var kvs = getFormValuesFromURL( req.url );
    var db = new sql.Database( 'registrar.sqlite' );
    var student = kvs[ 'student' ];
    var course = kvs[ 'course' ];
    db.run( "INSERT INTO Enrollments(Student, Class) VALUES ( ?, ? )", student, course,
            function( err ) {
                if( err === null )
                {
                    res.writeHead( 200 );
                    res.end( "Assigned student to class" );
                }
                else
                {
                    console.log( err );
                    res.writeHead( 200 );
                    res.end( "FAILED" );
                }
            } );
}

function addTeachingAssignment( req, res )
{
    var kvs = getFormValuesFromURL( req.url );
    var db = new sql.Database( 'registrar.sqlite' );
    var teacher = kvs[ 'teacher' ];
    var course = kvs[ 'course' ];
    db.run( "INSERT INTO TeachingAssignments(Teacher, Class) VALUES ( ?, ? )", teacher, course,
            function( err ) {
                if( err === null )
                {
                    res.writeHead( 200 );
                    res.end( "Assigned teacher to class" );
                }
                else
                {
                    console.log( err );
                    res.writeHead( 200 );
                    res.end( "FAILED" );
                }
            } );
}

function server_fun( req, res )
{
    console.log( "The URL: '", req.url, "'" );
    // ...
    if( req.url === "/" || req.url === "/index.htm" )
    {
        req.url = "/index.html";
    }
    var filename = "./" + req.url;
    try {
        var contents = fs.readFileSync( filename ).toString();
        res.writeHead( 200 );
        res.end( contents );
    }
    catch( exp ) {
        if( req.url.indexOf( "add_student?" ) >= 0 )
        {
            addStudent( req, res );
        }
        else if( req.url.indexOf( "add_teacher?" ) >= 0 )
        {
            addTeacher( req, res );
        }
        else if( req.url.indexOf( "add_course?" ) >= 0 )
        {
            addCourse( req, res );
        }
        else if( req.url.indexOf( "assign_studentToCourse?" ) >= 0 )
        {
            addEnrollment( req, res );
        }
        else if( req.url.indexOf( "assign_teacherToCourse?" ) >= 0 )
        {
            addTeachingAssignment( req, res );
        }
        else
        {
            // console.log( exp );
            res.writeHead( 404 );
            res.end( "Cannot find file: "+filename );
        }
    }
}

var server = http.createServer( server_fun );

server.listen( 8081 );
