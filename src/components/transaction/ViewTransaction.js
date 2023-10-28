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
            {/* <Card>
              <Card.Header>
                <Card.Title>
                  {loading ? (
                    <Skeleton />
                  ) : (
                    `${user?.firstname} ${user?.lastname}`
                  )}{" "}
                  Profile picture
                </Card.Title>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <Skeleton />
                ) : (
                  <img
                    src={user?.avatar.url}
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
            </Card> */}
            <ToastContainer />
          </>
        )}
      </Container>
    </motion.div>
  );
};

export default ViewTransaction;
