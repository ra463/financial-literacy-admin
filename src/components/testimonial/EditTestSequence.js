import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
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
  getTestimonialReducer,
  shuffleTestimonialReducer,
} from "../../reducers/testimonial";

const EditTestSequence = () => {
  const { state } = useContext(Store);
  const { token } = state;

  const [array, setArray] = useState([]);
  const [loading, setLoading] = useState(false);

  const [{ error, testimonials }, dispatch] = useReducer(
    getTestimonialReducer,
    {
      loading: true,
      error: "",
    }
  );

  const [{ loading: shuffle_loading }, dispatch1] = useReducer(
    shuffleTestimonialReducer,
    {
      loading: false,
      error: "",
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const res = await axiosInstance.get(`/api/admin/get-testimonials`, {
          headers: { Authorization: token },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: res.data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
        toast.error(getError(error), {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    if (testimonials) {
      setArray([...testimonials]);
    }
  }, [testimonials]);

  const submitHandler = async () => {
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
      dispatch1({ type: "SHUFFLE_REQUEST" });
      setLoading(true);
      const testimonial_array = array.map((data) => {
        return {
          _id: data._id,
          description: data.description,
          user: data.user,
          sequence: parseInt(data.sequence),
        };
      });
      // console.log(section_array);
      // return;

      const { data } = await axiosInstance.patch(
        `/api/admin/shuffle-testimonial-sequence`,
        { testimonial_array },
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
                <Card.Title>All Testimonial's</Card.Title>
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
                  <tbody>
                    {array.length && testimonials?.length > 0 ? (
                      testimonials.map((test, index) => (
                        <tr key={index}>
                          <td>{test.sequence}</td>
                          <td>{test.title}</td>
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
                          No Testimonial(s) Found
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

export default EditTestSequence;
