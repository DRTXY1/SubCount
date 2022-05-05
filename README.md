# Subgoal-SE-Settings

## Das Subgoal wird automatisch angepasst. 
- Ist das Subgoal erreicht wird auf das aktuelle Sobgoal 15 weitere Subs addiert und auf die nächste 5er Stelle gerundet
- Fallen Subs und die Differenz ist zu Groß wird das Subgoal wieder angepasst +15 und es wird aufgerundet




---

# 1. Authorisieren 
- Gehe auf https://subcount.ledrty.repl.co/ und Authorisiere die Anwendung (Source: https://github.com/ )
- Notier dir Deinen generierten User-Token
 Der User-Token ist sozusagen dein eigenes Passwort, damit nicht jeder deine Subs etc einsehen kann. Jedesmal wenn du die Anwendung autorisierst wird ein neuer User-Token generiert. 
   ### Du gibst mit dem Autorisieren dieser Anwendung folgende Rechte:
    - Details über dein Kanalabonnement erhalten.
    - Zielinformationen für deinen Kanal anzeigen.
    - Eine Liste aller Abonnenten deines Kanals erhalten
    - Sieh dir die Moderationsdetails deines Kanals an, etwa die Moderatoren, Sperren, Timeouts und AutoMod-Einstellungen

 ---
 # 2. Konfigurieren
 - Öffne Streamelements und erstelle ein neues Overlay https://streamelements.com/overlay/new/editor?er=1 oder bearbeite dein Aktuelles Overlay.
 - Klicke auf Widget hinzufügen und wähle Custom Widget 
 ![CSunknown](https://user-images.githubusercontent.com/19099817/166873090-e9d7ed6c-4603-4be2-a6d8-1d5f1f7dddb3.png)

- Öffne den Editor 
## Ersetze in dem Editor folgendes:



1. HTML 

![HTML](https://user-images.githubusercontent.com/19099817/166977939-b895ec5b-7ceb-40f9-b5c6-08016d99a96c.png)
```
<link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet">
<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/request/2.88.2/index.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<input id="url" type="hidden" value="https://subcount.ledrty.repl.co/count?usertoken={{userToken}}&user={{userName}}"/>
<h2>{{titelText}}<b id="title"></b></h2>
```


2. CSS

![CSS](https://user-images.githubusercontent.com/19099817/166978557-90a8af50-1ba6-48a4-be12-6f6847819e06.png)
```
* {
  margin: 0;
  font-size:{{fontSize}}px;
  color: {{fontColor}};
}
html, body {
  font-family: {{fontName}}, sans-serif!important;
  width: 100%;
  height: 100%;
}
```

3. JS

![JS](https://user-images.githubusercontent.com/19099817/166978732-0feee6c3-bd90-4d37-8d4c-ade64fb0e04a.png)
```
setInterval(function() {
  $.getJSON($('#url').val(), {}, function(data) {
    $('#title').html( ' ' + data.current + '/' + data.max /*+ ' ' + Math.round(data.current * (100 / data.max) * 100) / 100 + "%"*/);
  });
}, 30000)
```

4. FIELDS

![FIELDS](https://user-images.githubusercontent.com/19099817/166978867-4776f666-2d91-406e-bf63-ef8ecf965787.png)
```
{
  "titelText": {
    "type": "text",
    "label": "Subgoal text",
    "value": "SUBS:"
  },  
  "userName": {
    "type": "text",
    "label": "Dein Twitch Name:",
    "value": "hakkoni"
  },  
  "userToken": {
    "type": "text",
    "label": "Dein User-Token",
    "value": "XXX"
  },  
  "fontColor": {
    "type": "colorpicker",
    "label": "Textfarbe",
    "value": "#0000FF"
  },
  "fontSize": {
    "type": "slider",
    "label": "Anzeigegröße",
    "value": 24,
    "min": 0,
    "max": 100,
    "step": 1
  },
  "fontName": {
      "type": "googleFont",
      "label": "Schriftart:",
      "value": "Roboto"
    }
}
```
---
# 3. Einstellen
 - Öffne in Streamelements unter dem Editor die Fields-Section
 - Twitchnamen eingeben 
 - User-Token eingeben
 - Alternative einstellungen machen

Jetzt warte einen kurzen Moment bis das Goal angezeigt wird und
Fertig!


