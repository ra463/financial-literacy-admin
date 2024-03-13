import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import MessageBox from "../layout/MessageBox";
import {
  Button,
  Card,
  Container,
  Form,
  InputGroup,
  Table,
} from "react-bootstrap";
import CustomPagination from "../layout/CustomPagination";
import axiosInstance from "../../utils/axiosUtil";
import { FaEye, FaEdit, FaSearch, FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import CustomSkeleton from "../layout/CustomSkeleton";
import LoadingBox from "../layout/LoadingBox";
import { getTestimonialReducer } from "../../reducers/testimonial";
import AddTestimonialModal from "./AddTestimonialModal";

export default function Testimonial() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [curPage, setCurPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(5);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [del, setDel] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const curPageHandler = (p) => setCurPage(p);

  const [
    { deleteLoading, loading, error, testimonials, filteredTestimonialsCount },
    dispatch,
  ] = useReducer(getTestimonialReducer, {
    loading: true,
    error: "",
  });

  const deleteTestimonial = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this Testimonial?") ===
      true
    ) {
      try {
        setDel(true);
        const res = await axiosInstance.delete(
          `/api/admin/delete-testimonial/${id}`,
          {
            headers: { Authorization: token },
          }
        );
        setDel(false);
        if (res.data) {
          toast.success("Testimonial Deleted Succesfully", {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      } catch (error) {
        toast.error(getError(error), {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const res = await axiosInstance.get(
          `/api/admin/get-testimonials/?keyword=${query}&resultPerPage=${resultPerPage}&currentPage=${curPage}`,
          {
            headers: { Authorization: token },
          }
        );
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
  }, [token, del, curPage, resultPerPage, query]);

  const numOfPages = Math.ceil(filteredTestimonialsCount / resultPerPage);
  const skip = resultPerPage * (curPage - 1);

  const getDateTime = (dt) => {
    const dT = dt.split(".")[0].split("T");
    return `${dT[0]} || ${dT[1]}`;
  };

  return (
    <motion.div
      initial={{ x: "-100%" }}
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
                <Button onClick={() => setModalShow(true)}>
                  Add Testimonial
                </Button>
                <Button
                  style={{ marginLeft: "7px" }}
                  onClick={() => {
                    navigate(`/admin/testimonial/edit-sequence`);
                  }}
                >
                  <FaEdit /> Edit Sequence
                </Button>
                <div className="search-box float-end">
                  <InputGroup>
                    <Form.Control
                      aria-label="Search Input"
                      placeholder="Search By Title"
                      type="search"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <InputGroup.Text
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setQuery(searchInput);
                        setCurPage(1);
                      }}
                    >
                      <FaSearch />
                    </InputGroup.Text>
                  </InputGroup>
                </div>
              </Card.Header>
              <Card.Body>
                <Table responsive striped bordered hover>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Given By</th>
                      <th>Image</th>
                      <th>Given At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <CustomSkeleton
                        resultPerPage={resultPerPage}
                        column={7}
                      />
                    ) : testimonials && testimonials.length > 0 ? (
                      testimonials.map((testimonial, i) => (
                        <tr key={testimonial?._id} className="odd">
                          <td className="text-center">{skip + i + 1}</td>
                          <td>{testimonial?.title.slice(0, 20)}</td>
                          <td>
                            {testimonial?.description.slice(0, 25) + "..."}
                          </td>
                          <td>{testimonial?.user.name}</td>
                          <td>
                            <img
                              src={testimonial?.user.image}
                              alt="testimonial"
                              width="70"
                              height="50"
                            />
                          </td>
                          <td>
                            {getDateTime(
                              testimonial?.createdAt && testimonial?.createdAt
                            )}
                          </td>
                          <td>
                            <Button
                              onClick={() => {
                                navigate(
                                  `/admin/view/testimonial/${testimonial._id}`
                                );
                              }}
                              type="success"
                              className="btn btn-primary"
                            >
                              <FaEye />
                            </Button>
                            <Button
                              disabled={loading ? true : false}
                              onClick={() => {
                                deleteTestimonial(testimonial._id);
                              }}
                              type="danger"
                              className="btn btn-danger ms-2"
                            >
                              {deleteLoading ? (
                                <LoadingBox></LoadingBox>
                              ) : (
                                <FaTrashAlt className="m-auto" />
                              )}
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center">
                          No Testimonial(s) Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
              <Card.Footer>
                <div className="float-start d-flex align-items-center mt-3">
                  <p className="p-bold m-0 me-3">Row No.</p>
                  <Form.Group controlId="resultPerPage">
                    <Form.Select
                      value={resultPerPage}
                      onChange={(e) => {
                        setResultPerPage(e.target.value);
                        setCurPage(1);
                      }}
                      aria-label="Default select example"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                {resultPerPage < filteredTestimonialsCount && (
                  <CustomPagination
                    pages={numOfPages}
                    pageHandler={curPageHandler}
                    curPage={curPage}
                  />
                )}
              </Card.Footer>
            </Card>
          </>
        )}
        <AddTestimonialModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
        <ToastContainer />
      </Container>
    </motion.div>
  );
}
