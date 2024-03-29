import React, { useEffect, useReducer, useContext, useState } from "react";
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
import EditLessonDetailsModal from "./EditLessonDetails";
import DeleteModal from "./DeleteModal";
import EditLessonVideoModal from "./EditLessonVideo";

const ViewSection = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id, sectionId } = useParams(); // user/:id

  const [lessonModalShow, setLessonModalShow] = useState(false);
  const [editLessonDetailsModalShow, setEditLessonDetailsModalShow] =
    useState(false);
  const [editLessonVideoModalShow, setEditLessonVideoModalShow] =
    useState(false);
  const [deleteBox, setDeleteBox] = useState(false);
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
          position: toast.POSITION.TOP_CENTER,
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

  const setThings1 = (lessonId) => {
    setLessonId(lessonId);
    setEditLessonDetailsModalShow(true);
  };

  const setThings2 = (lessonId) => {
    setLessonId(lessonId);
    setEditLessonVideoModalShow(true);
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
                      <th>Description</th>
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
                          <td>{les.video_desc}</td>
                          <td>
                            <video
                              width="320"
                              height="240"
                              controls
                              src={les.video}
                            />
                          </td>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                                gap: "10px",
                              }}
                            >
                              <Button
                                type="danger"
                                className="btn btn-danger"
                                onClick={() => setDeleteBox(true)}
                              >
                                <FaTrashAlt className="m-auto" /> Delete Lesson
                              </Button>
                              <Button
                                type="success"
                                className="btn btn-success ms-2"
                                onClick={() => setThings1(les._id)}
                              >
                                <FaEdit className="m-auto" /> Edit Details
                              </Button>
                              <Button
                                type="secondary"
                                className="btn btn-secondary ms-2"
                                onClick={() => setThings2(les._id)}
                              >
                                <FaEdit className="m-auto" /> Update Video
                              </Button>
                            </div>
                          </td>
                          {deleteBox && (
                            <DeleteModal
                              show={deleteBox}
                              onHide={() => setDeleteBox(false)}
                              deleteHandler={() => deleteLecture(les._id)}
                              deleteLoading={deleteLoading}
                            />
                          )}
                          {editLessonDetailsModalShow && (
                            <EditLessonDetailsModal
                              show={editLessonDetailsModalShow}
                              onHide={() =>
                                setEditLessonDetailsModalShow(false)
                              }
                              id={id}
                              sectionId={sectionId}
                              lessonId={lessonId}
                              les_title={les?.video_title}
                              les_desc={les?.video_desc}
                            />
                          )}
                          {editLessonVideoModalShow && (
                            <EditLessonVideoModal
                              show={editLessonVideoModalShow}
                              onHide={() => setEditLessonVideoModalShow(false)}
                              id={id}
                              sectionId={sectionId}
                              lessonId={lessonId}
                            />
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center">
                          No Lesson(s) Found
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
            <ToastContainer />
          </>
        )}
      </Container>
    </motion.div>
  );
};

export default ViewSection;
