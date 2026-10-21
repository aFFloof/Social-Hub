import { DurableObject } from "cloudflare:workers";

const INDEX_HTML = "<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover\">\n<meta name=\"theme-color\" content=\"#11151c\">\n<title>Social Hub Lobby</title>\n<style>\n:root{\n  --bg:#0f1319; --panel:#171d26; --panel2:#212a36; --line:#313b4b;\n  --text:#eef5ff; --muted:#9daabc; --accent:#7fd4ff; --good:#78e6a8;\n  --warn:#ffd16d; --bad:#ff7e8e;\n}\n*{box-sizing:border-box}\nhtml,body{margin:0;min-height:100%;background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif;overscroll-behavior:none}\nbody{min-height:100vh}\nbutton,input{font:inherit}button{cursor:pointer}\n#app{max-width:820px;margin:0 auto;padding:calc(12px + env(safe-area-inset-top)) 12px calc(18px + env(safe-area-inset-bottom))}\n.top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}\n.brand{font-weight:950;letter-spacing:.02em;font-size:19px}\n.badge{font-size:10px;font-weight:900;color:var(--muted);border:1px solid var(--line);padding:6px 9px;border-radius:999px;background:#ffffff08}\n.statusDot{width:8px;height:8px;border-radius:50%;background:var(--good);display:inline-block;margin-right:6px}\n.card{background:linear-gradient(180deg,var(--panel),#141922);border:1px solid var(--line);border-radius:16px;padding:14px;margin-bottom:10px}\nh2,h3{margin:0 0 10px}p{margin:5px 0;color:var(--muted);line-height:1.4}\n.row{display:flex;gap:9px;align-items:center}.wrap{flex-wrap:wrap}\ninput{width:100%;min-height:44px;border:1px solid var(--line);border-radius:11px;background:#0d1219;color:var(--text);padding:0 12px;font-size:16px;outline:none}\ninput:focus{border-color:var(--accent)}\n.btn{min-height:44px;border-radius:11px;border:1px solid var(--line);background:var(--panel2);color:var(--text);font-weight:900;padding:0 13px}\n.btn.primary{background:var(--accent);color:#071018;border-color:transparent}\n.btn.warn{background:#342d17;color:var(--warn)}\n.btn.bad{background:#341b22;color:var(--bad)}\n.btn:disabled{opacity:.42}\n.grid2{display:grid;grid-template-columns:1fr 1fr;gap:9px}\n@media(max-width:540px){.grid2{grid-template-columns:1fr}}\n.small{font-size:11px;color:var(--muted)}\n.roomCode{font-size:24px;font-weight:1000;letter-spacing:.15em}\n.hidden{display:none!important}\n\n#worldWrap{\n  position:relative;width:100%;aspect-ratio:1/1.12;max-height:70vh;\n  border:1px solid var(--line);border-radius:18px;overflow:hidden;\n  background:#18212b;touch-action:none;\n}\n#world{\n  position:absolute;inset:0;width:100%;height:100%;display:block;background:#18212b;\n}\n#worldHud{\n  position:absolute;left:10px;right:10px;top:10px;display:flex;justify-content:space-between;\n  pointer-events:none;z-index:3\n}\n.hudChip{background:#0b1017c9;border:1px solid #ffffff1d;border-radius:999px;padding:6px 9px;font-size:10px;font-weight:900;backdrop-filter:blur(5px)}\n#joystick{\n  position:absolute;left:50%;bottom:18px;transform:translateX(-50%);\n  width:112px;height:112px;border-radius:50%;\n  border:1px solid #ffffff2c;background:#0810195e;z-index:4;touch-action:none;\n  opacity:1;transition:opacity .35s ease\n}\n#joystick.idle{opacity:.16}\n#stick{\n  position:absolute;left:50%;top:50%;width:44px;height:44px;margin:-22px;border-radius:50%;\n  background:#eaf8ffc0;border:2px solid #fff;pointer-events:none\n}\n#wardrobeHint,#tvHint,#activityHint{\n  position:absolute;z-index:4;padding:8px 10px;border-radius:10px;\n  background:#0b1017d6;border:1px solid #ffffff24;color:#fff;font-size:10px;font-weight:900;\n  opacity:0;transition:opacity .15s;pointer-events:none\n}\n#wardrobeHint{right:14px;bottom:14px}\n#tvHint{right:14px;bottom:52px}\n#activityHint{left:14px;bottom:14px}\n#wardrobeHint.show,#tvHint.show,#activityHint.show{opacity:1}\n\n#playersPanel{margin-top:10px}\n.player{\n display:grid;grid-template-columns:36px 1fr auto;gap:9px;align-items:center;\n background:#10151d;border:1px solid var(--line);border-radius:12px;padding:8px;margin-top:7px\n}\n.avatar{width:36px;height:36px;border-radius:11px;background:var(--panel2);display:grid;place-items:center;font-weight:1000;border:1px solid var(--line)}\n.playerName{font-weight:900;font-size:13px}.meta{font-size:10px;color:var(--muted);margin-top:2px}\n.pill{display:inline-flex;align-items:center;border-radius:999px;padding:4px 7px;font-size:9px;font-weight:950;border:1px solid var(--line);margin-left:5px}\n.host{color:var(--warn)}\n.chat{height:120px;overflow:auto;background:#0d1218;border:1px solid var(--line);border-radius:11px;padding:8px}\n.msg{margin-bottom:7px;font-size:12px;line-height:1.35}.msg b{color:var(--accent)}.msg.system{color:var(--muted);font-style:italic}\n.actions,.hostTools{display:flex;gap:7px;flex-wrap:wrap}\n\n.modalShade{\n position:fixed;inset:0;background:#05070aab;display:flex;align-items:flex-end;justify-content:center;\n padding:14px;z-index:30\n}\n.modal{\n width:min(620px,100%);max-height:80vh;overflow:auto;background:#151b24;border:1px solid var(--line);\n border-radius:18px;padding:16px\n}\n.choiceGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px}\n@media(max-width:480px){.choiceGrid{grid-template-columns:repeat(2,1fr)}}\n.choice{\n min-height:62px;border-radius:12px;border:1px solid var(--line);background:#202836;color:var(--text);\n font-weight:900;padding:8px\n}\n.choice.selected{outline:2px solid var(--accent);background:#183044}\n.preview{\n height:110px;border-radius:14px;border:1px solid var(--line);background:#0e141c;margin:10px 0;\n display:grid;place-items:center\n}\n.previewPill{position:relative;width:42px;height:68px;border-radius:22px;background:#7fd4ff;border:2px solid #dff6ff}\n.previewHat,.previewMask{position:absolute;left:50%;transform:translateX(-50%)}\n.previewHat{top:-17px}.previewMask{top:20px;font-size:16px}\n\n.gameMenuGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}\n.gameCard{min-height:104px;border:1px solid var(--line);border-radius:14px;background:#202836;color:var(--text);padding:12px;text-align:left}\n.gameCard strong{display:block;font-size:15px;margin-bottom:5px}\n.gameCard span{font-size:11px;color:var(--muted);line-height:1.35}\n.activityStatus{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0 12px}\n.seatChip{border:1px solid var(--line);border-radius:999px;padding:6px 9px;font-size:11px;background:#0e141c}\n.seatChip.you{border-color:var(--accent)}\n.boardWrap{display:flex;justify-content:center;overflow:auto;padding:6px 0 10px}\n.tttBoard{display:grid;grid-template-columns:repeat(3,74px);gap:7px}\n.tttCell{width:74px;height:74px;border:1px solid var(--line);border-radius:12px;background:#0f151d;color:var(--text);font-size:34px;font-weight:1000}\n.tttCell:disabled{opacity:1}\n.c4Board{display:grid;grid-template-columns:repeat(7,42px);gap:5px;background:#1b4670;border:1px solid #5e86ac;border-radius:14px;padding:9px}\n.c4Cell{width:42px;height:42px;border-radius:50%;border:2px solid #0d2d4d;background:#0c1722;padding:0}\n.c4Cell.p1{background:#ff7676}\n.c4Cell.p2{background:#ffd166}\n.c4Cell:disabled{opacity:1}\n.gameNote{font-size:12px;color:var(--muted);line-height:1.4;margin:7px 0}\n@media(max-width:420px){\n .tttBoard{grid-template-columns:repeat(3,66px)}\n .tttCell{width:66px;height:66px}\n .c4Board{grid-template-columns:repeat(7,36px);gap:4px;padding:7px}\n .c4Cell{width:36px;height:36px}\n}\n\nfooter{font-size:10px;color:#748095;text-align:center;padding:6px}\n</style>\n</head>\n<body>\n<div id=\"app\">\n  <div class=\"top\">\n    <div class=\"brand\">Social Hub</div>\n    <div class=\"badge\" id=\"networkBadge\"><span class=\"statusDot\" id=\"networkDot\"></span><span id=\"networkText\">NETWORK</span></div>\n  </div>\n\n  <section id=\"homeView\">\n    <div class=\"card\">\n      <h2>Lobby</h2>\n      <div class=\"grid2\">\n        <div><div class=\"small\" style=\"margin-bottom:5px\">DISPLAY NAME</div><input id=\"nameInput\" maxlength=\"18\" placeholder=\"Player name\"></div>\n        <div><div class=\"small\" style=\"margin-bottom:5px\">ROOM CODE</div><input id=\"codeInput\" maxlength=\"6\" placeholder=\"ABC123\" autocapitalize=\"characters\"></div>\n      </div>\n      <div class=\"row wrap\" style=\"margin-top:10px\">\n        <button class=\"btn primary\" id=\"createBtn\">Create Lobby</button>\n        <button class=\"btn\" id=\"joinBtn\">Join Lobby</button>\n      </div>\n    </div>\n    <div class=\"card\"><p>Create a room and share the 6-character code. Anyone opening this same deployed URL can join from their own phone or computer.</p></div>\n  </section>\n\n  <section id=\"lobbyView\" class=\"hidden\">\n    <div class=\"card\" style=\"padding:10px 12px\">\n      <div class=\"row\" style=\"justify-content:space-between\">\n        <div><div class=\"small\">ROOM</div><div class=\"roomCode\" id=\"roomCodeLabel\">------</div></div>\n        <div class=\"actions\">\n          <button class=\"btn warn hidden\" id=\"lockBtn\">Lock</button>\n          <button class=\"btn\" id=\"leaveBtn\">Leave</button>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"worldWrap\">\n      <canvas id=\"world\" width=\"700\" height=\"780\"></canvas>\n      <div id=\"worldHud\">\n        <div class=\"hudChip\" id=\"playerCount\">1 / 8</div>\n        <div class=\"hudChip\" id=\"roomStatus\">OPEN</div>\n      </div>\n      <div id=\"joystick\"><div id=\"stick\"></div></div>\n      <div id=\"wardrobeHint\">TAP WARDROBE</div><div id=\"tvHint\">TAP TV \u00b7 CHANNEL 1</div><div id=\"activityHint\">TAP GAME TABLE</div>\n    </div>\n\n    <div class=\"card\" id=\"playersPanel\">\n      <h3>Players</h3>\n      <div id=\"players\"></div>\n    </div>\n\n    <div class=\"card\">\n      <h3>Chat</h3>\n      <div id=\"chat\" class=\"chat\"></div>\n      <div class=\"row\" style=\"margin-top:8px\"><input id=\"chatInput\" maxlength=\"120\" placeholder=\"Message\"><button class=\"btn\" id=\"sendBtn\">Send</button></div>\n    </div>\n  </section>\n\n  <footer>Cloudflare WebSocket lobby</footer>\n</div>\n\n<div id=\"wardrobeModal\" class=\"modalShade hidden\">\n  <div class=\"modal\">\n    <div class=\"row\" style=\"justify-content:space-between\">\n      <h3 style=\"margin:0\">Wardrobe</h3>\n      <button class=\"btn\" id=\"closeWardrobe\">Done</button>\n    </div>\n\n    <div class=\"preview\">\n      <canvas id=\"wardrobePreview\" width=\"180\" height=\"110\" style=\"width:180px;height:110px\"></canvas>\n    </div>\n\n    <div class=\"small\">BODY COLOR</div>\n    <div class=\"choiceGrid\" id=\"colorChoices\"></div>\n\n    <div class=\"small\" style=\"margin-top:14px\">BODY SHAPE</div>\n    <div class=\"choiceGrid\" id=\"shapeChoices\"></div>\n\n    <div class=\"small\" style=\"margin-top:14px\">HATS</div>\n    <div class=\"choiceGrid\" id=\"hatChoices\"></div>\n\n    <div class=\"small\" style=\"margin-top:14px\">MASKS</div>\n    <div class=\"choiceGrid\" id=\"maskChoices\"></div>\n  </div>\n</div>\n\n\n<div id=\"activityModal\" class=\"modalShade hidden\">\n  <div class=\"modal\">\n    <div class=\"row\" style=\"justify-content:space-between\">\n      <div>\n        <h3 style=\"margin:0\">Activity Corner</h3>\n        <div class=\"small\" id=\"activitySubtitle\">Choose a game</div>\n      </div>\n      <button class=\"btn\" id=\"closeActivity\">Close</button>\n    </div>\n\n    <div id=\"activityMenu\">\n      <div class=\"gameMenuGrid\">\n        <button class=\"gameCard\" id=\"chooseTTT\">\n          <strong>Tic-Tac-Toe</strong>\n          <span>Two players. Take turns claiming spaces and make three in a row.</span>\n        </button>\n        <button class=\"gameCard\" id=\"chooseC4\">\n          <strong>Connect 4</strong>\n          <span>Two players. Drop pieces into columns and connect four.</span>\n        </button>\n      </div>\n      <div class=\"gameNote\">Only one game runs at this activity table at a time. Other players can open the table and spectate.</div>\n    </div>\n\n    <div id=\"activityGame\" class=\"hidden\">\n      <div class=\"activityStatus\" id=\"activitySeats\"></div>\n      <div class=\"gameNote\" id=\"activityMessage\"></div>\n      <div class=\"boardWrap\" id=\"activityBoard\"></div>\n      <div class=\"actions\" id=\"activityActions\"></div>\n    </div>\n  </div>\n</div>\n\n<script>\n(()=>{\nconst MAX_PLAYERS=8, HEARTBEAT_MS=15000;\nconst WORLD_W=700, WORLD_H=780;\nconst PLAYER_SPEED=165;\nconst PLAYER_RADIUS=22;\nconst WARDROBE={x:560,y:70,w:105,h:105};\nconst TV={x:28,y:36,w:128,h:96};\nconst ACTIVITY={x:36,y:575,w:150,h:112};\nlet tvChannel=1,tvNoiseTick=0;\nconst $=id=>document.getElementById(id);\nconst clientId=(crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2)+Date.now());\n\nlet roomCode=null,socket=null,heartbeat=null,state=null,joined=false,currentName=\"\",connectMode=null,reconnectTimer=null,intentionalClose=false,everConnected=false,resumeProfile=null;\nlet input={x:0,y:0},lastFrame=performance.now(),lastPosBroadcast=0;\nlet joyId=null;\nlet wardrobeOpen=false;\nlet activityOpen=false;\nlet joyIdleTimer=null;\n\nconst bodyColors=[\n  {id:\"sky\",name:\"Sky\",color:\"#7fd4ff\"},\n  {id:\"mint\",name:\"Mint\",color:\"#78e6a8\"},\n  {id:\"coral\",name:\"Coral\",color:\"#ff8f88\"},\n  {id:\"violet\",name:\"Violet\",color:\"#b89cff\"},\n  {id:\"amber\",name:\"Amber\",color:\"#ffd16d\"},\n  {id:\"slate\",name:\"Slate\",color:\"#9aa8bb\"}\n];\n\nconst bodyShapes=[\n  {id:\"pill\",name:\"Pill\"},\n  {id:\"round\",name:\"Round\"},\n  {id:\"tall\",name:\"Tall\"},\n  {id:\"squat\",name:\"Squat\"}\n];\n\n// Cosmetic items are now data-driven drawing instructions rather than emoji.\n// Future cosmetics can be added by defining a draw function and metadata here.\nconst cosmetics={\n hats:[\n  {id:\"none\",name:\"None\",draw:null},\n  {id:\"cap\",name:\"Cap\",draw:\"cap\"},\n  {id:\"crown\",name:\"Crown\",draw:\"crown\"},\n  {id:\"cowboy\",name:\"Cowboy\",draw:\"cowboy\"},\n  {id:\"wizard\",name:\"Wizard Hat\",draw:\"wizard\"},\n  {id:\"halo\",name:\"Halo\",draw:\"halo\"},\n  {id:\"party\",name:\"Party Hat\",draw:\"party\"},\n  {id:\"flower\",name:\"Flower\",draw:\"flower\"},\n  {id:\"antenna\",name:\"Antenna\",draw:\"antenna\"},\n  {id:\"mushroom\",name:\"Mushroom Cap\",draw:\"mushroom\"},\n  {id:\"chef\",name:\"Chef Hat\",draw:\"chef\"},\n  {id:\"saturn\",name:\"Tiny Saturn\",draw:\"saturn\"}\n ],\n masks:[\n  {id:\"none\",name:\"None\",draw:null},\n  {id:\"bandit\",name:\"Bandit Mask\",draw:\"bandit\"},\n  {id:\"robot\",name:\"Robot Face\",draw:\"robot\"},\n  {id:\"cool\",name:\"Shades\",draw:\"shades\"},\n  {id:\"ghost\",name:\"Ghost Mask\",draw:\"ghost\"},\n  {id:\"alien\",name:\"Alien Visor\",draw:\"alien\"},\n  {id:\"skull\",name:\"Skull Mask\",draw:\"skull\"},\n  {id:\"frog\",name:\"Frog Mask\",draw:\"frog\"},\n  {id:\"cat\",name:\"Cat Mask\",draw:\"cat\"},\n  {id:\"cyclops\",name:\"Cyclops Lens\",draw:\"cyclops\"},\n  {id:\"clown\",name:\"Clown Nose\",draw:\"clown\"},\n  {id:\"visor\",name:\"Neon Visor\",draw:\"visor\"}\n ]\n};\n\nconst now=()=>Date.now();\nconst cleanName=s=>(s||\"\").trim().replace(/\\s+/g,\" \").slice(0,18)||\"Player\";\nconst normalizeCode=s=>(s||\"\").toUpperCase().replace(/[^A-Z0-9]/g,\"\").slice(0,6);\nconst roomKey=code=>`socialhub-room-${code}`;\nconst msgId=()=>crypto.randomUUID?crypto.randomUUID():String(Math.random())+Date.now();\nconst clamp=(v,a,b)=>Math.max(a,Math.min(b,v));\nconst dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);\n\nfunction randomCode(){const chars=\"ABCDEFGHJKLMNPQRSTUVWXYZ23456789\";let s=\"\";for(let i=0;i<6;i++)s+=chars[Math.floor(Math.random()*chars.length)];return s}\nfunction spawnPoint(index=0){return{x:120+(index%3)*70,y:WORLD_H-140-Math.floor(index/3)*65}}\nfunction defaultPlayer(id,name,index=0){\n const p=spawnPoint(index);\n return{id,name,joinedAt:now(),seenAt:now(),x:p.x,y:p.y,hat:\"none\",mask:\"none\",color:\"sky\",shape:\"pill\"};\n}\nfunction defaultState(code,hostId,hostName){\n return{version:3,code,locked:false,hostId,createdAt:now(),updatedAt:now(),\n players:[defaultPlayer(hostId,hostName,0)],\n activity:{game:null,seats:[null,null],board:null,turn:0,status:\"idle\",winner:null,revision:0},\n chat:[{id:msgId(),type:\"system\",text:`${hostName} created the lobby.`,at:now()}]};\n}\nfunction migrateState(s){\n if(!s)return s;\n s.version=3;\n s.players=s.players||[];\n if(!s.activity)s.activity={game:null,seats:[null,null],board:null,turn:0,status:\"idle\",winner:null,revision:0};\n s.players.forEach((p,i)=>{\n   const sp=spawnPoint(i);\n   if(!Number.isFinite(p.x))p.x=sp.x;\n   if(!Number.isFinite(p.y))p.y=sp.y;\n   if(!p.hat)p.hat=\"none\";\n   if(!p.mask)p.mask=\"none\";\n   if(!p.color)p.color=\"sky\";\n   if(!p.shape)p.shape=\"pill\";\n   if(!p.seenAt)p.seenAt=now();\n });\n delete s.started;\n return s;\n}\n\nfunction freshActivity(){\n return{game:null,seats:[null,null],board:null,turn:0,status:\"idle\",winner:null,revision:0};\n}\nfunction playerById(id){return state?.players.find(p=>p.id===id)||null}\nfunction activityName(){\n return state?.activity?.game===\"ttt\"?\"Tic-Tac-Toe\":state?.activity?.game===\"c4\"?\"Connect 4\":\"Activity Corner\";\n}\nfunction initBoard(game){\n return game===\"ttt\"?Array(9).fill(null):game===\"c4\"?Array(42).fill(null):null;\n}\nfunction seatedIndex(id){\n if(!state?.activity)return -1;\n return state.activity.seats.indexOf(id);\n}\nfunction activityCanPlay(id){\n const a=state?.activity;if(!a||a.status!==\"playing\")return false;\n const seat=seatedIndex(id);\n return seat>=0&&seat===a.turn;\n}\nfunction tttWinner(board){\n const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];\n for(const [a,b,c] of lines)if(board[a]&&board[a]===board[b]&&board[a]===board[c])return board[a];\n return board.every(Boolean)?\"draw\":null;\n}\nfunction c4Winner(board){\n const rows=6,cols=7;\n const get=(r,c)=>r>=0&&r<rows&&c>=0&&c<cols?board[r*cols+c]:null;\n for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){\n   const v=get(r,c);if(!v)continue;\n   for(const [dr,dc] of [[0,1],[1,0],[1,1],[1,-1]]){\n     let ok=true;for(let k=1;k<4;k++)if(get(r+dr*k,c+dc*k)!==v){ok=false;break}\n     if(ok)return v;\n   }\n }\n return board.every(Boolean)?\"draw\":null;\n}\nfunction resetActivityRound(){\n const a=state.activity;\n a.board=initBoard(a.game);a.turn=0;a.winner=null;\n a.status=(a.seats[0]&&a.seats[1])?\"playing\":\"waiting\";\n a.revision=(a.revision||0)+1;\n}\nfunction sanitizeActivitySeats(){\n if(!state?.activity)return;\n const a=state.activity;\n let changed=false;\n for(let i=0;i<2;i++){\n   if(a.seats[i]&&!playerById(a.seats[i])){a.seats[i]=null;changed=true}\n }\n if(changed&&a.game){\n   a.board=initBoard(a.game);a.winner=null;a.turn=0;\n   a.status=(a.seats[0]&&a.seats[1])?\"playing\":\"waiting\";\n   a.revision=(a.revision||0)+1;\n }\n}\nfunction applyActivityAction(senderId,action,payload={}){\n if(!state||!playerById(senderId))return false;\n if(!state.activity)state.activity=freshActivity();\n const a=state.activity;\n\n if(action===\"create\"){\n   if(a.game)return false;\n   if(payload.game!==\"ttt\"&&payload.game!==\"c4\")return false;\n   a.game=payload.game;a.seats=[senderId,null];a.board=initBoard(payload.game);\n   a.turn=0;a.status=\"waiting\";a.winner=null;a.revision++;\n   addSystem(`${playerById(senderId).name} opened ${activityName()} at the activity table.`);\n   return true;\n }\n\n if(action===\"join\"){\n   if(!a.game)return false;\n   if(a.seats.includes(senderId))return false;\n   const slot=a.seats.indexOf(null);if(slot<0)return false;\n   a.seats[slot]=senderId;\n   resetActivityRound();\n   addSystem(`${playerById(senderId).name} joined ${activityName()}.`);\n   return true;\n }\n\n if(action===\"leave\"){\n   const seat=a.seats.indexOf(senderId);if(seat<0)return false;\n   a.seats[seat]=null;\n   if(a.game){\n     a.board=initBoard(a.game);a.turn=0;a.winner=null;a.status=\"waiting\";a.revision++;\n   }\n   return true;\n }\n\n if(action===\"end\"){\n   if(!a.game)return false;\n   if(!a.seats.includes(senderId)&&senderId!==state.hostId)return false;\n   const old=activityName();\n   state.activity=freshActivity();\n   addSystem(`${old} closed.`);\n   return true;\n }\n\n if(action===\"reset\"){\n   if(!a.game||!a.seats.includes(senderId))return false;\n   resetActivityRound();return true;\n }\n\n if(action===\"move\"){\n   if(!activityCanPlay(senderId))return false;\n   const seat=seatedIndex(senderId),mark=seat+1;\n\n   if(a.game===\"ttt\"){\n     const cell=Number(payload.cell);\n     if(!Number.isInteger(cell)||cell<0||cell>8||a.board[cell])return false;\n     a.board[cell]=mark;\n     const win=tttWinner(a.board);\n     if(win===\"draw\"){a.status=\"draw\";a.winner=null}\n     else if(win){a.status=\"won\";a.winner=win-1}\n     else a.turn=1-a.turn;\n     a.revision++;return true;\n   }\n\n   if(a.game===\"c4\"){\n     const col=Number(payload.col);\n     if(!Number.isInteger(col)||col<0||col>6)return false;\n     let target=-1;\n     for(let r=5;r>=0;r--){const idx=r*7+col;if(!a.board[idx]){target=idx;break}}\n     if(target<0)return false;\n     a.board[target]=mark;\n     const win=c4Winner(a.board);\n     if(win===\"draw\"){a.status=\"draw\";a.winner=null}\n     else if(win){a.status=\"won\";a.winner=win-1}\n     else a.turn=1-a.turn;\n     a.revision++;return true;\n   }\n }\n return false;\n}\nfunction submitActivityAction(action,payload={}){\n if(!state)return;\n broadcast(\"activity-action\",{action,payload});\n}\n\n// Room state is authoritative on the Cloudflare Durable Object.\n// This no-op remains so customization code can update optimistically without\n// having to know anything about persistence.\nfunction saveState(){}\n\nfunction isHost(){return state&&state.hostId===clientId}\nfunction me(){return state?.players.find(p=>p.id===clientId)}\n\nfunction setNetworkStatus(label){\n const text=$(\"networkText\"),dot=$(\"networkDot\");\n if(text)text.textContent=label;\n if(dot){\n   dot.style.background=label===\"CONNECTED\"?\"#78e6a8\":label===\"RECONNECTING\"?\"#ffd16d\":\"#9daabc\";\n }\n if(!state&&$(\"roomStatus\"))$(\"roomStatus\").textContent=label;\n}\n\nfunction socketAddress(code,name,mode){\n const proto=location.protocol===\"https:\"?\"wss\":\"ws\";\n const u=new URL(`${proto}://${location.host}/ws`);\n u.searchParams.set(\"room\",code);\n u.searchParams.set(\"name\",name);\n u.searchParams.set(\"client\",clientId);\n u.searchParams.set(\"mode\",mode);\n return u.toString();\n}\n\nfunction broadcast(type,payload={}){\n if(!socket||socket.readyState!==WebSocket.OPEN)return false;\n socket.send(JSON.stringify({type,payload}));\n return true;\n}\n\nfunction handleServerMessage(msg){\n if(!msg)return;\n\n if(msg.type===\"snapshot\"){\n   const incoming=migrateState(msg.state);\n   if(!incoming||incoming.code!==roomCode)return;\n   state=incoming;\n   joined=true;\n   setNetworkStatus(\"CONNECTED\");\n   renderPanels();\n   if(activityOpen)renderActivityUI();\n\n   if(resumeProfile){\n     const patch={...resumeProfile};\n     resumeProfile=null;\n     const p=me();\n     if(p)Object.assign(p,patch);\n     broadcast(\"player-update\",{patch});\n   }\n   return;\n }\n\n if(msg.type===\"player-update\"){\n   if(!state)return;\n   const p=state.players.find(x=>x.id===msg.id);\n   if(p){\n     Object.assign(p,msg.patch||{});\n     const cosmetic=msg.patch&&(\"hat\" in msg.patch||\"mask\" in msg.patch||\"color\" in msg.patch||\"shape\" in msg.patch);\n     if(cosmetic)renderPanels();\n   }\n   return;\n }\n\n if(msg.type===\"chat\"){\n   if(!state||!msg.message)return;\n   state.chat.push(msg.message);\n   state.chat=state.chat.slice(-80);\n   renderChat();\n   return;\n }\n\n if(msg.type===\"activity-state\"){\n   if(!state)return;\n   state.activity=msg.activity;\n   if(activityOpen)renderActivityUI();\n   return;\n }\n\n if(msg.type===\"error\"){\n   intentionalClose=true;\n   alert(msg.message||\"Could not join that lobby.\");\n   leaveRoom(false);\n   return;\n }\n\n if(msg.type===\"kicked\"){\n   intentionalClose=true;\n   alert(\"You were removed from the lobby.\");\n   leaveRoom(false);\n }\n}\n\nfunction openSocket(code,name,mode){\n clearTimeout(reconnectTimer);\n currentName=name;\n connectMode=mode;\n intentionalClose=false;\n\n if(socket){\n   try{socket.close(1000,\"replace\")}catch{}\n   socket=null;\n }\n\n setNetworkStatus(mode===\"reconnect\"?\"RECONNECTING\":\"CONNECTING\");\n\n let ws;\n try{\n   ws=new WebSocket(socketAddress(code,name,mode));\n }catch{\n   alert(\"This build needs to be deployed through the included Cloudflare Worker before network lobbies can connect.\");\n   leaveRoom(false);\n   return;\n }\n socket=ws;\n\n ws.addEventListener(\"open\",()=>{\n   if(socket!==ws)return;\n   everConnected=true;\n   setNetworkStatus(\"CONNECTED\");\n });\n\n ws.addEventListener(\"message\",e=>{\n   if(socket!==ws)return;\n   if(e.data===\"pong\")return;\n   try{handleServerMessage(JSON.parse(e.data))}catch{}\n });\n\n ws.addEventListener(\"close\",()=>{\n   if(socket!==ws)return;\n   socket=null;\n\n   if(intentionalClose||!roomCode)return;\n\n   const local=me();\n   if(local){\n     resumeProfile={\n       x:local.x,y:local.y,hat:local.hat,mask:local.mask,\n       color:local.color,shape:local.shape\n     };\n   }\n\n   if(everConnected){\n     setNetworkStatus(\"RECONNECTING\");\n     reconnectTimer=setTimeout(()=>{\n       if(roomCode&&!intentionalClose)openSocket(roomCode,currentName,\"reconnect\");\n     },1200);\n   }else{\n     alert(\"Could not connect to the multiplayer server.\");\n     leaveRoom(false);\n   }\n });\n}\n\nfunction enterLobby(code){\n roomCode=code;\n $(\"roomCodeLabel\").textContent=code;\n $(\"homeView\").classList.add(\"hidden\");\n $(\"lobbyView\").classList.remove(\"hidden\");\n clearInterval(heartbeat);\n heartbeat=setInterval(tickHeartbeat,HEARTBEAT_MS);\n}\n\nfunction createLobby(){\n const name=cleanName($(\"nameInput\").value);\n const code=randomCode();\n state=null;joined=false;everConnected=false;\n enterLobby(code);\n openSocket(code,name,\"create\");\n}\n\nfunction joinLobby(){\n const name=cleanName($(\"nameInput\").value),code=normalizeCode($(\"codeInput\").value);\n if(code.length!==6){alert(\"Enter a 6-character room code.\");return}\n state=null;joined=false;everConnected=false;\n enterLobby(code);\n openSocket(code,name,\"join\");\n}\n\nfunction leaveRoom(send=true){\n intentionalClose=true;\n clearTimeout(reconnectTimer);\n reconnectTimer=null;\n clearInterval(heartbeat);\n heartbeat=null;\n\n if(socket){\n   if(send&&socket.readyState===WebSocket.OPEN){\n     try{socket.send(JSON.stringify({type:\"leave\",payload:{}}))}catch{}\n   }\n   try{socket.close(1000,\"leave\")}catch{}\n   socket=null;\n }\n\n roomCode=null;state=null;joined=false;everConnected=false;resumeProfile=null;\n input.x=input.y=0;\n setNetworkStatus(\"NETWORK\");\n $(\"lobbyView\").classList.add(\"hidden\");\n $(\"homeView\").classList.remove(\"hidden\");\n closeWardrobe();\n closeActivity();\n}\n\nfunction tickHeartbeat(){\n if(socket&&socket.readyState===WebSocket.OPEN){\n   broadcast(\"presence\",{});\n }\n}\n\nfunction renderPanels(){\n if(!state)return;\n $(\"roomStatus\").textContent=state.locked?\"LOCKED\":\"OPEN\";\n $(\"playerCount\").textContent=`${state.players.length} / ${MAX_PLAYERS}`;\n $(\"lockBtn\").classList.toggle(\"hidden\",!isHost());\n $(\"lockBtn\").textContent=state.locked?\"Unlock\":\"Lock\";\n\n const players=$(\"players\");players.innerHTML=\"\";\n for(const p of [...state.players].sort((a,b)=>(a.id===state.hostId?-1:0)-(b.id===state.hostId?-1:0)||a.joinedAt-b.joinedAt)){\n   const row=document.createElement(\"div\");row.className=\"player\";\n   const av=document.createElement(\"div\");av.className=\"avatar\";av.textContent=(p.name[0]||\"?\").toUpperCase();\n   const body=document.createElement(\"div\");\n   const nm=document.createElement(\"div\");nm.className=\"playerName\";nm.textContent=p.name+(p.id===clientId?\" (You)\":\"\");\n   if(p.id===state.hostId){const h=document.createElement(\"span\");h.className=\"pill host\";h.textContent=\"HOST\";nm.appendChild(h)}\n   const meta=document.createElement(\"div\");meta.className=\"meta\";meta.textContent=\"Connected\";\n   body.append(nm,meta);\n   const act=document.createElement(\"div\");\n   if(isHost()&&p.id!==clientId){\n     const kick=document.createElement(\"button\");kick.className=\"btn bad\";kick.textContent=\"Kick\";\n     kick.addEventListener(\"click\",()=>{broadcast(\"kick\",{target:p.id})});\n     act.appendChild(kick)\n   }\n   row.append(av,body,act);players.appendChild(row)\n }\n renderChat()\n}\nfunction renderChat(){\n if(!state)return;const el=$(\"chat\");el.innerHTML=\"\";\n for(const m of state.chat.slice(-50)){\n   const div=document.createElement(\"div\");div.className=\"msg\"+(m.type===\"system\"?\" system\":\"\");\n   if(m.type===\"system\")div.textContent=m.text;\n   else{const b=document.createElement(\"b\");b.textContent=m.name+\": \";div.append(b,document.createTextNode(m.text))}\n   el.appendChild(div)\n }\n el.scrollTop=el.scrollHeight\n}\nfunction sendChat(){\n const text=$(\"chatInput\").value.trim().slice(0,120);\n if(!text||!state||!me())return;\n broadcast(\"chat\",{text});\n $(\"chatInput\").value=\"\";\n}\n\nconst canvas=$(\"world\"),ctx=canvas.getContext(\"2d\");\nfunction pixelNoiseColor(channel,x,y,tick){\n const n=(x*73856093 ^ y*19349663 ^ tick*83492791)>>>0;\n const v=n%256;\n if(channel===1){\n  const c=75+(v%150);\n  return `rgb(${c},${c},${c})`;\n }\n if(channel===2){\n  const palette=[\"#ff5f6d\",\"#ffd166\",\"#06d6a0\",\"#4cc9f0\",\"#9b5de5\",\"#f8f9fa\",\"#222\"];\n  return palette[n%palette.length];\n }\n if(channel===3){\n  const on=(n%9)<2;\n  return on?\"#8cff98\":\"#08110a\";\n }\n if(channel===4){\n  const stripe=(Math.floor((x+y+tick)%7));\n  return stripe<2?\"#8ecae6\":stripe<4?\"#023047\":\"#ffb703\";\n }\n return \"#222\";\n}\n\nfunction drawTV(){\n ctx.save();\n ctx.translate(TV.x,TV.y);\n\n // cabinet\n ctx.fillStyle=\"#2e333a\";\n ctx.strokeStyle=\"#59616c\";\n ctx.lineWidth=4;\n ctx.beginPath();ctx.roundRect(0,0,TV.w,TV.h,13);ctx.fill();ctx.stroke();\n\n // screen\n const sx=10,sy=10,sw=88,sh=65;\n ctx.fillStyle=\"#080a0d\";ctx.fillRect(sx,sy,sw,sh);\n\n const cell=5;\n tvNoiseTick=(tvNoiseTick+1)%100000;\n for(let yy=0;yy<sh;yy+=cell){\n  for(let xx=0;xx<sw;xx+=cell){\n   ctx.fillStyle=pixelNoiseColor(tvChannel,Math.floor(xx/cell),Math.floor(yy/cell),Math.floor(tvNoiseTick/3));\n   ctx.fillRect(sx+xx,sy+yy,cell,cell);\n  }\n }\n\n // scanline / glass tint\n ctx.fillStyle=\"#ffffff0d\";\n for(let yy=sy;yy<sy+sh;yy+=6)ctx.fillRect(sx,yy,sw,1);\n\n // controls\n ctx.fillStyle=\"#111820\";\n ctx.beginPath();ctx.arc(112,30,8,0,Math.PI*2);ctx.fill();\n ctx.beginPath();ctx.arc(112,55,8,0,Math.PI*2);ctx.fill();\n ctx.fillStyle=\"#d7e3ef\";\n ctx.font=\"900 10px -apple-system,sans-serif\";\n ctx.textAlign=\"center\";\n ctx.fillText(\"CH \"+tvChannel,64,91);\n\n // little antenna\n ctx.strokeStyle=\"#747e89\";\n ctx.lineWidth=3;\n ctx.beginPath();ctx.moveTo(48,1);ctx.lineTo(34,-18);ctx.moveTo(78,1);ctx.lineTo(94,-18);ctx.stroke();\n ctx.restore();\n}\n\nfunction drawWorld(){\n ctx.clearRect(0,0,WORLD_W,WORLD_H);\n\n // floor\n const g=ctx.createLinearGradient(0,0,0,WORLD_H);\n g.addColorStop(0,\"#263746\");g.addColorStop(1,\"#17212b\");\n ctx.fillStyle=g;ctx.fillRect(0,0,WORLD_W,WORLD_H);\n\n // soft grid\n ctx.strokeStyle=\"#ffffff0b\";ctx.lineWidth=1;\n for(let x=0;x<=WORLD_W;x+=50){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,WORLD_H);ctx.stroke()}\n for(let y=0;y<=WORLD_H;y+=50){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(WORLD_W,y);ctx.stroke()}\n\n // small floor accent in the lower-left corner\n ctx.fillStyle=\"#15202b\";ctx.fillRect(24,WORLD_H-105,110,75);\n\n // television corner\n drawTV();\n\n // activity corner table\n ctx.save();\n ctx.translate(ACTIVITY.x,ACTIVITY.y);\n ctx.fillStyle=\"#27313f\";ctx.strokeStyle=\"#536176\";ctx.lineWidth=4;\n ctx.beginPath();ctx.roundRect(0,0,ACTIVITY.w,ACTIVITY.h,18);ctx.fill();ctx.stroke();\n\n // inset game surface\n ctx.fillStyle=\"#101820\";ctx.strokeStyle=\"#7fd4ff55\";ctx.lineWidth=2;\n ctx.beginPath();ctx.roundRect(15,14,ACTIVITY.w-30,68,12);ctx.fill();ctx.stroke();\n\n // simple board markings\n ctx.strokeStyle=\"#b9d7ef88\";ctx.lineWidth=2;\n for(let i=1;i<3;i++){\n   ctx.beginPath();ctx.moveTo(38+i*23,27);ctx.lineTo(38+i*23,70);ctx.stroke();\n   ctx.beginPath();ctx.moveTo(38,27+i*14);ctx.lineTo(107,27+i*14);ctx.stroke();\n }\n ctx.fillStyle=\"#ff7676\";ctx.beginPath();ctx.arc(28,34,6,0,Math.PI*2);ctx.fill();\n ctx.fillStyle=\"#ffd166\";ctx.beginPath();ctx.arc(120,62,6,0,Math.PI*2);ctx.fill();\n\n ctx.fillStyle=\"#edf6ff\";ctx.font=\"900 13px -apple-system,sans-serif\";ctx.textAlign=\"center\";\n ctx.fillText(\"GAME TABLE\",ACTIVITY.w/2,102);\n ctx.restore();\n\n // wardrobe object\n ctx.save();\n ctx.translate(WARDROBE.x,WARDROBE.y);\n ctx.fillStyle=\"#5d4638\";ctx.strokeStyle=\"#8e6a50\";ctx.lineWidth=4;\n ctx.beginPath();ctx.roundRect(0,0,WARDROBE.w,WARDROBE.h,10);ctx.fill();ctx.stroke();\n ctx.strokeStyle=\"#3a2b22\";ctx.lineWidth=3;\n ctx.beginPath();ctx.moveTo(WARDROBE.w/2,4);ctx.lineTo(WARDROBE.w/2,WARDROBE.h-4);ctx.stroke();\n ctx.fillStyle=\"#d9b46f\";ctx.beginPath();ctx.arc(WARDROBE.w/2-8,WARDROBE.h/2,3,0,Math.PI*2);ctx.arc(WARDROBE.w/2+8,WARDROBE.h/2,3,0,Math.PI*2);ctx.fill();\n ctx.fillStyle=\"#f2dfc4\";ctx.font=\"900 13px -apple-system,sans-serif\";ctx.textAlign=\"center\";ctx.fillText(\"WARDROBE\",WARDROBE.w/2,WARDROBE.h+20);\n ctx.restore();\n\n if(state){\n   const sorted=[...state.players].sort((a,b)=>a.y-b.y);\n   for(const p of sorted)drawPlayer(p);\n }\n}\nfunction bodyStyleFor(p){\n const c=bodyColors.find(x=>x.id===p.color)||bodyColors[0];\n const shape=p.shape||\"pill\";\n if(shape===\"round\")return{w:50,h:50,r:25,color:c.color};\n if(shape===\"tall\")return{w:38,h:74,r:20,color:c.color};\n if(shape===\"squat\")return{w:56,h:48,r:20,color:c.color};\n return{w:44,h:62,r:22,color:c.color};\n}\n\nfunction drawHatTo(c,style,w,h){\n if(!style)return;\n c.save();\n const top=-h/2;\n switch(style){\n  case \"cap\":\n   c.fillStyle=\"#2a5d9f\";\n   c.beginPath();c.arc(0,top+2,w*.34,Math.PI,0);c.fill();\n   c.fillRect(-w*.22,top+1,w*.44,7);\n   c.fillStyle=\"#183c6b\";c.fillRect(6,top+5,18,5);\n   break;\n\n  case \"crown\":\n   c.fillStyle=\"#ffd45f\";c.strokeStyle=\"#a86b10\";c.lineWidth=2;\n   c.beginPath();\n   c.moveTo(-18,top+5);c.lineTo(-14,top-12);c.lineTo(-5,top-2);\n   c.lineTo(0,top-16);c.lineTo(8,top-2);c.lineTo(17,top-12);\n   c.lineTo(18,top+5);c.closePath();c.fill();c.stroke();\n   c.fillStyle=\"#ef5f67\";\n   for(const x of[-9,0,9]){c.beginPath();c.arc(x,top-3,2.5,0,Math.PI*2);c.fill()}\n   break;\n\n  case \"cowboy\":\n   c.fillStyle=\"#8a5b35\";\n   c.beginPath();c.ellipse(0,top+3,25,7,0,0,Math.PI*2);c.fill();\n   c.fillStyle=\"#9b6940\";\n   c.beginPath();c.roundRect(-13,top-14,26,18,7);c.fill();\n   c.strokeStyle=\"#4d301e\";c.lineWidth=2;\n   c.beginPath();c.moveTo(-12,top-1);c.lineTo(12,top-1);c.stroke();\n   break;\n\n  case \"wizard\":\n   c.fillStyle=\"#6b4ba8\";\n   c.beginPath();c.moveTo(-18,top+5);c.lineTo(4,top-30);c.lineTo(17,top+5);c.closePath();c.fill();\n   c.fillStyle=\"#3b2b67\";c.fillRect(-20,top+2,40,6);\n   c.fillStyle=\"#ffe27a\";\n   c.beginPath();c.arc(2,top-12,3,0,Math.PI*2);c.fill();\n   break;\n\n  case \"halo\":\n   c.strokeStyle=\"#ffeaa5\";c.lineWidth=4;\n   c.shadowBlur=8;c.shadowColor=\"#ffeaa5\";\n   c.beginPath();c.ellipse(0,top-13,18,6,0,0,Math.PI*2);c.stroke();\n   c.shadowBlur=0;\n   break;\n\n  case \"party\":\n   c.fillStyle=\"#f05d8c\";\n   c.beginPath();c.moveTo(-13,top+4);c.lineTo(0,top-25);c.lineTo(13,top+4);c.closePath();c.fill();\n   c.fillStyle=\"#6bd7ff\";c.beginPath();c.arc(-4,top-7,3,0,Math.PI*2);c.fill();\n   c.fillStyle=\"#ffd45f\";c.beginPath();c.arc(0,top-25,4,0,Math.PI*2);c.fill();\n   break;\n\n  case \"flower\":\n   c.fillStyle=\"#ffd34d\";c.beginPath();c.arc(0,top-8,4,0,Math.PI*2);c.fill();\n   c.strokeStyle=\"#ff8eb6\";c.lineWidth=5;\n   for(let a=0;a<Math.PI*2;a+=Math.PI/3){\n    c.beginPath();c.moveTo(Math.cos(a)*4,top-8+Math.sin(a)*4);\n    c.lineTo(Math.cos(a)*10,top-8+Math.sin(a)*10);c.stroke()\n   }\n   break;\n\n  case \"antenna\":\n   c.strokeStyle=\"#8edcff\";c.lineWidth=3;\n   c.beginPath();c.moveTo(0,top+2);c.lineTo(0,top-20);c.stroke();\n   c.fillStyle=\"#ff6d86\";c.beginPath();c.arc(0,top-23,5,0,Math.PI*2);c.fill();\n   break;\n\n  case \"mushroom\":\n   c.fillStyle=\"#ef6a63\";\n   c.beginPath();c.ellipse(0,top-2,22,12,0,Math.PI,0);c.fill();\n   c.fillStyle=\"#fff4d6\";\n   for(const x of[-10,0,11]){c.beginPath();c.arc(x,top-7,3,0,Math.PI*2);c.fill()}\n   c.fillStyle=\"#d7c9ad\";c.fillRect(-5,top-2,10,8);\n   break;\n\n  case \"chef\":\n   c.fillStyle=\"#f7f7f3\";\n   c.beginPath();c.arc(-9,top-8,9,0,Math.PI*2);c.arc(0,top-13,10,0,Math.PI*2);c.arc(10,top-8,9,0,Math.PI*2);c.fill();\n   c.fillRect(-15,top-7,30,12);\n   c.strokeStyle=\"#cfd6db\";c.lineWidth=1.5;c.strokeRect(-15,top-7,30,12);\n   break;\n\n  case \"saturn\":\n   c.fillStyle=\"#d8a55f\";c.beginPath();c.arc(0,top-12,9,0,Math.PI*2);c.fill();\n   c.strokeStyle=\"#c5e0ff\";c.lineWidth=3;\n   c.beginPath();c.ellipse(0,top-12,18,6,-.25,0,Math.PI*2);c.stroke();\n   break;\n }\n c.restore();\n}\n\nfunction drawMaskTo(c,style,w,h){\n if(!style)return;\n const y=-4;\n c.save();\n switch(style){\n  case \"bandit\":\n   c.fillStyle=\"#242a34\";c.beginPath();c.roundRect(-w*.38,y-8,w*.76,18,7);c.fill();\n   c.fillStyle=\"#eaf7ff\";c.fillRect(-11,y-2,7,3);c.fillRect(4,y-2,7,3);\n   c.strokeStyle=\"#454f5d\";c.lineWidth=2;c.beginPath();c.moveTo(-w*.38,y);c.lineTo(w*.38,y);c.stroke();\n   break;\n\n  case \"robot\":\n   c.fillStyle=\"#687a8d\";c.strokeStyle=\"#b8c9d8\";c.lineWidth=2;\n   c.beginPath();c.roundRect(-17,y-13,34,27,6);c.fill();c.stroke();\n   c.fillStyle=\"#72e0ff\";c.fillRect(-11,y-4,7,5);c.fillRect(4,y-4,7,5);\n   c.fillStyle=\"#29323c\";c.fillRect(-8,y+7,16,3);\n   break;\n\n  case \"shades\":\n   c.fillStyle=\"#101820\";\n   c.beginPath();c.roundRect(-17,y-7,14,10,4);c.roundRect(3,y-7,14,10,4);c.fill();\n   c.fillRect(-3,y-4,6,3);\n   c.fillStyle=\"#4cd8ff\";c.globalAlpha=.55;c.fillRect(-14,y-5,8,2);c.fillRect(6,y-5,8,2);\n   break;\n\n  case \"ghost\":\n   c.fillStyle=\"#f2f6f7\";c.beginPath();c.roundRect(-16,y-14,32,30,13);c.fill();\n   c.fillStyle=\"#222\";c.beginPath();c.arc(-7,y-3,3,0,Math.PI*2);c.arc(7,y-3,3,0,Math.PI*2);c.fill();\n   c.beginPath();c.arc(0,y+7,4,0,Math.PI);c.strokeStyle=\"#222\";c.lineWidth=2;c.stroke();\n   break;\n\n  case \"alien\":\n   c.fillStyle=\"#8df0a9\";c.beginPath();c.ellipse(0,y,18,15,0,0,Math.PI*2);c.fill();\n   c.fillStyle=\"#09110c\";c.beginPath();c.ellipse(-7,y-2,4,7,-.3,0,Math.PI*2);c.ellipse(7,y-2,4,7,.3,0,Math.PI*2);c.fill();\n   c.strokeStyle=\"#55b76e\";c.lineWidth=2;c.beginPath();c.arc(0,y+6,5,.1*Math.PI,.9*Math.PI);c.stroke();\n   break;\n\n  case \"skull\":\n   c.fillStyle=\"#f3efe4\";c.beginPath();c.roundRect(-16,y-14,32,27,10);c.fill();\n   c.fillStyle=\"#202020\";c.beginPath();c.arc(-7,y-3,4,0,Math.PI*2);c.arc(7,y-3,4,0,Math.PI*2);c.fill();\n   c.fillRect(-4,y+7,8,5);c.fillStyle=\"#f3efe4\";\n   for(const x of[-3,1])c.fillRect(x,y+8,2,4);\n   break;\n\n  case \"frog\":\n   c.fillStyle=\"#72d47b\";c.beginPath();c.roundRect(-17,y-12,34,25,9);c.fill();\n   c.fillStyle=\"#fff\";c.beginPath();c.arc(-9,y-9,6,0,Math.PI*2);c.arc(9,y-9,6,0,Math.PI*2);c.fill();\n   c.fillStyle=\"#1b2b1d\";c.beginPath();c.arc(-9,y-9,2.5,0,Math.PI*2);c.arc(9,y-9,2.5,0,Math.PI*2);c.fill();\n   break;\n\n  case \"cat\":\n   c.fillStyle=\"#f0b16d\";c.beginPath();c.roundRect(-16,y-12,32,24,8);c.fill();\n   c.beginPath();c.moveTo(-14,y-10);c.lineTo(-9,y-23);c.lineTo(-3,y-10);c.fill();\n   c.beginPath();c.moveTo(14,y-10);c.lineTo(9,y-23);c.lineTo(3,y-10);c.fill();\n   c.fillStyle=\"#342418\";c.beginPath();c.arc(-6,y-3,2,0,Math.PI*2);c.arc(6,y-3,2,0,Math.PI*2);c.fill();\n   break;\n\n  case \"cyclops\":\n   c.strokeStyle=\"#9de8ff\";c.lineWidth=4;c.shadowBlur=7;c.shadowColor=\"#9de8ff\";\n   c.beginPath();c.arc(0,y-2,9,0,Math.PI*2);c.stroke();c.shadowBlur=0;\n   c.fillStyle=\"#0a1219\";c.beginPath();c.arc(0,y-2,3,0,Math.PI*2);c.fill();\n   break;\n\n  case \"clown\":\n   c.fillStyle=\"#f7f0e7\";c.beginPath();c.ellipse(0,y,16,14,0,0,Math.PI*2);c.fill();\n   c.fillStyle=\"#ff5b68\";c.beginPath();c.arc(0,y,6,0,Math.PI*2);c.fill();\n   c.fillStyle=\"#3b91ff\";c.beginPath();c.arc(-7,y-5,2,0,Math.PI*2);c.arc(7,y-5,2,0,Math.PI*2);c.fill();\n   break;\n\n  case \"visor\":\n   c.fillStyle=\"#43e0ff\";c.shadowBlur=10;c.shadowColor=\"#43e0ff\";\n   c.beginPath();c.roundRect(-18,y-7,36,11,5);c.fill();c.shadowBlur=0;\n   c.fillStyle=\"#d6fbff\";c.globalAlpha=.55;c.fillRect(-13,y-5,18,2);\n   break;\n }\n c.restore();\n}\n\n// Main-world wrappers.\nfunction drawHat(style,w,h){drawHatTo(ctx,style,w,h)}\nfunction drawMask(style,w,h){drawMaskTo(ctx,style,w,h)}\n\nfunction drawPlayer(p){\n ctx.save();ctx.translate(p.x,p.y);\n const s=bodyStyleFor(p);\n const mine=p.id===clientId;\n ctx.shadowBlur=mine?14:6;ctx.shadowColor=mine?\"#7fd4ff\":\"#0008\";\n ctx.fillStyle=s.color;ctx.strokeStyle=mine?\"#dff6ff\":\"#d7e0ec\";ctx.lineWidth=3;\n ctx.beginPath();ctx.roundRect(-s.w/2,-s.h/2,s.w,s.h,s.r);ctx.fill();ctx.stroke();\n ctx.shadowBlur=0;\n\n ctx.fillStyle=\"#10151b\";\n ctx.beginPath();ctx.arc(-7,-5,2.3,0,Math.PI*2);ctx.arc(7,-5,2.3,0,Math.PI*2);ctx.fill();\n\n const hat=cosmetics.hats.find(h=>h.id===p.hat)?.draw||null;\n const mask=cosmetics.masks.find(m=>m.id===p.mask)?.draw||null;\n drawHat(hat,s.w,s.h);\n drawMask(mask,s.w,s.h);\n\n ctx.font=\"900 12px -apple-system,sans-serif\";ctx.fillStyle=\"#eef5ff\";ctx.textAlign=\"center\";\n ctx.fillText(p.name,0,s.h/2+18);\n ctx.restore();\n}\n\nfunction updateMovement(dt){\n if(!state||wardrobeOpen||activityOpen)return;\n const p=me();if(!p)return;\n\n const len=Math.hypot(input.x,input.y);\n if(len>0.001){\n   const nx=input.x/Math.max(1,len),ny=input.y/Math.max(1,len);\n   p.x=clamp(p.x+nx*PLAYER_SPEED*dt,PLAYER_RADIUS+8,WORLD_W-PLAYER_RADIUS-8);\n   p.y=clamp(p.y+ny*PLAYER_SPEED*dt,PLAYER_RADIUS+34,WORLD_H-PLAYER_RADIUS-20);\n   p.seenAt=now();\n\n   const t=performance.now();\n   if(t-lastPosBroadcast>50){\n     lastPosBroadcast=t;\n     broadcast(\"player-update\",{id:clientId,patch:{x:p.x,y:p.y,seenAt:p.seenAt}});\n   }\n }\n\n const cx=WARDROBE.x+WARDROBE.w/2,cy=WARDROBE.y+WARDROBE.h/2;\n const near=Math.hypot(p.x-cx,p.y-cy)<105;\n $(\"wardrobeHint\").classList.toggle(\"show\",near);\n\n const tvx=TV.x+TV.w/2,tvy=TV.y+TV.h/2;\n const nearTV=Math.hypot(p.x-tvx,p.y-tvy)<125;\n $(\"tvHint\").classList.toggle(\"show\",nearTV);\n $(\"tvHint\").textContent=\"TAP TV \u00b7 CHANNEL \"+tvChannel;\n\n const acx=ACTIVITY.x+ACTIVITY.w/2,acy=ACTIVITY.y+ACTIVITY.h/2;\n const nearActivity=Math.hypot(p.x-acx,p.y-acy)<145;\n $(\"activityHint\").classList.toggle(\"show\",nearActivity);\n $(\"activityHint\").textContent=state?.activity?.game?\"TAP GAME TABLE \u00b7 \"+activityName().toUpperCase():\"TAP GAME TABLE\";\n}\nfunction frame(t){\n const dt=Math.min(.033,(t-lastFrame)/1000||0);lastFrame=t;\n updateMovement(dt);drawWorld();requestAnimationFrame(frame)\n}\nrequestAnimationFrame(frame);\n\nfunction wakeJoystick(){\n $(\"joystick\").classList.remove(\"idle\");\n clearTimeout(joyIdleTimer);\n joyIdleTimer=setTimeout(()=>{$(\"joystick\").classList.add(\"idle\")},5000);\n}\nfunction setJoystickIdleSoon(){\n clearTimeout(joyIdleTimer);\n joyIdleTimer=setTimeout(()=>{$(\"joystick\").classList.add(\"idle\")},5000);\n}\nwakeJoystick();\n\nfunction joyMove(e){\n const r=$(\"joystick\").getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;\n let dx=e.clientX-cx,dy=e.clientY-cy;const max=38,len=Math.hypot(dx,dy);\n if(len>max){dx=dx/len*max;dy=dy/len*max}\n $(\"stick\").style.transform=`translate(${dx}px,${dy}px)`;\n input.x=dx/max;input.y=dy/max\n}\n$(\"joystick\").addEventListener(\"pointerdown\",e=>{wakeJoystick();joyId=e.pointerId;$(\"joystick\").setPointerCapture?.(joyId);joyMove(e);e.preventDefault()},{passive:false});\n$(\"joystick\").addEventListener(\"pointermove\",e=>{if(e.pointerId===joyId){joyMove(e);e.preventDefault()}},{passive:false});\nfunction joyEnd(e){if(e.pointerId!==joyId)return;joyId=null;input.x=input.y=0;$(\"stick\").style.transform=\"translate(0,0)\";setJoystickIdleSoon()}\n$(\"joystick\").addEventListener(\"pointerup\",joyEnd);$(\"joystick\").addEventListener(\"pointercancel\",joyEnd);\n\ncanvas.addEventListener(\"pointerdown\",e=>{\n if(!state)return;\n const r=canvas.getBoundingClientRect();\n const x=(e.clientX-r.left)*(WORLD_W/r.width),y=(e.clientY-r.top)*(WORLD_H/r.height);\n const p=me();if(!p)return;\n const cx=WARDROBE.x+WARDROBE.w/2,cy=WARDROBE.y+WARDROBE.h/2;\n const near=Math.hypot(p.x-cx,p.y-cy)<115;\n const tapped=x>=WARDROBE.x-10&&x<=WARDROBE.x+WARDROBE.w+10&&y>=WARDROBE.y-10&&y<=WARDROBE.y+WARDROBE.h+30;\n if(near&&tapped){openWardrobe();return}\n\n const tvx=TV.x+TV.w/2,tvy=TV.y+TV.h/2;\n const nearTV=Math.hypot(p.x-tvx,p.y-tvy)<135;\n const tappedTV=x>=TV.x-10&&x<=TV.x+TV.w+10&&y>=TV.y-28&&y<=TV.y+TV.h+15;\n if(nearTV&&tappedTV){\n   tvChannel=tvChannel%4+1;\n   $(\"tvHint\").textContent=\"TAP TV \u00b7 CHANNEL \"+tvChannel;\n   return;\n }\n\n const acx=ACTIVITY.x+ACTIVITY.w/2,acy=ACTIVITY.y+ACTIVITY.h/2;\n const nearActivity=Math.hypot(p.x-acx,p.y-acy)<155;\n const tappedActivity=x>=ACTIVITY.x-10&&x<=ACTIVITY.x+ACTIVITY.w+10&&y>=ACTIVITY.y-10&&y<=ACTIVITY.y+ACTIVITY.h+20;\n if(nearActivity&&tappedActivity){openActivity();return}\n});\n\nfunction renderWardrobePreview(){\n const p=me();if(!p)return;\n const c=$(\"wardrobePreview\"),pc=c.getContext(\"2d\");\n pc.clearRect(0,0,c.width,c.height);\n pc.save();pc.translate(c.width/2,c.height/2+8);\n\n const s=bodyStyleFor(p);\n pc.fillStyle=s.color;pc.strokeStyle=\"#eaf7ff\";pc.lineWidth=3;\n pc.beginPath();pc.roundRect(-s.w/2,-s.h/2,s.w,s.h,s.r);pc.fill();pc.stroke();\n\n pc.fillStyle=\"#10151b\";\n pc.beginPath();pc.arc(-7,-5,2.3,0,Math.PI*2);pc.arc(7,-5,2.3,0,Math.PI*2);pc.fill();\n\n const hat=cosmetics.hats.find(h=>h.id===p.hat)?.draw||null;\n const mask=cosmetics.masks.find(m=>m.id===p.mask)?.draw||null;\n\n // Wardrobe preview now uses the exact same renderer as the live character.\n drawHatTo(pc,hat,s.w,s.h);\n drawMaskTo(pc,mask,s.w,s.h);\n pc.restore();\n}\n\n\nfunction openActivity(){\n activityOpen=true;input.x=input.y=0;$(\"stick\").style.transform=\"translate(0,0)\";\n $(\"activityModal\").classList.remove(\"hidden\");renderActivityUI()\n}\nfunction closeActivity(){\n activityOpen=false;$(\"activityModal\").classList.add(\"hidden\")\n}\nfunction activityStatusText(){\n const a=state?.activity;if(!a||!a.game)return \"Choose a game\";\n if(a.status===\"waiting\")return \"Waiting for another player\";\n if(a.status===\"playing\"){\n   const p=playerById(a.seats[a.turn]);\n   return p?`${p.name}'s turn`:\"Waiting\";\n }\n if(a.status===\"won\"){\n   const p=playerById(a.seats[a.winner]);\n   return p?`${p.name} wins!`:\"Game over\";\n }\n if(a.status===\"draw\")return \"Draw\";\n return \"\";\n}\nfunction renderActivityUI(){\n if(!activityOpen||!state)return;\n const a=state.activity||freshActivity();\n $(\"activitySubtitle\").textContent=a.game?activityName(): \"Choose a game\";\n $(\"activityMenu\").classList.toggle(\"hidden\",!!a.game);\n $(\"activityGame\").classList.toggle(\"hidden\",!a.game);\n if(!a.game)return;\n\n const seats=$(\"activitySeats\");seats.innerHTML=\"\";\n for(let i=0;i<2;i++){\n   const id=a.seats[i],p=id?playerById(id):null;\n   const chip=document.createElement(\"div\");\n   chip.className=\"seatChip\"+(id===clientId?\" you\":\"\");\n   const mark=a.game===\"ttt\"?(i===0?\"X\":\"O\"):(i===0?\"RED\":\"YELLOW\");\n   chip.textContent=`${mark}: ${p?p.name:\"OPEN SEAT\"}`;\n   seats.appendChild(chip)\n }\n\n $(\"activityMessage\").textContent=activityStatusText();\n const board=$(\"activityBoard\");board.innerHTML=\"\";\n const mySeat=seatedIndex(clientId);\n const myTurn=activityCanPlay(clientId);\n\n if(a.game===\"ttt\"){\n   const grid=document.createElement(\"div\");grid.className=\"tttBoard\";\n   for(let i=0;i<9;i++){\n     const b=document.createElement(\"button\");b.className=\"tttCell\";\n     b.textContent=a.board?.[i]===1?\"X\":a.board?.[i]===2?\"O\":\"\";\n     b.disabled=!myTurn||!!a.board?.[i];\n     b.addEventListener(\"click\",()=>submitActivityAction(\"move\",{cell:i}));\n     grid.appendChild(b)\n   }\n   board.appendChild(grid)\n }else if(a.game===\"c4\"){\n   const grid=document.createElement(\"div\");grid.className=\"c4Board\";\n   for(let i=0;i<42;i++){\n     const b=document.createElement(\"button\");\n     const v=a.board?.[i];\n     b.className=\"c4Cell\"+(v===1?\" p1\":v===2?\" p2\":\"\");\n     const col=i%7;\n     b.disabled=!myTurn;\n     b.setAttribute(\"aria-label\",`Column ${col+1}`);\n     b.addEventListener(\"click\",()=>submitActivityAction(\"move\",{col}));\n     grid.appendChild(b)\n   }\n   board.appendChild(grid)\n }\n\n const actions=$(\"activityActions\");actions.innerHTML=\"\";\n if(mySeat<0&&a.seats.includes(null)){\n   const join=document.createElement(\"button\");join.className=\"btn primary\";join.textContent=\"Join Game\";\n   join.addEventListener(\"click\",()=>submitActivityAction(\"join\"));actions.appendChild(join)\n }else if(mySeat>=0){\n   const leave=document.createElement(\"button\");leave.className=\"btn\";leave.textContent=\"Leave Seat\";\n   leave.addEventListener(\"click\",()=>submitActivityAction(\"leave\"));actions.appendChild(leave)\n }\n if((a.status===\"won\"||a.status===\"draw\")&&mySeat>=0){\n   const again=document.createElement(\"button\");again.className=\"btn primary\";again.textContent=\"New Round\";\n   again.addEventListener(\"click\",()=>submitActivityAction(\"reset\"));actions.appendChild(again)\n }\n if(mySeat>=0||isHost()){\n   const end=document.createElement(\"button\");end.className=\"btn bad\";end.textContent=\"Close Game\";\n   end.addEventListener(\"click\",()=>submitActivityAction(\"end\"));actions.appendChild(end)\n }\n}\n\nfunction renderWardrobeChoices(){\n const p=me();if(!p)return;\n const colorBox=$(\"colorChoices\"),shapeBox=$(\"shapeChoices\"),hatBox=$(\"hatChoices\"),maskBox=$(\"maskChoices\");\n colorBox.innerHTML=\"\";shapeBox.innerHTML=\"\";hatBox.innerHTML=\"\";maskBox.innerHTML=\"\";\n\n for(const item of bodyColors){\n   const b=document.createElement(\"button\");b.className=\"choice\"+(p.color===item.id?\" selected\":\"\");\n   b.textContent=item.name;b.style.borderColor=item.color;b.style.boxShadow=`inset 0 -7px 0 ${item.color}`;\n   b.addEventListener(\"click\",()=>{p.color=item.id;saveState();broadcast(\"player-update\",{id:clientId,patch:{color:p.color}});renderWardrobeChoices()});\n   colorBox.appendChild(b)\n }\n\n for(const item of bodyShapes){\n   const b=document.createElement(\"button\");b.className=\"choice\"+(p.shape===item.id?\" selected\":\"\");\n   b.textContent=item.name;\n   b.addEventListener(\"click\",()=>{p.shape=item.id;saveState();broadcast(\"player-update\",{id:clientId,patch:{shape:p.shape}});renderWardrobeChoices()});\n   shapeBox.appendChild(b)\n }\n\n for(const item of cosmetics.hats){\n   const b=document.createElement(\"button\");b.className=\"choice\"+(p.hat===item.id?\" selected\":\"\");\n   const mini=document.createElement(\"canvas\");mini.width=70;mini.height=42;mini.style.width=\"70px\";mini.style.height=\"42px\";mini.style.display=\"block\";mini.style.margin=\"0 auto 4px\";\n   const mc=mini.getContext(\"2d\");mc.translate(35,34);drawHatTo(mc,item.draw,42,54);\n   const label=document.createElement(\"div\");label.textContent=item.name;\n   b.append(mini,label);\n   b.addEventListener(\"click\",()=>{p.hat=item.id;saveState();broadcast(\"player-update\",{id:clientId,patch:{hat:p.hat}});renderWardrobeChoices()});\n   hatBox.appendChild(b)\n }\n\n for(const item of cosmetics.masks){\n   const b=document.createElement(\"button\");b.className=\"choice\"+(p.mask===item.id?\" selected\":\"\");\n   const mini=document.createElement(\"canvas\");mini.width=70;mini.height=42;mini.style.width=\"70px\";mini.style.height=\"42px\";mini.style.display=\"block\";mini.style.margin=\"0 auto 4px\";\n   const mc=mini.getContext(\"2d\");mc.translate(35,22);drawMaskTo(mc,item.draw,42,54);\n   const label=document.createElement(\"div\");label.textContent=item.name;\n   b.append(mini,label);\n   b.addEventListener(\"click\",()=>{p.mask=item.id;saveState();broadcast(\"player-update\",{id:clientId,patch:{mask:p.mask}});renderWardrobeChoices()});\n   maskBox.appendChild(b)\n }\n\n renderWardrobePreview();\n}\n\nfunction openWardrobe(){wardrobeOpen=true;input.x=input.y=0;$(\"stick\").style.transform=\"translate(0,0)\";renderWardrobeChoices();$(\"wardrobeModal\").classList.remove(\"hidden\")}\nfunction closeWardrobe(){wardrobeOpen=false;$(\"wardrobeModal\").classList.add(\"hidden\")}\n$(\"closeWardrobe\").addEventListener(\"click\",closeWardrobe);\n$(\"wardrobeModal\").addEventListener(\"pointerdown\",e=>{if(e.target===$(\"wardrobeModal\"))closeWardrobe()});\n\n$(\"chooseTTT\").addEventListener(\"click\",()=>submitActivityAction(\"create\",{game:\"ttt\"}));\n$(\"chooseC4\").addEventListener(\"click\",()=>submitActivityAction(\"create\",{game:\"c4\"}));\n$(\"closeActivity\").addEventListener(\"click\",closeActivity);\n$(\"activityModal\").addEventListener(\"pointerdown\",e=>{if(e.target===$(\"activityModal\"))closeActivity()});\n\n$(\"createBtn\").addEventListener(\"click\",createLobby);\n$(\"joinBtn\").addEventListener(\"click\",joinLobby);\n$(\"leaveBtn\").addEventListener(\"click\",()=>leaveRoom(true));\n$(\"lockBtn\").addEventListener(\"click\",()=>{if(!isHost())return;broadcast(\"lock-toggle\",{})});\n$(\"sendBtn\").addEventListener(\"click\",sendChat);\n$(\"chatInput\").addEventListener(\"keydown\",e=>{if(e.key===\"Enter\")sendChat()});\n$(\"codeInput\").addEventListener(\"input\",()=>{$(\"codeInput\").value=normalizeCode($(\"codeInput\").value)});\nwindow.addEventListener(\"beforeunload\",()=>{if(socket&&joined){try{socket.send(JSON.stringify({type:\"leave\",payload:{}}))}catch{}}});\n})();\n</script>\n</body>\n</html>\n";

const MAX_PLAYERS = 8;
const WORLD_W = 700;
const WORLD_H = 780;
const PLAYER_RADIUS = 22;
const VALID_COLORS = new Set(["sky","mint","coral","violet","amber","slate"]);
const VALID_SHAPES = new Set(["pill","round","tall","squat"]);
const VALID_HATS = new Set(["none","cap","crown","cowboy","wizard","halo","party","flower","antenna","mushroom","chef","saturn"]);
const VALID_MASKS = new Set(["none","bandit","robot","cool","ghost","alien","skull","frog","cat","cyclops","clown","visor"]);

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function cleanRoom(value) {
  return String(value || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

function cleanName(value) {
  const s = String(value || "").trim().replace(/\s+/g, " ").slice(0, 18);
  return s || "Player";
}

function cleanText(value) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, 120);
}

function freshActivity() {
  return { game: null, seats: [null, null], board: null, turn: 0, status: "idle", winner: null, revision: 0 };
}

function spawnPoint(index = 0) {
  return {
    x: 120 + (index % 3) * 70,
    y: WORLD_H - 140 - Math.floor(index / 3) * 65,
  };
}

function defaultPlayer(id, name, index = 0) {
  const p = spawnPoint(index);
  return {
    id,
    name,
    joinedAt: Date.now(),
    seenAt: Date.now(),
    x: p.x,
    y: p.y,
    hat: "none",
    mask: "none",
    color: "sky",
    shape: "pill",
  };
}

function newRoom(code, id, name) {
  return {
    version: 4,
    code,
    locked: false,
    hostId: id,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    players: [defaultPlayer(id, name, 0)],
    activity: freshActivity(),
    chat: [{
      id: crypto.randomUUID(),
      type: "system",
      text: `${name} created the lobby.`,
      at: Date.now(),
    }],
  };
}

function systemMessage(room, text) {
  room.chat.push({
    id: crypto.randomUUID(),
    type: "system",
    text,
    at: Date.now(),
  });
  room.chat = room.chat.slice(-80);
}

function activityName(activity) {
  return activity?.game === "ttt" ? "Tic-Tac-Toe" :
         activity?.game === "c4" ? "Connect 4" : "Activity";
}

function initBoard(game) {
  return game === "ttt" ? Array(9).fill(null) :
         game === "c4" ? Array(42).fill(null) : null;
}

function tttWinner(board) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
  for (const [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return board.every(Boolean) ? "draw" : null;
}

function c4Winner(board) {
  const rows = 6, cols = 7;
  const get = (r,c) => r >= 0 && r < rows && c >= 0 && c < cols ? board[r * cols + c] : null;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = get(r,c);
      if (!v) continue;
      for (const [dr,dc] of [[0,1],[1,0],[1,1],[1,-1]]) {
        let ok = true;
        for (let k = 1; k < 4; k++) {
          if (get(r + dr*k, c + dc*k) !== v) { ok = false; break; }
        }
        if (ok) return v;
      }
    }
  }
  return board.every(Boolean) ? "draw" : null;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json({ ok: true, service: "social-hub-coop" });
    }

    if (url.pathname === "/ws") {
      if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket") {
        return new Response("Expected WebSocket upgrade", { status: 426 });
      }

      const room = cleanRoom(url.searchParams.get("room"));
      if (room.length !== 6) {
        return new Response("Invalid room code", { status: 400 });
      }

      const stub = env.LOBBY_ROOMS.getByName(room);
      return stub.fetch(request);
    }

    if (request.method === "GET" || request.method === "HEAD") {
      return new Response(request.method === "HEAD" ? null : INDEX_HTML, {
        headers: {
          "content-type": "text/html; charset=UTF-8",
          "cache-control": "no-store"
        }
      });
    }

    return new Response("Method not allowed", { status: 405 });
  },
};

export class LobbyRoom extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.ctx = ctx;
    this.env = env;
    this.room = null;
    this.lastPersist = 0;

    ctx.blockConcurrencyWhile(async () => {
      this.room = (await ctx.storage.get("room")) || null;
    });

    try {
      ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair("ping", "pong"));
    } catch {}
  }

  sockets() {
    return this.ctx.getWebSockets();
  }

  attachment(ws) {
    try { return ws.deserializeAttachment() || {}; }
    catch { return {}; }
  }

  send(ws, obj) {
    try { ws.send(JSON.stringify(obj)); } catch {}
  }

  broadcast(obj, except = null) {
    const payload = JSON.stringify(obj);
    for (const ws of this.sockets()) {
      if (ws === except) continue;
      try { ws.send(payload); } catch {}
    }
  }

  async persist(force = false) {
    if (!this.room) {
      await this.ctx.storage.delete("room");
      return;
    }
    const t = Date.now();
    if (!force && t - this.lastPersist < 4000) return;
    this.lastPersist = t;
    this.room.updatedAt = t;
    await this.ctx.storage.put("room", this.room);
  }

  player(id) {
    return this.room?.players?.find(p => p.id === id) || null;
  }

  ensureHost() {
    if (!this.room || !this.room.players.length) return;
    if (!this.room.players.some(p => p.id === this.room.hostId)) {
      this.room.players.sort((a,b) => a.joinedAt - b.joinedAt);
      this.room.hostId = this.room.players[0].id;
      systemMessage(this.room, `${this.room.players[0].name} is now the host.`);
    }
  }

  sanitizeActivity() {
    if (!this.room) return;
    const a = this.room.activity || freshActivity();
    this.room.activity = a;
    let changed = false;

    for (let i = 0; i < 2; i++) {
      if (a.seats[i] && !this.player(a.seats[i])) {
        a.seats[i] = null;
        changed = true;
      }
    }

    if (changed && a.game) {
      a.board = initBoard(a.game);
      a.turn = 0;
      a.winner = null;
      a.status = a.seats[0] && a.seats[1] ? "playing" : "waiting";
      a.revision = (a.revision || 0) + 1;
    }
  }

  rejectPair(reason, code = 4003) {
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);
    this.send(server, { type: "error", message: reason });
    try { server.close(code, reason.slice(0, 100)); } catch {}
    return new Response(null, { status: 101, webSocket: client });
  }

  async fetch(request) {
    const url = new URL(request.url);
    const code = cleanRoom(url.searchParams.get("room"));
    const id = String(url.searchParams.get("client") || "").slice(0, 80);
    const name = cleanName(url.searchParams.get("name"));
    const mode = String(url.searchParams.get("mode") || "join");

    if (code.length !== 6 || !id) return this.rejectPair("Invalid lobby connection.");

    const activeCount = this.sockets().length;

    if (mode === "create") {
      if (activeCount > 0) return this.rejectPair("That room code is already in use.");
      this.room = newRoom(code, id, name);
      await this.persist(true);
    } else {
      if (!this.room || this.room.code !== code || !this.room.players?.length) {
        return this.rejectPair("Lobby not found.");
      }

      const existing = this.player(id);
      const reconnecting = mode === "reconnect";

      if (this.room.locked && !existing && !reconnecting) {
        return this.rejectPair("That lobby is locked.");
      }

      if (!existing && this.room.players.length >= MAX_PLAYERS) {
        return this.rejectPair("That lobby is full.");
      }

      if (!existing) {
        this.room.players.push(defaultPlayer(id, name, this.room.players.length));
        if (!reconnecting) systemMessage(this.room, `${name} joined the lobby.`);
      } else {
        existing.name = name;
        existing.seenAt = Date.now();
      }

      if (!this.room.hostId) this.room.hostId = id;
      await this.persist(true);
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ id, name });

    this.send(server, { type: "snapshot", state: this.room });
    this.broadcast({ type: "snapshot", state: this.room }, server);

    return new Response(null, { status: 101, webSocket: client });
  }

  applyActivity(senderId, action, payload = {}) {
    if (!this.room || !this.player(senderId)) return false;
    const a = this.room.activity || (this.room.activity = freshActivity());

    if (action === "create") {
      if (a.game) return false;
      if (payload.game !== "ttt" && payload.game !== "c4") return false;
      a.game = payload.game;
      a.seats = [senderId, null];
      a.board = initBoard(payload.game);
      a.turn = 0;
      a.status = "waiting";
      a.winner = null;
      a.revision++;
      systemMessage(this.room, `${this.player(senderId).name} opened ${activityName(a)} at the activity table.`);
      return true;
    }

    if (action === "join") {
      if (!a.game || a.seats.includes(senderId)) return false;
      const slot = a.seats.indexOf(null);
      if (slot < 0) return false;
      a.seats[slot] = senderId;
      a.board = initBoard(a.game);
      a.turn = 0;
      a.winner = null;
      a.status = "playing";
      a.revision++;
      systemMessage(this.room, `${this.player(senderId).name} joined ${activityName(a)}.`);
      return true;
    }

    if (action === "leave") {
      const seat = a.seats.indexOf(senderId);
      if (seat < 0) return false;
      a.seats[seat] = null;
      if (a.game) {
        a.board = initBoard(a.game);
        a.turn = 0;
        a.winner = null;
        a.status = "waiting";
        a.revision++;
      }
      return true;
    }

    if (action === "end") {
      if (!a.game) return false;
      if (!a.seats.includes(senderId) && senderId !== this.room.hostId) return false;
      const oldName = activityName(a);
      this.room.activity = freshActivity();
      systemMessage(this.room, `${oldName} closed.`);
      return true;
    }

    if (action === "reset") {
      if (!a.game || !a.seats.includes(senderId)) return false;
      a.board = initBoard(a.game);
      a.turn = 0;
      a.winner = null;
      a.status = a.seats[0] && a.seats[1] ? "playing" : "waiting";
      a.revision++;
      return true;
    }

    if (action !== "move" || a.status !== "playing") return false;

    const seat = a.seats.indexOf(senderId);
    if (seat < 0 || seat !== a.turn) return false;
    const mark = seat + 1;

    if (a.game === "ttt") {
      const cell = Number(payload.cell);
      if (!Number.isInteger(cell) || cell < 0 || cell > 8 || a.board[cell]) return false;
      a.board[cell] = mark;
      const win = tttWinner(a.board);
      if (win === "draw") {
        a.status = "draw";
        a.winner = null;
      } else if (win) {
        a.status = "won";
        a.winner = win - 1;
      } else {
        a.turn = 1 - a.turn;
      }
      a.revision++;
      return true;
    }

    if (a.game === "c4") {
      const col = Number(payload.col);
      if (!Number.isInteger(col) || col < 0 || col > 6) return false;
      let target = -1;
      for (let r = 5; r >= 0; r--) {
        const idx = r * 7 + col;
        if (!a.board[idx]) { target = idx; break; }
      }
      if (target < 0) return false;
      a.board[target] = mark;
      const win = c4Winner(a.board);
      if (win === "draw") {
        a.status = "draw";
        a.winner = null;
      } else if (win) {
        a.status = "won";
        a.winner = win - 1;
      } else {
        a.turn = 1 - a.turn;
      }
      a.revision++;
      return true;
    }

    return false;
  }

  async webSocketMessage(ws, message) {
    if (typeof message !== "string" || !this.room) return;

    let msg;
    try { msg = JSON.parse(message); }
    catch { return; }

    const { id } = this.attachment(ws);
    const p = this.player(id);
    if (!id || !p) return;

    p.seenAt = Date.now();
    const type = msg?.type;
    const payload = msg?.payload || {};

    if (type === "presence") return;

    if (type === "player-update") {
      const patch = payload.patch || {};
      const safe = {};

      if (Number.isFinite(patch.x)) safe.x = clamp(Number(patch.x), PLAYER_RADIUS + 8, WORLD_W - PLAYER_RADIUS - 8);
      if (Number.isFinite(patch.y)) safe.y = clamp(Number(patch.y), PLAYER_RADIUS + 34, WORLD_H - PLAYER_RADIUS - 20);
      if (VALID_HATS.has(patch.hat)) safe.hat = patch.hat;
      if (VALID_MASKS.has(patch.mask)) safe.mask = patch.mask;
      if (VALID_COLORS.has(patch.color)) safe.color = patch.color;
      if (VALID_SHAPES.has(patch.shape)) safe.shape = patch.shape;

      Object.assign(p, safe);
      this.broadcast({ type: "player-update", id, patch: safe }, ws);

      const cosmeticChanged = "hat" in safe || "mask" in safe || "color" in safe || "shape" in safe;
      await this.persist(cosmeticChanged);
      return;
    }

    if (type === "chat") {
      const text = cleanText(payload.text);
      if (!text) return;
      const chatMessage = {
        id: crypto.randomUUID(),
        type: "chat",
        name: p.name,
        text,
        at: Date.now(),
      };
      this.room.chat.push(chatMessage);
      this.room.chat = this.room.chat.slice(-80);
      this.broadcast({ type: "chat", message: chatMessage });
      await this.persist(true);
      return;
    }

    if (type === "lock-toggle") {
      if (id !== this.room.hostId) return;
      this.room.locked = !this.room.locked;
      await this.persist(true);
      this.broadcast({ type: "snapshot", state: this.room });
      return;
    }

    if (type === "kick") {
      if (id !== this.room.hostId) return;
      const target = String(payload.target || "");
      if (!target || target === id) return;

      const targetPlayer = this.player(target);
      if (!targetPlayer) return;

      for (const peer of this.sockets()) {
        if (this.attachment(peer).id === target) {
          this.send(peer, { type: "kicked" });
          try { peer.close(4001, "kicked"); } catch {}
        }
      }

      this.room.players = this.room.players.filter(x => x.id !== target);
      systemMessage(this.room, `${targetPlayer.name} was removed.`);
      this.sanitizeActivity();
      await this.persist(true);
      this.broadcast({ type: "snapshot", state: this.room });
      return;
    }

    if (type === "activity-action") {
      if (this.applyActivity(id, payload.action, payload.payload || {})) {
        await this.persist(true);
        this.broadcast({ type: "snapshot", state: this.room });
      }
      return;
    }

    if (type === "leave") {
      await this.removePlayer(id, false);
      try { ws.close(1000, "leave"); } catch {}
    }
  }

  async removePlayer(id, disconnected = true) {
    if (!this.room) return;
    const leaving = this.player(id);
    if (!leaving) return;

    this.room.players = this.room.players.filter(p => p.id !== id);
    systemMessage(this.room, `${leaving.name} ${disconnected ? "disconnected" : "left the lobby"}.`);
    this.ensureHost();
    this.sanitizeActivity();

    if (this.room.players.length === 0) {
      this.room.hostId = null;
      await this.persist(true);
      await this.ctx.storage.setAlarm(Date.now() + 6 * 60 * 60 * 1000);
    } else {
      await this.persist(true);
      this.broadcast({ type: "snapshot", state: this.room });
    }
  }

  async webSocketClose(ws) {
    const { id } = this.attachment(ws);
    if (id) await this.removePlayer(id, true);
  }

  async webSocketError(ws) {
    const { id } = this.attachment(ws);
    if (id) await this.removePlayer(id, true);
  }

  async alarm() {
    if (this.sockets().length === 0) {
      this.room = null;
      await this.ctx.storage.deleteAll();
    }
  }
}
