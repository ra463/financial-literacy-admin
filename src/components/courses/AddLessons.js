import React, { useReducer, useContext, useState, useEffect } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { addLessonsReducer } from "../../reducers/course";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container } from "react-bootstrap";
import axiosInstance from "../../utils/axiosUtil";

export default function AddLessonsModal({ id, sectionId, ...props }) {
  const { state } = useContext(Store);
  const { token } = state;

  const [{ error, loading }, dispatch] = useReducer(addLessonsReducer, {
    loading: false,
    error: "",
  });

  const [title, setTitle] = useState("");
  const [video_desc, setVideo_desc] = useState("");
  const [video, setVideo] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!props.show) {
      setVideo("");
      setVideo_desc("");
      setTitle("");
      setVideoPreview("");
    }
  }, [props.show]);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file.type !== "video/mp4" && file.type !== "video/mkv") {
      toast.error("Invalid video format! only mp4 & mkv allowed.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    } else if (file.size > 1024 * 1024 * 50) {
      toast.error("Video size too large! only 50mb allowed.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setVideo(file);
      setVideoPreview(reader.result);
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("title", title);
    formData.append("video_desc", video_desc);
    formData.append("video", video);

    try {
      dispatch({ type: "ADD_REQUEST" });

      const { data } = await axiosInstance.post(
        `/api/admin/create-lesson/${id}/${sectionId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            let percent = Math.floor((loaded * 100) / total);
            setProgress(percent);
          },
        }
      );

      if (data) {
        dispatch({ type: "ADD_SUCCESS" });
        props.onHide();
        toast.success("Lesson Added Succesfully", {
          position: toast.POSITION.TOP_CENTER,
        });

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
        <Modal.Title id="contained-modal-title-vcenter">
          Add Lesson(s)
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
              <Form.Label>Video Description</Form.Label>
              <Form.Control
                value={video_desc}
                onChange={(e) => setVideo_desc(e.target.value)}
                as="textarea"
                rows={5}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="video">
              <Form.Label>Video</Form.Label>
              <Form.Control
                type="file"
                onChange={handleVideoChange}
                accept="video/*"
                required
              />
            </Form.Group>
            {
              <div className="edit-image">
                {videoPreview && <video src={videoPreview} controls />}
              </div>
            }

            <ToastContainer />
          </Container>
        </Modal.Body>
        <Modal.Footer>
          {progress > 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                width: "100%",
              }}
            >
              <progress style={{ width: "100%" }} max="100" value={progress} />
              <Button style={{ width: "100%" }} variant="success">
                {progress > 99 ? "Processing..." : `Uploading ${progress}%`}
              </Button>
            </div>
          ) : (
            <>
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
            </>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
