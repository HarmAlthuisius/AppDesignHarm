function onPageLoad()
{
    window.setTimeout( sendUpdateReq, 1000 );
}

function sendUpdateReq()
{
    var xhr = new XMLHttpRequest();
    xhr.addEventListener( "load", onResponse );
    xhr.open( "get", "get_txt", true );
    xhr.send();
}

function enter()
{
    var text_in = document.getElementById('typing').value;
    var xhr = new XMLHttpRequest();
    xhr.addEventListener( "load", onResponse );
    xhr.open( "get", "enter?txt_input="+text_in, true );
    xhr.send();
}

function onResponse( evt )
{
    var xhr = evt.target;
    console.log( "Response text: ", xhr.responseText );
    var element = document.getElementById( 'the_text' );
    element.innerHTML = xhr.responseText;
    window.setTimeout( sendUpdateReq, 1000 );
}
