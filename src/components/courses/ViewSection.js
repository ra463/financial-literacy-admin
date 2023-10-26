import React, {
  useEffect,
  useReducer,
  useContext,
  useState,
  Fragment,
} from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import {
  viewCourseReducer as reducer,
  deleteLessonReducer,
} from "../../reducers/course";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button, Card, Container, Table } from "react-bootstrap";
import MessageBox from "../layout/MessageBox";
import axiosInstance from "../../utils/axiosUtil";
import { FaEdit } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import AddLessonsModal from "./AddLessons";
import EditLessonsModal from "./EditLesson";
import LoadingBox from "../layout/LoadingBox";

const ViewSection = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id, sectionId } = useParams(); // user/:id

  const [lessonModalShow, setLessonModalShow] = useState(false);
  const [editLessonModalShow, setEditLessonModalShow] = useState(false);
  const [lessonId, setLessonId] = useState("");

  const [{ loading, error, course }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [{ loading: deleteLoading }, dispatch1] = useReducer(
    deleteLessonReducer,
    {
      loading: false,
      error: "",
    }
  );

  const Lecture = course?.lectures?.find((l) => l._id.toString() === sectionId);

  const deleteLecture = async (lessonId) => {
    if (
      window.confirm("Are you sure you want to delete this Lecture?") === true
    ) {
      try {
        dispatch1({ type: "DELETE_REQUEST" });
        const res = await axiosInstance.delete(
          `/api/admin/delete-lesson/${id}/${sectionId}/${lessonId}`,
          {
            headers: { Authorization: token },
          }
        );
        if (res.data) {
          toast.success("Lesson Deleted Succesfully", {
            position: toast.POSITION.TOP_CENTER,
          });
          dispatch1({ type: "DELETE_SUCCESS" });
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      } catch (error) {
        dispatch1({
          type: "DELETE_FAIL",
          payload: getError(error),
        });
        toast.error(getError(error), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(`/api/admin/getcourse/${id}`, {
          headers: { Authorization: token },
        });

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
        toast.error(getError(error), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };
    fetchData();
  }, [id, token]);

  const setThings = (lessonId) => {
    setLessonId(lessonId);
    setEditLessonModalShow(true);
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      exit={{ x: "100%" }}
    >
      <Container fluid className="py-3">
        {error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <Card style={{ marginTop: "1rem" }}>
              <Card.Header>
                <Card.Title>
                  All Lesson(s) -{" "}
                  {loading ? <Skeleton /> : `${Lecture?.section.title}`}
                </Card.Title>
                <div className="card-tools">
                  <Button onClick={() => setLessonModalShow(true)}>
                    Add Lesson
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <Table responsive striped bordered hover>
                  <thead>
                    <tr>
                      <th>S No.</th>
                      <th>Title</th>
                      <th>Video</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {Lecture?.section?.lessons &&
                    Lecture?.section?.lessons.length > 0 ? (
                      Lecture?.section?.lessons.map((les, i) => (
                        <tr key={les._id} className={les._id}>
                          <td>{i + 1}</td>
                          <td>
                            <strong>{les.video_title}</strong>
                          </td>
                          <td>
                            <video
                              width="320"
                              height="240"
                              controls
                              src={les.video}
                            />
                          </td>
                          <td>
                            <Button
                              type="danger"
                              className="btn btn-danger"
                              onClick={() => deleteLecture(les._id)}
                            >
                              {deleteLoading && (
                                <LoadingBox className="m-auto" />
                              )}
                              {!deleteLoading && (
                                <FaTrashAlt className="m-auto" />
                              )}
                            </Button>
                            <Button
                              type="success"
                              className="btn btn-success ms-2"
                              onClick={() => setThings(les._id)}
                            >
                              <FaEdit className="m-auto" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>
                          <strong>No Lesson Found</strong>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
            <AddLessonsModal
              show={lessonModalShow}
              onHide={() => setLessonModalShow(false)}
              id={id}
              sectionId={sectionId}
            />
            <EditLessonsModal
              show={editLessonModalShow}
              onHide={() => setEditLessonModalShow(false)}
              id={id}
              sectionId={sectionId}
              lessonId={lessonId}
            />
            <ToastContainer />
          </>
        )}
      </Container>
    </motion.div>
  );
};

export default ViewSection;
