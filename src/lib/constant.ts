export const DEFAULT_ROOM_ID = "d7a1af15-4fea-4207-98e6-b3a97e42f19a";

export const EVENT = {
  NEW_JOIN: "new-join",
  CODE_UPDATE: "code-update",
  NOTE_UPDATE: "note-update",
  MOUSE_UPDATE: "mouse-update",
  COMPILE_UPDATE: "compile-update",
  SAVE_UPDATE: "save-update",
  CLIENT_READY: "client-ready",
  CLIENT_OFFER: "client-offer",
  CLIENT_ANSWER: "client-answer",
  CLIENT_ICE_CANDIDATE: "client-ice-candidate",
};

export const LANGUAGE_ID = {
  typescript: 74,
  python: 71,
  "c#": 51,
};

export const ICE_SERVERS = {
  iceServers: [
    {
      urls: "stun:openrelay.metered.ca:80",
    },
    {
      urls: "stun:stun.l.google.com:19302",
    },
    {
      urls: "stun:stun2.l.google.com:19302",
    },
  ],
};
