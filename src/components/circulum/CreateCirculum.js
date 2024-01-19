import React, { useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { createCourseReducer as reducer } from "../../reducers/course";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container } from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";
import axiosInstance from "../../utils/axiosUtil";

export default function CreateCirculum(props) {
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
  };

  const createCirculumHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch({ type: "CREATE_REQUEST" });

      const { data } = await axiosInstance.post(
        `/api/admin/create-circulum`,
        {
          title,
          description,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (data) {
        dispatch({ type: "CREATE_SUCCESS" });
        toast.success("Circulum Created Succesfully.", {
          position: toast.POSITION.TOP_CENTER,
        });
        resetForm();
        setTimeout(() => {
          props.onHide();
          window.location.reload();
        }, 3000);
      } else {
        toast.error(data.error.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(getError(err), {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Create Circulum
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={createCirculumHandler}>
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

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                as="textarea"
                rows={5}
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
          >
            Submit
          </Button>
          {loading && <LoadingBox></LoadingBox>}
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
