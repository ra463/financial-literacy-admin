import React, { useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container } from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";
import axiosInstance from "../../utils/axiosUtil";
import { createCirculumSectionReducer as reducer } from "../../reducers/circulums";

export default function CreateSection(props) {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const [title, setTitle] = useState("");

  const resetForm = () => {
    setTitle("");
  };

  const createSectionHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch({ type: "CREATE_REQUEST" });

      const { data } = await axiosInstance.post(
        `/api/admin/create-section/${id}`,
        { title },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (data) {
        dispatch({ type: "CREATE_SUCCESS" });
        toast.success("Section Created Succesfully", {
          position: toast.POSITION.TOP_CENTER,
        });
        resetForm();
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      dispatch({ type: "CREATE_FAIL" });
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
          Create Section
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={createSectionHandler}>
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
          >
            Submit
          </Button>
          {loading && <LoadingBox></LoadingBox>}
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
