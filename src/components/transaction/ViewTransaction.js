import React, { useEffect, useReducer, useContext } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { viewTransactionReducer as reducer } from "../../reducers/transaction";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Container, Row } from "react-bootstrap";
import MessageBox from "../layout/MessageBox";
import axiosInstance from "../../utils/axiosUtil";
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";

const ViewTransaction = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // user/:id

  const [{ loading, error, transaction }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(
          `/api/admin/get-transaction/${id}`,
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
                  {loading ? (
                    <Skeleton />
                  ) : (
                    `Transaction ID: ${transaction?.transactionId}`
                  )}{" "}
                  Details
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Transaction ID</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : transaction?.transactionId}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Transaction Done By</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        `${transaction?.user?.firstname}``${transaction?.user?.lastname}`
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Transaction Amount</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : transaction?.amount}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Transaction Status</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : transaction?.status}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Created At</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        getDateTime(transaction?.createdAt)
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Last Update</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        getDateTime(transaction?.updatedAt)
                      )}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title>
                  {loading ? (
                    <Skeleton />
                  ) : (
                    `Order Details for Transaction ID: ${transaction?.transactionId}`
                  )}
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Order ID</strong>
                      <span style={{ fontSize: "12px", color: "red" }}>
                        (paypalOrderId)
                      </span>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        transaction?.order?.paypalOrderId
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Purchased Course(s)</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        `1 x ${transaction?.order?.course?._id}`
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Purchased Course Title</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        transaction?.order?.course?.title
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Order Status</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : transaction?.order?.status}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Order Price</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : transaction?.order?.price}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Order Created At</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        getDateTime(transaction?.order?.createdAt)
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Order Last Update</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        getDateTime(transaction?.order?.updatedAt)
                      )}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title>
                  {loading ? (
                    <Skeleton />
                  ) : (
                    `Purchased Course for Transaction ID: ${transaction?.transactionId}`
                  )}
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Course ID</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : transaction?.course?._id}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Course Title</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : transaction?.course?.title}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Course Category</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : transaction?.course?.category}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Course Price</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        transaction?.course?.price?.toFixed(2)
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Course Duration</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        `${transaction?.course?.course_length}`
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Course Class</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : transaction?.course?.class_type}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Course Created At</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        getDateTime(transaction?.course?.createdAt)
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Course Last Update</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        getDateTime(transaction?.course?.updatedAt)
                      )}
                    </p>
                  </Col>
                  <Col md={12}>
                    <p className="mb-0">
                      <strong>Course Description</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        transaction?.course?.description
                      )}
                    </p>
                  </Col>
                  <Col md={12}>
                    <p className="mb-0">
                      <strong>Course Preview</strong>
                    </p>
                    {loading ? (
                      <Skeleton />
                    ) : transaction?.course?.poster &&
                      transaction?.course?.poster.length > 0 ? (
                      transaction?.course?.poster.map((poster, index) => (
                        <img
                          key={index}
                          src={poster}
                          alt={transaction?.course?.title}
                          className="edit-image"
                        />
                      ))
                    ) : (
                      <p>No Preview Available</p>
                    )}
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

export default ViewTransaction;
