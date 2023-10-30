import React, { useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { addImagesReducer as reducer } from "../../reducers/images";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container } from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";
import axiosInstance from "../../utils/axiosUtil";

export default function AddImages(props) {
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const resetForm = () => {
    setTitle("");
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
    } else if (file.size > 1024 * 1024 * 2) {
      toast.error("Image size too large! only 2mb allowed.", {
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

  const addImageHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    if (image) formData.append("image", image);

    try {
      dispatch({ type: "ADD_REQUEST" });

      const { data } = await axiosInstance.post(
        `/api/admin/add-image`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (data) {
        dispatch({ type: "ADD_SUCCESS" });
        toast.success("Image Added Succesfully.", {
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
        <Modal.Title id="contained-modal-title-vcenter">Add Image</Modal.Title>
      </Modal.Header>
      <Form onSubmit={addImageHandler}>
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

            <Form.Group className="mb-3" controlId="image">
              <Form.Label>
                <b>Image</b>
              </Form.Label>
              <Form.Control
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                required
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
