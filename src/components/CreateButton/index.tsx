import CreateDialog from "@components/CreateDialog";
import Button from "@components/_UI/Button";
import Modal from "@components/_UI/Modal";
import { useState } from "react";

const CreateButton = () => {
  const [isCreating, setIsCreating] = useState(false);

  const openModal = () => {
    setIsCreating(true);
  };

  const closeModal = () => {
    setIsCreating(false);
  };

  return (
    <>
      <Button onClick={openModal}>Add New</Button>
      {isCreating && (
        <Modal close={closeModal}>
          <CreateDialog onSuccess={closeModal}></CreateDialog>
        </Modal>
      )}
    </>
  );
};

export default CreateButton;
