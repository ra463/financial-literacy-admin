import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { viewTesimonialReducer as reducer } from "../../reducers/testimonial";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Container, Row } from "react-bootstrap";
import MessageBox from "../layout/MessageBox";
import axiosInstance from "../../utils/axiosUtil";
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";
import EditTestimonialModal from "./EditTestimonialModal";

const ViewTestimonial = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // user/:id

  const [{ loading, error, testimonial }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(
          `/api/admin/get-testimonial/${id}`,
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
                  {loading ? <Skeleton /> : `Testimonial -`} Details
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
                  <Col md={6}>
                    <p className="mb-0">
                      <strong>Title</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : testimonial?.title}</p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-0">
                      <strong>Given By</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : `${testimonial?.user?.name}`}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-0">
                      <strong>Created At</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        getDateTime(testimonial?.createdAt)
                      )}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-0">
                      <strong>Last Update</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        getDateTime(testimonial?.updatedAt)
                      )}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card
              style={{
                marginTop: "1rem",
              }}
            >
              <Card.Header>
                <Card.Title>
                  {loading ? <Skeleton /> : `${testimonial?.user?.name}`} -
                  Profile picture
                </Card.Title>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <Skeleton />
                ) : (
                  <img
                    src={testimonial?.user?.image}
                    alt="profile_pic"
                    style={{
                      width: "250px",
                      height: "200px",
                      border: "1px solid slategray",
                      borderRadius: "5px",
                      objectFit: "contain",
                    }}
                  />
                )}
              </Card.Body>
            </Card>
            <Card
              style={{
                marginTop: "1rem",
              }}
            >
              <Card.Header>
                <Card.Title>
                  {loading ? <Skeleton /> : `Testimonial -`} Description
                </Card.Title>
              </Card.Header>
              <Card.Body>
                {loading ? <Skeleton /> : `${testimonial?.description}`}
              </Card.Body>
            </Card>
            <EditTestimonialModal
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
            <ToastContainer />
          </>
        )}
      </Container>
    </motion.div>
  );
};

export default ViewTestimonial;
