import React, { useReducer, useContext, useState, useEffect } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { updateLessonReducer } from "../../reducers/course";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container } from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";
import axiosInstance from "../../utils/axiosUtil";

export default function EditLessonsModal({
  id,
  sectionId,
  lessonId,
  les_title,
  les_desc,
  les_video,
  ...props
}) {
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading }, dispatch] = useReducer(updateLessonReducer, {
    loading: false,
    error: "",
  });

  const [title, setTitle] = useState(les_title);
  const [video_desc, setVideo_desc] = useState(les_desc);
  const [video, setVideo] = useState(les_video);
  const [videoPreview, setVideoPreview] = useState("");

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
    const formData = new FormData();

    formData.append("title", title);
    formData.append("video_desc", video_desc);
    formData.append("video", video);

    try {
      dispatch({ type: "UPDATE_REQUEST" });

      const { data } = await axiosInstance.put(
        `/api/admin/update-lesson/${id}/${sectionId}/${lessonId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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
