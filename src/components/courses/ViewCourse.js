import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import {
  viewCourseReducer as reducer,
  deleteSectionReducer,
} from "../../reducers/course";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import MessageBox from "../layout/MessageBox";
import axiosInstance from "../../utils/axiosUtil";
import { FaEdit, FaTrash } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";
import EditCourseModal from "./EditCourse";
import AddImageModal from "./AddImages";
import CreateSectionModel from "./CreateSection";
import LoadingBox from "../layout/LoadingBox";

const ViewCourse = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const navigate = useNavigate();
  const { id } = useParams(); // user/:id

  const [modalShow, setModalShow] = useState(false);
  const [modalImageShow, setModalImageShow] = useState(false);
  // const [del, setDel] = useState(false);
  const [sectionModalShow, setSectionModalShow] = useState(false);

  const [{ loading, error, course }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [{ loading: deleteLoading }, dispatch1] = useReducer(
    deleteSectionReducer,
    {
      loading: false,
      error: "",
    }
  );

  const deleteSection = async (sectionId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this Course?\n\nNote: All Related lectures, videos will also be deleted."
      ) === true
    ) {
      try {
        dispatch1({ type: "DELETE_SECTION_REQUEST" });
        const res = await axiosInstance.delete(
          `/api/admin/delete-section/${id}/${sectionId}`,
          {
            headers: { Authorization: token },
          }
        );
        if (res.data) {
          dispatch1({ type: "DELETE_SECTION_RESET" });
          toast.success("Section Deleted Succesfully", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      } catch (error) {
        dispatch1({
          type: "DELETE_SECTION_FAIL",
          payload: getError(error),
        });
        toast.error(getError(error), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    }
  };

  // const deleteImage = async (posterUrl) => {
  //   if (
  //     window.confirm("Are you sure you want to delete this Image?") === true
  //   ) {
  //     try {
  //       setDel(true);
  //       const res = await axiosInstance.delete(
  //         `/api/admin/delete-poster/${id}/?posterUrl=${posterUrl}`,
  //         {
  //           headers: { Authorization: token },
  //         }
  //       );
  //       setDel(false);
  //       if (res.data) {
  //         toast.success("Poster Deleted Succesfully", {
  //           position: toast.POSITION.TOP_CENTER,
  //         });
  //       }
  //     } catch (error) {
  //       toast.error(getError(error), {
  //         position: toast.POSITION.TOP_CENTER,
  //       });
  //     }
  //   }
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const res = await axiosInstance.get(`/api/admin/getcourse/${id}`, {
          headers: { Authorization: token },
        });

        dispatch({ type: "FETCH_SUCCESS", payload: res.data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
        toast.error(getError(err), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };
    fetchData();
  }, [id, token, deleteLoading]);

  const getDateTime = (dt) => {
    const dT = dt.split(".")[0].split("T");
    return `${dT[0]} ${dT[1]}`;
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
            <Card>
              <Card.Header>
                <Card.Title>
                  {loading ? <Skeleton /> : `${course?.title}`} - Detail(s)
                </Card.Title>
                <div className="card-tools">
                  <FaEdit
                    style={{ color: "blue" }}
                    onClick={() => setModalShow(true)}
                  />
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Title</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : course.title}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Category</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : course.category}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Price</strong>
                    </p>
                    <p>${loading ? <Skeleton /> : course.price}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Creator Name</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : course.createdBy.name}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Creator Title</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : course.createdBy.title}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Created At</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : getDateTime(course.createdAt)}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Last Update</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : getDateTime(course.updatedAt)}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card style={{ marginTop: "1rem" }}>
              <Card.Header>
                <Card.Title>
                  Poster(s) - {loading ? <Skeleton /> : `${course?.title}`}
                </Card.Title>
                <div className="card-tools">
                  <Button onClick={() => setModalImageShow(true)}>
                    {course?.poster.length === 0
                      ? "Add Preview Image"
                      : "Add Mores Image(s)"}
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <Skeleton />
                ) : (
                  <div className="edit-image">
                    {course?.poster.length === 0 && <p>No Image Found</p>}
                    {course?.poster &&
                      course?.poster.length > 0 &&
                      course?.poster.map((posterUrl, i) => (
                        <div
                          key={i}
                          style={{
                            position: "relative",
                          }}
                        >
                          <img
                            src={posterUrl}
                            alt=""
                            style={{
                              width: "250px",
                              height: "200px",
                              border: "1px solid slategray",
                              borderRadius: "5px",
                            }}
                          />
                          <Button
                            // onClick={() => deleteImage(posterUrl)}
                            variant="danger"
                            className="trash"
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </Card.Body>
            </Card>

            <Card style={{ marginTop: "1rem" }}>
              <Card.Header>
                <Card.Title>
                  Description - {loading ? <Skeleton /> : `${course?.title}`}
                </Card.Title>
                <div className="card-tools">
                  <FaEdit
                    style={{ color: "blue" }}
                    onClick={() => setModalShow(true)}
                  />
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col
                    style={{
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {loading ? <Skeleton /> : course.description}
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card style={{ marginTop: "1rem" }}>
              <Card.Header>
                <Card.Title>
                  All Lecture's - {loading ? <Skeleton /> : `${course?.title}`}
                </Card.Title>
                <div className="card-tools">
                  <Button onClick={() => setSectionModalShow(true)}>
                    Create Section
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="view-section">
                {course?.lectures.length === 0 && <p>No Lecture Found</p>}
                {course?.lectures &&
                  course?.lectures.length > 0 &&
                  course?.lectures.map((Lecture, i) => (
                    <div key={i}>
                      <Card className="view-section-card">
                        <Card.Header
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Card.Title>
                            Section {i + 1} - {Lecture.section.title}
                          </Card.Title>
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                            }}
                          >
                            <Button
                              onClick={() => {
                                navigate(
                                  `/admin/view/course/${course._id}/${Lecture._id}`
                                );
                              }}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => deleteSection(Lecture._id)}
                            >
                              {deleteLoading ? <LoadingBox /> : <FaTrash />}
                            </Button>
                          </div>
                        </Card.Header>
                      </Card>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Title</th>
                            <th>Video Preview</th>
                            <th>Video Duration</th>
                          </tr>
                        </thead>

                        <tbody>
                          {Lecture?.section?.lessons &&
                          Lecture?.section?.lessons.length > 0 ? (
                            Lecture?.section?.lessons.map((les, index) => (
                              <tr key={les._id}>
                                <td>{index + 1}</td>
                                <td>{les.video_title}</td>
                                <td>
                                  <video
                                    className="view-video"
                                    src={les.video}
                                  />
                                </td>
                                <td>
                                  {les.duration && (
                                    <>
                                      {Math.floor(les.duration / 60)}:
                                      {(les.duration % 60)
                                        .toFixed(0)
                                        .padStart(2, 0)}
                                    </>
                                  )}
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
                    </div>
                  ))}
              </Card.Body>
            </Card>

            <EditCourseModal
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
            <AddImageModal
              show={modalImageShow}
              onHide={() => setModalImageShow(false)}
            />
            <CreateSectionModel
              show={sectionModalShow}
              onHide={() => setSectionModalShow(false)}
            />
            <ToastContainer />
          </>
        )}
      </Container>
    </motion.div>
  );
};

export default ViewCourse;
