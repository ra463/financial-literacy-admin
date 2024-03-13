import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Table,
  Form,
  Spinner,
} from "react-bootstrap";
import MessageBox from "../layout/MessageBox";
import axiosInstance from "../../utils/axiosUtil";
import { motion } from "framer-motion";
import {
  viewCirculumReducer as reducer,
  shuffleCirculumReducer,
} from "../../reducers/circulums";

const EditSequence = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();

  const [array, setArray] = useState([]);
  const [loading, setLoading] = useState(false);

  const [{ error, circulum }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [{ loading: shuffle_loading }, dispatch1] = useReducer(
    shuffleCirculumReducer,
    {
      loading: false,
      error: "",
    }
  );

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
  }, [id, token]);

  useEffect(() => {
    if (circulum) {
      setArray([...circulum?.lectures]);
    }
  }, [circulum]);

  const submitHandler = async (e) => {
    // e.preventDafault();
    let temp = [];
    for (let i of array) {
      temp.push(parseInt(i.sequence));
      if (i.sequence === "" || i.sequence === 0) {
        toast.warning(
          "Please fill all sequence and sequence value must be non zero"
        );
        return;
      }
    }
    if (Array.from(new Set(temp)).length < array.length) {
      toast.warning("Please fill unique sequence to each fieled");
      return;
    }

    try {
      setLoading(true);
      dispatch1({ type: "SHUFFLE_REQUEST" });
      const section_array = array.map((data) => {
        return {
          _id: data._id,
          sequence: parseInt(data.sequence),
          section: data.section,
        };
      });
      // console.log(section_array);
      // return;

      const { data } = await axiosInstance.patch(
        `/api/admin/shuffle-sequence/${id}`,
        { section_array },
        {
          headers: { Authorization: token },
        }
      );
      if (data.success) {
        setLoading(false);
        toast.success("Sequence Updated Successfully");
        dispatch1({ type: "SHUFFLE_SUCCESS" });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      dispatch1({ type: "SHUFFLE_FAIL" });
      setLoading(false);
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
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
                <Card.Title>All Section's</Card.Title>
              </Card.Header>
              <Card.Body className="view-section">
                <Table responsive striped bordered hover>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Title</th>
                      <th>Sequence</th>
                    </tr>
                  </thead>
                  {circulum?.lectures.length === 0 && (
                    <p>No Lecture(s) Found</p>
                  )}
                  <tbody>
                    {array.length && circulum?.lectures.length > 0 ? (
                      circulum?.lectures.map((Lecture, index) => (
                        <tr key={index}>
                          <td>{Lecture.sequence}</td>
                          <td>{Lecture.section.title}</td>
                          <td>
                            <Form.Control
                              value={array[index].sequence}
                              onChange={(e) => {
                                let inputValue = e.target.value;

                                let temp = array.map((item, i) => {
                                  if (i === index) {
                                    return { ...item, sequence: inputValue };
                                  } else {
                                    return item;
                                  }
                                });
                                setArray(temp);
                              }}
                              type="number"
                            />
                          </td>
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

                <Row className="align-items-center mt-2">
                  <Col className="input-fieleds" sm={12} md={8}>
                    <Button onClick={submitHandler}>
                      {loading ? <Spinner /> : "Update Sequence"}
                    </Button>
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

export default EditSequence;
