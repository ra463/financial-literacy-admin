import React, { useEffect, useReducer, useContext } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { viewWorkshopReducer as reducer } from "../../reducers/workshopReducer";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Container, Row } from "react-bootstrap";
import MessageBox from "../layout/MessageBox";
import axiosInstance from "../../utils/axiosUtil";
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";

const Viewworkshop = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // workshop/:id

  const [{ loading, error, workshop }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(
          `/api/admin/get-workshop/${id}`,
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
                    <p>{loading ? <Skeleton /> : workshop.about_you?.name}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Email</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : workshop.about_you?.email}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Mobile No.</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : workshop.about_you?.mobile_no}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Created At</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        getDateTime(workshop?.createdAt)
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
                        getDateTime(workshop?.updatedAt)
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
                  {loading ? <Skeleton /> : <span>About School</span>}
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>School Name</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        workshop.about_school?.school_name
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>School District</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        workshop.about_school?.school_district
                      )}
                    </p>
                  </Col>
                  <Col md={15}>
                    <p className="mb-0">
                      <strong>
                        Has your school hosted our Financial Educational
                        Workshops before ?
                      </strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        workshop?.about_school?.hosted_workshop
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
                  {loading ? <Skeleton /> : <span>About The Workshop</span>}
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={15}>
                    <p className="mb-0">
                      <strong>
                        How could you like the workshops delivered ?
                      </strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        workshop.about_workshop?.workshop_delivered
                      )}
                    </p>
                  </Col>
                  <Col md={15}>
                    <p className="mb-0">
                      <strong>
                        Which grades would you like Financial Educational
                        Workshops ,for and how many classes are in each grade ?
                      </strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        workshop.about_workshop?.description
                      )}
                    </p>
                  </Col>
                  <Col md={15}>
                    <p className="mb-0">
                      <strong>
                        Would you like to have a workshop for parents ?
                      </strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        workshop?.about_workshop?.workshop_parents
                      )}
                    </p>
                  </Col>
                  <Col md={15}>
                    <p className="mb-0">
                      <strong>
                        Ideally, when would you like these workshops to take
                        place ?
                      </strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        workshop?.about_workshop?.workshop_schedule
                      )}
                    </p>
                  </Col>
                  <Col md={15}>
                    <p className="mb-0">
                      <strong>
                        Do you have a preference for which educator on our team
                        visits your school ?
                      </strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        workshop?.about_workshop?.workshop_educator
                      )}
                    </p>
                  </Col>
                  <Col md={15}>
                    <p className="mb-0">
                      <strong>
                        Which workshop delivery format works best for your
                        school ? Click here to Select options ?
                      </strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        workshop?.about_workshop?.workshop_format
                      )}
                    </p>
                  </Col>
                  <Col md={15}>
                    <p className="mb-0">
                      <strong>
                        I have some general questions about Financial
                        Educational workshops.
                      </strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        workshop?.about_workshop?.have_questions
                      )}
                    </p>
                  </Col>
                  <Col md={15}>
                    <p className="mb-0">
                      <strong>
                        I believe my school is eligible for funding from
                        _______.
                      </strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        workshop?.about_workshop?.school_eligible
                      )}
                    </p>
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

export default Viewworkshop;
