import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { viewUserReducer as reducer } from "../../reducers/user";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Container, Row } from "react-bootstrap";
import MessageBox from "../layout/MessageBox";
import EditUserModel from "./EditUser.js";
import axiosInstance from "../../utils/axiosUtil";
import { FaEdit } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";

const ViewUser = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // user/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, user }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(`/api/admin/user/${id}`, {
          headers: { Authorization: token },
        });

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
                  {loading ? (
                    <Skeleton />
                  ) : (
                    `${user?.firstname} ${user?.lastname}`
                  )}{" "}
                  Details
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
                      <strong>Client Id</strong>
                    </p>
                    <p style={{ color: "orange" }}>
                      #{loading ? <Skeleton /> : user?.client_id}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Firstname</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : user?.firstname}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Lastname</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : user?.lastname}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Email</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : user?.email}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Mobile No.</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : user?.mobile_no}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Role</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : user?.role}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Created At</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : getDateTime(user?.createdAt)}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Last Update</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : getDateTime(user?.updatedAt)}
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
            </Card>

            <EditUserModel
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

export default ViewUser;
