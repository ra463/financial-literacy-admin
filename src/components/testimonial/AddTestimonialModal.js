import React, { useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { addTestimonialReducer as reducer } from "../../reducers/testimonial";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container } from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";
import axiosInstance from "../../utils/axiosUtil";

export default function AddTestimonialModal(props) {
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setName("");
    setImage("");
    setImagePreview("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      toast.error("Invalid image format! only jpeg & png allowed.", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    } else if (file.size > 1024 * 1024 * 5) {
      toast.error("Image size too large! only 5mb allowed.", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(file);
      setImagePreview(reader.result);
    };
  };

  const addTestimonialHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("name", name);
    if (image) formData.append("image", image);

    try {
      dispatch({ type: "ADD_REQUEST" });

      const { data } = await axiosInstance.post(
        `/api/admin/add-testimonial`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (data) {
        dispatch({ type: "ADD_SUCCESS" });
        toast.success("Testimonial Added Succesfully.", {
          position: toast.POSITION.TOP_CENTER,
        });
        resetForm();
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
      dispatch({ type: "ADD_FAIL" });
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
          Add Testimonial
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={addTestimonialHandler}>
        <Modal.Body>
          <Container className="small-container">
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>
                <b>Title</b>
              </Form.Label>
              <Form.Control
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>
                <b>Description</b>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="given_by">
              <Form.Label>
                <b>Given By</b>
              </Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="image">
              <Form.Label>
                <b>User - Image</b>
                <span style={{ fontSize: "12px", color: "red" }}>
                  {" "}
                  (Optional)
                </span>
              </Form.Label>
              <Form.Control
                type="file"
                onChange={handleImageChange}
                accept="image/*"
              />
            </Form.Group>
            {
              <div className="edit-image">
                {imagePreview && <img src={imagePreview} alt="profile" />}
              </div>
            }
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
