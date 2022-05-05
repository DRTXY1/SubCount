const express = require('express'),
  app = express(),
  router = express.Router(),
  Database = require("@replit/database"),
  db = new Database(),
  path = require('path'),
  fetch = require('fetch'),
  fs = require('fs'),
  axios = require("axios").default,
  cors = require('cors'),
  CLIENT_SECRET = process.env.CLIENT_SECRET;
var connect = require('connect');
var http = require('http');
var connect = connect();





app.use(cors())
let server = app.listen(3000, function() {
  console.log("App server is running on port 3000");
});



function round5(x) { return Math.ceil(x / 5) * 5; }
function roundUpDown5(x) { return (x % 5) >= 2.5 ? parseInt(x / 5) * 5 + 5 : parseInt(x / 5) * 5; }
function TimeCalculator(seconds) {
  let y = Math.floor(seconds / 31536000);
  let mo = Math.floor((seconds % 31536000) / 2628000);
  let d = Math.floor(((seconds % 31536000) % 2628000) / 86400);
  let h = Math.floor((seconds % (3600 * 24)) / 3600);
  let m = Math.floor((seconds % 3600) / 60);
  let s = Math.floor(seconds % 60);

  let yDisplay = y > 0 ? y + (y === 1 ? " Jahr, " : " Jahre, ") : "";
  let moDisplay = mo > 0 ? mo + (mo === 1 ? " Monat, " : " Monate, ") : "";
  let dDisplay = d > 0 ? d + (d === 1 ? " Tag, " : " Tage, ") : "";
  let hDisplay = h > 0 ? h + (h === 1 ? " Stunde, " : " Stunden, ") : "";
  let mDisplay = m > 0 ? m + (m === 1 ? " Minute " : " Minute, ") : "";
  let sDisplay = s > 0 ? s + (s === 1 ? " Sekunde" : " Sekunden ") : "";
  return yDisplay + moDisplay + dDisplay + hDisplay + mDisplay + sDisplay;
}






function makeid(*) {
  var result = '';

  ....
  
  return result;
}




function tempRequestAsync(requestConfig) {
  return new Promise(((resolve, reject) => {
    request(requestConfig, (error, response, body) => {
      if (error) {
        reject(error);
      }
      resolve({ response, body });
    })
  }))
}


const getAppToken = async function() {
  const { body } = await tempRequestAsync({
    url: 'https://id.twitch.tv/oauth2/token',
    method: 'POST',
    qs: {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials',
    },
    json: true
  }).catch((e) => { });
  return body.access_token;
};

const getUserDataByID = async function(channelName) {
  const accessToken = await getAppToken();

  const { body } = await tempRequestAsync({
    url: 'https://api.twitch.tv/helix/users?id=' + channelName,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'client-ID': CLIENT_ID,
    },
    json: true
  }).catch((e) => { });
  if (body.data)
    return body.data[0];
};


const getSubs = async function(id, token) {
  const { body } = await tempRequestAsync({
    url: 'https://api.twitch.tv/helix/subscriptions?broadcaster_id=' + id,
    method: 'GET',
    headers: {
      'Client-Id': process.env.CLIENT_ID,
      'Authorization': 'Bearer ' + token
    }
  }).catch((e) => { });
  return body;
};


const validateToken = async function(token) {
  const { body } = await tempRequestAsync({
    url: 'https://id.twitch.tv/oauth2/validate',
    method: 'GET',
    headers: { 'Authorization': 'OAuth ' + token }
  }).catch((e) => { });
  return body;
};


const getUserDataByName = async function(channelName) {
  const accessToken = await getAppToken();
  const { body } = await tempRequestAsync({
    url: 'https://api.twitch.tv/helix/users?login=' + channelName,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'client-ID': CLIENT_ID,
    },
    json: true
  }).catch((e) => { });
  return body.data[0];
};


const getFromDB = async function(data) {
  return db.get(data).then(value => { return value; });
};





router.get('/count', async (req, res, next) => {
  let new_array = []
  try {
    const TOKEN_TO_VALIDATE = req.query.usertoken;
    const DB = await getFromDB(req.query.user);
    console.log(DB)
    let MIN, MAX;
    if (DB) {
      if (DB.usertoken === TOKEN_TO_VALIDATE) {
        const Subs = await getSubs(DB.user_id, DB.access_token);
        const SubsJson = JSON.parse(Subs)
        var actual_subs = Number(SubsJson.total);
        
        var last_sub_goal = Number(DB.last_sub_goal)
        var new_subgoal = 0;
        if (actual_subs > Number(DB.sub_goal)) {
          new_subgoal = roundUpDown5((actual_subs) + Number(DB.addition))
          DB.sub_goal = new_subgoal;
          DB.last_sub_goal = round5(actual_subs)
        }
        else
          if (actual_subs < Number(last_sub_goal - 10)) {
            new_subgoal = roundUpDown5((actual_subs) + Number(DB.addition))
            DB.last_sub_goal = Number(roundUpDown5(actual_subs) + Number(DB.addition))
            DB.sub_goal = new_subgoal
          }
        await db.set(req.query.user, DB).then(() => { });
        next();
        MIN = actual_subs;
        MAX = DB.sub_goal;
      } else {
        console.log('TOKEN UNGÜLTIG')
        MIN = 'LeDrty FOR '
        MAX = 'PRESIDENT!'
      }
    } else {
      console.log('kein db eintrag')
      MIN = 'LeDrty for '
      MAX = 'president!'
    }
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify({ current: MIN, max: MAX }));
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
})
app.use('/count', router);


router.get('/auth', async (req, res, next) => {
  try {
    console.log(req.query.access_token)
    const validateTokenuser = await validateToken(req.query.access_token);
    const resp = JSON.parse(validateTokenuser);
    console.log(resp);
    const user = await getSubs(resp.user_id, req.query.access_token);
    const acctualSubs = req.query.total//user.total;

    const respuser = JSON.parse(user);
    const uToken = makeid(20);
    db.set(resp.login, {
      access_token: req.query.access_token,
      user_id: resp.user_id,
      last_subs: Number(respuser.total),
      sub_goal: (Number(respuser.total) + Number(15)),
      last_sub_goal: (Number(respuser.total) + Number(15)),
      addition: 15,
      auto_renew: true,
      usertoken: uToken
    }).then(() => {
      db.list().then(keys => {
        console.log(keys)
      });
    });
    const username = await getUserDataByName(resp.login);
    res.send('<center><h1>Fertig  <b>' + resp.login + '</b>!</h1></center><h2>Dein User-Token: <small>' + uToken + '</small></h2><br><b>Client ID: </b>' + resp.client_id + '<br><b>User ID: </b>' + resp.user_id + '<br><b>Genutze Scopes: </b>' + resp.scopes + '<br><b>Access-Token läuft ab in: </b>' + TimeCalculator(resp.expires_in) + ' <br><b>Gesamte Subs: </b>' + respuser.total)
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
})
app.use('/auth', router);
app.use(function(req, res, next) {
  res.status(404);
  res.sendFile(__dirname + '/404.html');
});
