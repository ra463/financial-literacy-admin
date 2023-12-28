import React, { useReducer, useContext, useState, useEffect } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { updateLessonReducer } from "../../reducers/course";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container } from "react-bootstrap";
import axiosInstance from "../../utils/axiosUtil";

export default function EditLessonVideoModal({
  id,
  sectionId,
  lessonId,
  ...props
}) {
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading }, dispatch] = useReducer(updateLessonReducer, {
    loading: false,
    error: "",
  });

  const [video, setVideo] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!props.show) {
      setVideo("");
      setVideoPreview("");
    }
  }, [props.show]);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file.type !== "video/mp4" && file.type !== "video/mkv") {
      toast.error("Invalid video format! only mp4 & mkv allowed.", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    } else if (file.size > 1024 * 1024 * 50) {
      toast.error("Video size too large! only 50mb allowed.", {
        position: toast.POSITION.TOP_CENTER,
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

    const formdata = new FormData();
    formdata.append("video", video);

    try {
      dispatch({ type: "UPDATE_REQUEST" });

      const { data } = await axiosInstance.patch(
        `/api/admin/update-lesson-video/${id}/${sectionId}/${lessonId}`,
        formdata,
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

      if (data.message) {
        dispatch({ type: "UPDATE_SUCCESS" });
        toast.success("Lesson Updated Succesfully", {
          position: toast.POSITION.TOP_CENTER,
        });
        props.onHide();
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
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
          Edit/Update Lesson Video
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container className="small-container">
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
