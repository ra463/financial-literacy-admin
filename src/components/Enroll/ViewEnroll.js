import React, { useEffect, useReducer, useContext } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { viewEnroll as reducer } from "../../reducers/enroll";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Container, Row } from "react-bootstrap";
import MessageBox from "../layout/MessageBox";
import axiosInstance from "../../utils/axiosUtil";
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";

const ViewEnroll = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // workshop/:id

  const [{ loading, error, enroll }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(
          `/api/admin/get-enroll/${id}`,
          {
            headers: { Authorization: token },
          }
        );

        dispatch({ type: "FETCH_SUCCESS", payload: data });
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
                  {loading ? <Skeleton /> : <span>About You</span>}
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Name</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : enroll?.name}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Email</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : enroll?.email}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Mobile No.</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : enroll?.mobile_no}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Grade</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : enroll?.grade}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Enrolled On</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : getDateTime(enroll?.createdAt)}
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
                    {loading ? <Skeleton /> : enroll.description}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <ToastContainer />
          </>
        )}
      </Container>
    </motion.div>
  );
};

export default ViewEnroll;
