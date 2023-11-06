import { Button, Modal } from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";

export default function DeleteModal({
  deleteLoading,
  deleteHandler,
  ...props
}) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Are You Sure You Want To Delete This Lesson?
        </Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button variant="danger" onClick={props.onHide}>
          Close
        </Button>
        <Button
          variant="success"
          type="submit"
          disabled={deleteLoading ? true : false}
          onClick={deleteHandler}
        >
          Delete
        </Button>
        {deleteLoading && <LoadingBox></LoadingBox>}
      </Modal.Footer>
    </Modal>
  );
}
