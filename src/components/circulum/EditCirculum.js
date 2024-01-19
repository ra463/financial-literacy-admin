import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { editReducer as reducer } from "../../reducers/commonReducer";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container } from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";
import axiosInstance from "../../utils/axiosUtil";

export default function EditCirculum(props) {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();

  const [{ error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(
          `/api/admin/get-circulum/${id}`,
          {
            headers: { Authorization: token },
          }
        );

        const course = data.course;

        setTitle(course.title);
        setDescription(course.description);

        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
        toast.error(getError(error), {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    };
    fetchData();
  }, [id, props.show, token, error]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });

      const { data } = await axiosInstance.patch(
        `/api/admin/update-circulum/${id}`,
        {
          title,
          description,
        },
        {
          headers: { Authorization: token },
        }
      );

      if (data.message) {
        toast.success("Circulum Updated Succesfully. Redirecting...", {
          position: toast.POSITION.TOP_CENTER,
        });
        resetForm();
        setTimeout(() => {
          navigate(`/admin/circulums`);
          dispatch({ type: "UPDATE_SUCCESS" });
        }, 3000);
      } else {
        toast.error(data.error.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (err) {
      dispatch({
        type: "UPDATE_FAIL",
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
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Circulum
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

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
            disabled={loadingUpdate ? true : false}
          >
            Submit
          </Button>
          {loadingUpdate && <LoadingBox></LoadingBox>}
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
