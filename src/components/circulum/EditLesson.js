import React, { useReducer, useContext, useState, useEffect } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { updateCirculumLessonReducer as reducer } from "../../reducers/circulums";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container } from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";
import axiosInstance from "../../utils/axiosUtil";

export default function EditLesson({
  id,
  sectionId,
  lessonId,
  les_title,
  les_desc,
  ...props
}) {
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const [title, setTitle] = useState(les_title);
  const [lesson_desc, setLesson_desc] = useState(les_desc);

  useEffect(() => {
    if (!props.show) {
      setLesson_desc("");
      setTitle("");
    }
  }, [props.show]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch({ type: "UPDATE_REQUEST" });

      const { data } = await axiosInstance.patch(
        `/api/admin/update-circulum-title-description/${id}/${sectionId}/${lessonId}`,
        { title, lesson_desc },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (data.message) {
        toast.success("Lesson Updated Succesfully", {
          position: toast.POSITION.TOP_CENTER,
        });
        dispatch({ type: "UPDATE_SUCCESS" });
        props.onHide();
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      toast.error(getError(error), {
        position: toast.POSITION.BOTTOM_CENTER,
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
          Edit/Update Lesson
        </Modal.Title>
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
          {loading && <LoadingBox></LoadingBox>}
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
