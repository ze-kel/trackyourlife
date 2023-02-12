import Button from "@components/_UI/Button";
import Modal from "@components/_UI/Modal";
import router from "next/router";
import { useState } from "react";
import { useTrackableSafe } from "../../helpers/trackableContext";
import IconTrash from "@heroicons/react/24/outline/TrashIcon";
import Dropdown from "@components/_UI/Dropdown";

const DeleteButton = () => {
  const { deleteTrackable } = useTrackableSafe();

  if (!deleteTrackable) {
    throw new Error("Context error: Delete trackable");
  }

  const performDelete = async () => {
    await deleteTrackable();
    await router.push("/");
  };

  const [confirmOpened, setConfirmOpened] = useState(false);

  const openModal = () => {
    setConfirmOpened(true);
  };

  const closeModal = () => {
    setConfirmOpened(false);
  };

  const visible = (
    <button className="flex items-center">
      <IconTrash
        className="w-6 cursor-pointer text-neutral-400 transition-colors hover:text-red-600"
        onClick={openModal}
      />
    </button>
  );

  const hidden = (
    <>
      <h2 className="text-md text-center">Are you sure?</h2>
      <p className="mt-1 text-xs">This action is irreversible</p>

      <Button
        theme="transparent"
        fill
        size="s"
        className="mt-1"
        onClick={() => void performDelete()}
      >
        Delete
      </Button>
    </>
  );

  return (
    <Dropdown
      placement="bottom-end"
      visible={confirmOpened}
      setVisible={setConfirmOpened}
      mainPart={visible}
      hiddenPart={hidden}
    />
  );

  return (
    <>
      <button>
        <IconTrash
          className="w-7 cursor-pointer text-neutral-400 transition-colors hover:text-red-600"
          onClick={openModal}
        />
      </button>

      {confirmOpened && (
        <Modal close={closeModal}>
          <h2 className="text-xl">Are you sure you want to delete?</h2>
          <p className="pt-2">This action is irreversible</p>
          <div className="pt-3">
            <Button onClick={() => void performDelete()}>Confirm</Button>
            <Button className="ml-4" onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default DeleteButton;
