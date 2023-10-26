import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { editReducer as reducer } from "../../reducers/commonReducer";
// import { uploadImage } from "../../utils/uploadImage";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container } from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";
import axiosInstance from "../../utils/axiosUtil";
import { useNavigate, useParams } from "react-router-dom";

export default function AddImageModal(props) {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();

  const [{ error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!props.show) {
      setImages("");
    }
  }, [props.show]);

  const handleImageChange = (e) => {
    const files = e.target.files;
    let allImages = [];
    for (let i = 0; i < files.length; i++) {
      if (
        files[i].type !== "image/jpeg" &&
        files[i].type !== "image/jpg" &&
        files[i].type !== "image/png"
      ) {
        toast.error("Invalid image format! only jpeg, jpg & png allowed.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setImages("");
        return;
      } else if (files[i].size > 1024 * 1024 * 2) {
        toast.error("Image size too large! only 2mb allowed.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        return;
      }
    }
    for (let i = 0; i < files.length; i++) {
      allImages.push(files[i]);
    }
    setImages(allImages);
  };

  const imageSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    [...images].forEach((image) => {
      formData.append("image", image);
    });

    try {
      dispatch({ type: "UPDATE_REQUEST" });

      const { data } = await axiosInstance.post(
        `/api/admin/upload-image/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        }
      );

      if (data) {
        toast.success("Images uploaded successfully", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setTimeout(() => {
          navigate(`/admin/courses`);
          dispatch({ type: "UPDATE_SUCCESS" });
        }, 3000);
      } else {
        toast.error(data.error.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } catch (err) {
      dispatch({
        type: "UPDATE_FAIL",
        payload: getError(err),
      });
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
          Add Preview Images
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={imageSubmitHandler}>
        <Modal.Body>
          <Container className="small-container">
            <Form.Group className="mb-3" controlId="fax">
              <Form.Label>Add More Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                multiple
              />
              <div className="edit-image">
                {images &&
                  images.map((image, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt="preview"
                    />
                  ))}
              </div>
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
