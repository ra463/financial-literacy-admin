import React, { useReducer, useContext, useState, useEffect } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { addCirculumLessonReducer as reducer } from "../../reducers/circulums";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container } from "react-bootstrap";
import axiosInstance from "../../utils/axiosUtil";

export default function AddLesson({ id, sectionId, ...props }) {
  const { state } = useContext(Store);
  const { token } = state;

  const [{ error, loading }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const [title, setTitle] = useState("");
  const [lesson_desc, setLesson_desc] = useState("");

  useEffect(() => {
    if (!props.show) {
      setTitle("");
      setLesson_desc("");
    }
  }, [props.show]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch({ type: "ADD_REQUEST" });

      const { data } = await axiosInstance.post(
        `/api/admin/create-circulum-lesson/${id}/${sectionId}`,
        {
          title,
          lesson_desc,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (data) {
        dispatch({ type: "ADD_SUCCESS" });
        toast.success("Lesson Added Succesfully", {
          position: toast.POSITION.TOP_CENTER,
        });
        props.onHide();
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        toast.error(data.error.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (err) {
      dispatch({
        type: "ADD_FAIL",
        payload: getError(err),
      });
      toast.error(getError(error), {
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
        <Modal.Title id="contained-modal-title-vcenter">Add Lesson</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
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

            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Lesson Description</Form.Label>
              <Form.Control
                value={lesson_desc}
                onChange={(e) => setLesson_desc(e.target.value)}
                as="textarea"
                rows={5}
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
          >
            Submit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
