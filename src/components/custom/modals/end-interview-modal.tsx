import { FC } from "react";
import Modal from "@/components/ui/modal";
import useModalStore from "@/stores/modal-store";
import { Button } from "@/components/ui/button";

const EndInterviewModal: FC<{ handleEndInterview: () => Promise<void> }> = ({
  handleEndInterview,
}) => {
  const {
    endInterviewModal: { isOpen, setClose },
  } = useModalStore();

  return (
    <Modal
      title={"Are you really sure?"}
      isOpen={isOpen}
      setClose={() => {}}
      hideX
    >
      <>
        <div className="overflow-x-auto text-sm text-gray-500 ">
          This action cannot be undone. Both text editors will no longer be
          editable.
        </div>
        <div className="flex flex-row justify-end gap-3">
          <Button
            className="border border-gray-500/25"
            variant="outline"
            onClick={setClose}
          >
            Cancel
          </Button>
          <Button
            className="border border-gray-500/25"
            variant="destructive"
            onClick={() => handleEndInterview()}
          >
            End Interview
          </Button>
        </div>
      </>
    </Modal>
  );
};

export default EndInterviewModal;
