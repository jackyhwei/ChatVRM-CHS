import { TalkStyle } from "../messages/messages";

export async function omtts(
  message: string,
  speakerX: number,
  speakerY: number,
  style: TalkStyle
) {
  const param = {
    method: "POST",
    body: JSON.stringify({
      text: message,
      speaker_x: speakerX,
      speaker_y: speakerY,
      style: style,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  };

  const koeiroRes = await fetch(
    "https://api.rinna.co.jp/models/cttse/koeiro",
    param
  );

  const data = (await koeiroRes.json()) as any;

  return { audio: data.audio };
}

export async function omtts_v1(
  message: string,
  speakerX: number,
  speakerY: number,
  style: "talk" | "happy" | "sad",
  apiKey: string
) {
  // Request body
  const body = {
    text: message,
    speaker_x: speakerX,
    speaker_y: speakerY,
    style: style,
    output_format: "mp3",
  };

  var tts_url = "";
  var tts_host = "https://rg4.net/x"
  var lan = "cn";
  var per = 1;
  var vol = 10;
  var pit = 5;
  var spd = 5;
  var remote_tts_svr = 0;
  var title = "";

  tts_url = tts_host + "/v1/tts?lan=" +  lan + "&per=" + per + "&vol=" + vol + "&pit="+ pit + "&spd=" + spd + "&remote_tts_svr="+ remote_tts_svr +"&title=";
  tts_url = tts_url + encodeURI(title);
  tts_url = tts_url +"&tex=";
  tts_url = tts_url + encodeURI(message);


  let xhr = new XMLHttpRequest();
  xhr.open("GET" , tts_url, true);
  xhr.setRequestHeader('Content-type','application/json');
  xhr.setRequestHeader("Cache-Control","no-cache");
  xhr.onreadystatechange = function() {
      if(xhr.readyState == XMLHttpRequest.DONE)
      {
          if(xhr.status != 200)
          {
              console.log(xhr.responseURL + 'status ' + xhr.status)
              return;
          }
          const msg = JSON.parse(xhr.responseText)
          if(msg.error_code != 0)
          {
              console.log(xhr.responseText)
              return;
          }

          var audio_url = tts_host + "/" + msg.data; // tts result audio url

          //playaudio(audio_url);
          return { audio: data.audio };

          //if (callback) {
          //    callback(title, audio_url, eventEle);
          //}
      }
  }
  xhr.send(null)
}
