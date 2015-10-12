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
    var radios = document.getElementsByName('emoji');
    var emoji = "";
    for(var i = 0; i < radios.length; i++)
    {
      if(radios[i].checked)
      {
        emoji = radios[i].value;
      }
    }

    var text_in = document.getElementById('typing').value;
    var xhr = new XMLHttpRequest();
    xhr.addEventListener( "load", onResponse );
    var url = "enter?txt_input="+text_in+"&mood="+emoji;
    xhr.open( "get", url, true );
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
