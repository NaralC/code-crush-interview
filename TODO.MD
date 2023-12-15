Essential:
- DS-Algo interview ✅
- Coding Page: ✅
    - Code synchronization ✅
    - Presence states (i.e., online users) ✅
    - Code compilation ✅
    - Code save to Supa ✅
- Note between peers (Notion-like-editor): ▶
    - Text ✅
    - Images ⌛
    - Links ⌛
    - Note save to Supa ✅
- Voice/audio call: ✅
    - WebRTC ✅
    - Drag-around-or-hide-like-Zoom voice call ✅
    - Voice call only works on yourself ✅
    - Limit to 2 if voice call active ⌛
    - Mute/unmute ⌛
- Interviewer/interviewee roles:
    - Role swap ✅
    - Pick questions/hints/follow-ups ✅

Should haves:
- Browse and join a room ✅
- Functionality to CRUD the question pool ✅
- Fetch question from DB (on coding page) ✅
- Coding page:
    - Multiple-languages dropdown for code editor ✅
        - Code sync initial join ✅
        - Save code to DB ✅
        - Load code from DB ✅
    - Interview stopwatch
    - Edit room name ✅
    - Live cursors ✅
    - Interview Status (ongoing/finished) ✅
    - Being able to end an interview ✅
    - Password lock ⌛
- FE interview: 
    - Being able to create FE questions ✅
    - Create a room-specific framework ✅
    - Save code + notes to DB ✅
    - Real-time sync ✅
    - Initial join sync ✅
    - Tailwind Integration ✅
    - Info for which framework a room's using ✅
- Video/audio device settings ⌛
- Authentication via Git ✅
- Upload code to Git repo (https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#create-a-repository-using-a-template / https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#create-a-repository-for-the-authenticated-user)
- Amongus background (https://codepen.io/matteobruni/pen/rNmMVEx)

Nice to have:
- Text hilighting to both editors
- User acceptance test

Clean-ups:
- Initial join (and cursor names) sometimes doesn't work reliably (fe/notes) ⌛
- Remove streaming in the note editor
- Fixed timeouts don't work well with slow internet
- Abstract away "Supabase on client-side to api routes"
- "Ending interview session" shows up when someone leaves
- Fix infinite refetch when 'Compilation Error'
- Code ref is one step behind actual thing
- Try the "real-time hilighter" by switching to App Router
- ~~New tabs for Monaco~~
- ~~Indicator of who's on which file~~