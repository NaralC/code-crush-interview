import { FC } from "react";
import Modal from "@/components/ui/modal";
import { useHintsSolutionModal } from "@/hooks/modals/use-hint-solution-modal";

const HintsSolutionModal: FC = () => {
  const { isOpen, setClose, body, type } = useHintsSolutionModal();

  return (
    <Modal
      title={type === "hints" ? "Hint(s)" : "Solution(s)"}
      isOpen={isOpen}
      setClose={setClose}
    >
      <div className="p-2 overflow-x-auto text-white rounded-md bg-slate-950 selection:bg-cyan-700">{body}</div>
    </Modal>
  );
};

export default HintsSolutionModal;
