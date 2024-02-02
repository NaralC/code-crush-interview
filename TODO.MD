Essential:
- DS-Algo interview ✅
- Coding Page: ✅
    - Code synchronization ✅
    - Presence states (i.e., online users) ✅
    - Code compilation ✅
    - Code save to Supa ✅
- Note between peers (Notion-like-editor): 🤔
    - Text ✅
    - Headings 🤔
    - Images 🤔
    - Links 🤔
    - Note save to Supa ✅
- Voice/audio call: ✅
    - WebRTC ✅
    - Drag-around-or-hide-like-Zoom voice call ✅
    - Voice call only works on yourself ✅
- Interviewer/interviewee roles:
    - Role swap ✅
    - Pick questions/hints/follow-ups ✅

Should haves:
- Browse and join a room ✅
- Functionality to CRUD the question pool ✅
- Fetch question from DB (on coding page) ✅
- Coding page: ✅
    - Multiple-languages dropdown for code editor ✅
        - Code sync initial join ✅
        - Save code to DB ✅
        - Load code from DB ✅
    - Interview stopwatch
    - Edit room name ✅
    - Live cursors ✅
    - Interview Status (ongoing/finished) ✅
    - Being able to end an interview ✅
- FE interview: 
    - Being able to create FE questions ✅
    - Create a room-specific framework ✅
    - Save code + notes to DB ✅
    - Real-time sync ✅
    - Initial join sync ✅
    - Tailwind Integration ✅
    - Info for which framework a room's using ✅
- Authentication via Git ✅
- Upload code to Git repo: ✅
    > Provide access token with repo access: https://supabase.com/docs/reference/javascript/auth-signinwithoauth?example=sign-in-with-scopes
    > Create repo: https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#create-a-repository-for-the-authenticated-user or https://octokit.github.io/rest.js/v20 (look for createForAuthenticatedUser)

Nice to have:
- Text hilighting to both editors
- User acceptance test 🤔
- Make AV call optional ✅
- Abstract Octokit into an API 🤔
- Voice call not working again 🤔 (trying both from localhnost works, but not when one's from a deployment) + give AV call spin/load while this is not ready

Automated tests with Cypress 🤔 (https://github.com/cypress-io/cypress-realworld-testing-blog/tree/main):
> API:
- Compile (does it stop when fails, response shape)
- Save/Fetch Code
- Upload to GH
- Room name change
- Pusher

> Real-time (https://docs.cypress.io/guides/references/trade-offs#Multiple-browsers-open-at-the-same-time):
- WebRTC (https://webrtc.github.io/test-pages/)
- Code context/store
- Role swap
- Make a CI/CD to test before pushing to Vercel

> E2E:
- BG particle/localStorage ✅
- Create room ✅
- Join room by id ✅
- Browse room ✅
- Questions CRUD ✅

Bug Fixes:
- End interview, GH, Questions, Console btns should be dynamic depending on what's present
- When someone joins, the cursors get reset
- Supabase WS and AV device doesn't disconnect unless hard reload ⏸
- `DOMException: Failed to execute 'setRemoteDescription' on 'RTCPeerConnection': Failed to set remote answer sdp: Called in wrong state: stable` Voice call sometimes break ⏸
- `An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can escape its sandboxing.` Security issue? ⏸
- Initial join (and cursor names) sometimes doesn't work reliably (fe/notes) 🤔
- `repoExists` doesn't fetch all repos, rendering repo dupe check dead ⏸

Clean-ups:
- Room cap is only updated when someone enters/leaves. If everyone leaves simultaneously, it doesn't update
- Amongus background (https://codepen.io/matteobruni/pen/rNmMVEx)
- Monaco editor flashes when a new piece of code update comes in
- Remove streaming in the note editor
- Fixed timeouts don't work well with slow internet
- "Ending interview session" shows up when someone leaves
- Code ref is one step behind actual thing
- Try the "real-time hilighter" by switching to App Router