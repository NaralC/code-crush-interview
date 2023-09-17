import { FC } from "react";
import Modal from "@/components/ui/modal";

const BrowseRoomsModal: FC = () => {

  return (
    <Modal
      title={"Browse Rooms"}
      isOpen={false}
      setClose={() => {}}
    >
      <div className="p-2 overflow-x-auto text-white rounded-md bg-slate-950 selection:bg-cyan-700">kuay</div>
    </Modal>
  );
};

export default BrowseRoomsModal;
