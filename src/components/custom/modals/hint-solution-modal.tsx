import { FC } from "react";
import Modal from "@/components/ui/modal";
import { useHintSolutionModal } from "@/hooks/modals/use-hint-solution-modal";

const HintSolutionModal: FC = () => {
  const { isOpen, setClose, body, type } = useHintSolutionModal();

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

export default HintSolutionModal;
