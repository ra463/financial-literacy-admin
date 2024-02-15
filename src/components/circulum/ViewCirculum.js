import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import MessageBox from "../layout/MessageBox";
import axiosInstance from "../../utils/axiosUtil";
import { FaEdit, FaTrash } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";
import LoadingBox from "../layout/LoadingBox";
import {
  deleteCirculumSectionReducer,
  viewCirculumReducer as reducer,
} from "../../reducers/circulums";
import EditCirculum from "./EditCirculum";
import CreateSection from "./CreateSection";
import DeleteSection from "./DeleteSection";

const ViewCirculum = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const navigate = useNavigate();
  const { id } = useParams(); // user/:id

  const [modalShow, setModalShow] = useState(false);
  const [sectionModalShow, setSectionModalShow] = useState(false);
  const [deleteBox, setDeleteBox] = useState(false);
  const [section_id, setSectionId] = useState("");

  const [{ loading, error, circulum }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [{ loading: deleteLoading }, dispatch1] = useReducer(
    deleteCirculumSectionReducer,
    {
      loading: false,
      error: "",
    }
  );

  const setThings = async (id) => {
    setSectionId(id);
    setDeleteBox(true);
  };

  const deleteSection = async (sectionId) => {
    try {
      dispatch1({ type: "DELETE_SECTION_REQUEST" });
      const res = await axiosInstance.delete(
        `/api/admin/delete-circulum-section/${id}/${sectionId}`,
        {
          headers: { Authorization: token },
        }
      );
      if (res.data) {
        dispatch1({ type: "DELETE_SECTION_RESET" });
        toast.success("Section Deleted Succesfully", {
          position: toast.POSITION.TOP_CENTER,
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
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const res = await axiosInstance.get(`/api/admin/get-circulum/${id}`, {
          headers: { Authorization: token },
        });

        dispatch({ type: "FETCH_SUCCESS", payload: res.data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
        toast.error(getError(err), {
          position: toast.POSITION.TOP_CENTER,
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
                  {loading ? <Skeleton /> : `${circulum?.title}`} - Detail(s)
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
                      <strong>Circulum Id</strong>
                    </p>
                    <p style={{ color: "orange" }}>
                      #{loading ? <Skeleton /> : circulum?._id}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Title</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : circulum?.title}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Created At</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        getDateTime(circulum?.createdAt)
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Last Updated</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        getDateTime(circulum?.updatedAt)
                      )}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card style={{ marginTop: "1rem" }}>
              <Card.Header>
                <Card.Title>Description</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col
                    style={{
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {loading ? (
                      <Skeleton />
                    ) : circulum.description ? (
                      circulum.description
                    ) : (
                      "N/A"
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card style={{ marginTop: "1rem" }}>
              <Card.Header>
                <Card.Title>All Section's</Card.Title>
                <div className="card-tools">
                  <Button onClick={() => setSectionModalShow(true)}>
                    Create Section
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="view-section">
                {circulum?.lectures.length === 0 && <p>No Lecture(s) Found</p>}
                {circulum?.lectures &&
                  circulum?.lectures.length > 0 &&
                  circulum?.lectures.map((Lecture, i) => (
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
                                  `/admin/view/circulum/${circulum._id}/${Lecture._id}`
                                );
                              }}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => setThings(Lecture._id)}
                            >
                              {deleteLoading ? <LoadingBox /> : <FaTrash />}
                            </Button>
                          </div>
                        </Card.Header>
                      </Card>
                      <Table responsive striped bordered hover>
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Title</th>
                            <th>Description</th>
                          </tr>
                        </thead>

                        <tbody>
                          {Lecture?.section?.lessons &&
                          Lecture?.section?.lessons.length > 0 ? (
                            Lecture?.section?.lessons.map((les, index) => (
                              <tr key={les._id}>
                                <td>{index + 1}</td>
                                <td>{les?.lesson_title}</td>
                                <td>{les?.lesson_desc}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={3} className="text-center">
                                No Lesson(s) Found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  ))}
              </Card.Body>
            </Card>

            <EditCirculum show={modalShow} onHide={() => setModalShow(false)} />
            <CreateSection
              show={sectionModalShow}
              onHide={() => setSectionModalShow(false)}
            />
            <ToastContainer />
          </>
        )}
      </Container>
      <DeleteSection
        show={deleteBox}
        onHide={() => setDeleteBox(false)}
        deleteHandler={() => deleteSection(section_id)}
        deleteLoading={deleteLoading}
      />
    </motion.div>
  );
};

export default ViewCirculum;
