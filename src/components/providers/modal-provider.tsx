import { FC } from "react";
import CreateRoomModal from "../custom/modals/create-room-modal";
import JoinRoomModal from "../custom/modals/join-room-modal";
import FeedbackModal from "../custom/modals/feedback-modal";

const ModalProvider: FC = () => {
  // TODO: Insert more modals here
  return (
    <>
      <CreateRoomModal />
      <JoinRoomModal />
      <FeedbackModal />
    </>
  );
};

export default ModalProvider;
