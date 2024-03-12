import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import {
  viewCirculumReducer as reducer,
  deleteCirculumLessonReducer,
} from "../../reducers/circulums";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button, Card, Container, Table } from "react-bootstrap";
import MessageBox from "../layout/MessageBox";
import axiosInstance from "../../utils/axiosUtil";
import { FaEdit } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import DeleteLesson from "./DeleteLesson";
import EditLesson from "./EditLesson";
import AddLesson from "./AddLesson";
import EditSection from "./EditSection";

const ViewCirculumSection = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id, sectionId } = useParams(); // user/:id

  const [lessonModalShow, setLessonModalShow] = useState(false);
  const [editLessonDetailsModalShow, setEditLessonDetailsModalShow] =
    useState(false);
  const [editSectionTitleModalShow, setEditSectionTitleModalShow] =
    useState(false);
  const [deleteBox, setDeleteBox] = useState(false);
  const [lessonId, setLessonId] = useState("");

  const [{ loading, error, circulum }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [{ loading: deleteLoading }, dispatch1] = useReducer(
    deleteCirculumLessonReducer,
    {
      loading: false,
      error: "",
    }
  );

  const Lecture = circulum?.lectures?.find(
    (l) => l._id.toString() === sectionId
  );

  const deleteLecture = async (lessonId) => {
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

  const setThings = (id) => {
    setLessonId(id);
    setDeleteBox(true);
  };
  const setThings1 = (lessonId) => {
    setLessonId(lessonId);
    setEditLessonDetailsModalShow(true);
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
              <Card.Header className="edit-section">
                <Card.Title>
                  All Lesson(s) -{" "}
                  {loading ? <Skeleton /> : `${Lecture?.section.title}`}
                </Card.Title>
                <div>
                  <Button onClick={() => setLessonModalShow(true)}>
                    Add Lesson
                  </Button>
                  <Button onClick={() => setEditSectionTitleModalShow(true)}>
                    Edit Section Title
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
                            <strong>{les.lesson_title}</strong>
                          </td>
                          <td>{les.lesson_desc}</td>
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
                                onClick={() => setThings(les._id)}
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
                            </div>
                          </td>
                          {editLessonDetailsModalShow && (
                            <EditLesson
                              show={editLessonDetailsModalShow}
                              onHide={() =>
                                setEditLessonDetailsModalShow(false)
                              }
                              id={id}
                              sectionId={sectionId}
                              lessonId={lessonId}
                              les_title={les?.lesson_title}
                              les_desc={les?.lesson_desc}
                            />
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center">
                          No Lesson(s) Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
            <AddLesson
              show={lessonModalShow}
              onHide={() => setLessonModalShow(false)}
              id={id}
              sectionId={sectionId}
            />
            <EditSection
              show={editSectionTitleModalShow}
              onHide={() => setEditSectionTitleModalShow(false)}
              id={id}
              sectionId={sectionId}
              sectionTitle={Lecture?.section.title}
            />
            <ToastContainer />
          </>
        )}
      </Container>
      <DeleteLesson
        show={deleteBox}
        onHide={() => setDeleteBox(false)}
        deleteHandler={() => deleteLecture(lessonId)}
        deleteLoading={deleteLoading}
      />
    </motion.div>
  );
};

export default ViewCirculumSection;
