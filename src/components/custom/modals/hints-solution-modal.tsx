import { FC } from "react";
import Modal from "@/components/ui/modal";
import useModalStore from "@/stores/modal-store";

const HintsSolutionModal: FC = () => {
  const {
    hintsSolutionModal: { isOpen, setClose, type, body },
  } = useModalStore();
  
  const safeParseJSON = (jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return null;
    }
  };

  const parsedBody = safeParseJSON(body);

  return (
    <Modal
      title={type === "hints" ? "Hint(s)" : "Solution(s)"}
      isOpen={isOpen}
      setClose={setClose}
    >
      <div className="p-2 overflow-x-auto text-white rounded-md bg-slate-950 selection:bg-cyan-700 ">
        <pre className="overflow-auto break-words whitespace-pre-wrap">{parsedBody}</pre>
      </div>
    </Modal>
  );
};

export default HintsSolutionModal;
