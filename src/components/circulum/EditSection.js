import React, { useReducer, useContext, useState, useEffect } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { updateCirculumSectionReducer as reducer } from "../../reducers/circulums";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container } from "react-bootstrap";
import axiosInstance from "../../utils/axiosUtil";
import LoadingBox from "../layout/LoadingBox";

export default function EditSection({ id, sectionId, sectionTitle, ...props }) {
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const [title, setTitle] = useState(sectionTitle);

  useEffect(() => {
    setTitle(sectionTitle); // Update title state when sectionTitle prop changes
  }, [sectionTitle, props.show]);

  const updateSection = async () => {
    try {
      dispatch({ type: "UPDATE_SECTION_REQUEST" });
      const res = await axiosInstance.patch(
        `/api/admin/update-circulum-section/${id}/${sectionId}`,
        {
          title,
        },
        {
          headers: { Authorization: token },
        }
      );
      if (res.data) {
        dispatch({ type: "UPDATE_SECTION_SUCCESS" });
        toast.success("Section updated Succesfully", {
          position: toast.POSITION.TOP_CENTER,
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (err) {
      dispatch({
        type: "UPDATE_SECTION_FAIL",
        payload: getError(err),
      });
      toast.error(getError(error), {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  useEffect(() => {
    if (!props.show) {
      setTitle("");
    }
  }, [props.show]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Section Title
        </Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <Container className="small-container">
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            <ToastContainer />
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={props.onHide}>
            Close
          </Button>
          <Button
            variant="success"
            type="submit"
            disabled={loading ? true : false}
            onClick={updateSection}
          >
            {loading ? <LoadingBox></LoadingBox> : "Update"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
