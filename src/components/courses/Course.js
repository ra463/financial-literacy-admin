import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { getCoursesReducer } from "../../reducers/course";
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
import { FaEye, FaSearch, FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import CustomSkeleton from "../layout/CustomSkeleton";
import CreateCourseModel from "./CreateCourses";
import LoadingBox from "../layout/LoadingBox";
import DeleteCategory from "./DeleteCategory";

export default function Courses() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [curPage, setCurPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [del, setDel] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [allCatShow, setallCatShow] = useState(false);

  const curPageHandler = (p) => setCurPage(p);

  const [
    { deleteLoading, loading, error, courses, filteredCourseCount },
    dispatch,
  ] = useReducer(getCoursesReducer, {
    loading: true,
    error: "",
  });

  const deleteCourse = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this Course?\n\nNote: All Related lectures, photos, videos, Enrolled-Students will also be deleted."
      ) === true
    ) {
      try {
        setDel(true);
        const res = await axiosInstance.delete(
          `/api/admin/delete-course/${id}`,
          {
            headers: { Authorization: token },
          }
        );
        setDel(false);
        if (res.data) {
          toast.success("Course Deleted Succesfully", {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      } catch (error) {
        toast.error(getError(error), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const res = await axiosInstance.get(
          `/api/admin/getallcourses/?keyword=${query}&resultPerPage=${resultPerPage}&currentPage=${curPage}`,
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
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };
    fetchData();
  }, [token, del, curPage, resultPerPage, query]);

  const numOfPages = Math.ceil(filteredCourseCount / resultPerPage);
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
              <Card.Header
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <span>
                    Total Courses: <b>{filteredCourseCount}</b>
                  </span>
                  <Button onClick={() => setModalShow(true)}>
                    Create New Course
                  </Button>
                  <Button onClick={() => setallCatShow(true)}>
                    Categories
                  </Button>
                </div>
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
                      <th>Course Id</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Poster</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <CustomSkeleton
                        resultPerPage={resultPerPage}
                        column={8}
                      />
                    ) : courses && courses.length > 0 ? (
                      courses.map((course, i) => (
                        <tr key={course?._id} className="odd">
                          <td className="text-center">{skip + i + 1}</td>
                          <td style={{ color: "orange" }}>
                            #{course?.course_id}
                          </td>
                          <td>{course?.title}</td>
                          <td>{course?.category}</td>
                          <td>${course?.price}</td>
                          <td>
                            {course?.poster.length > 0 ? (
                              <img
                                src={course.poster[0]}
                                alt=""
                                style={{
                                  width: "70px",
                                  height: "50px",
                                }}
                              />
                            ) : (
                              <b>No Poster</b>
                            )}
                          </td>
                          <td>
                            {getDateTime(
                              course?.createdAt && course?.createdAt
                            )}
                          </td>
                          <td>
                            <Button
                              onClick={() => {
                                navigate(`/admin/view/course/${course._id}`);
                              }}
                              type="success"
                              className="btn btn-primary"
                            >
                              <FaEye />
                            </Button>
                            <Button
                              disabled={loading ? true : false}
                              onClick={() => {
                                deleteCourse(course._id);
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
                          No Course(s) Found
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
                {resultPerPage < filteredCourseCount && (
                  <CustomPagination
                    pages={numOfPages}
                    pageHandler={curPageHandler}
                    curPage={curPage}
                  />
                )}
              </Card.Footer>
            </Card>
            <CreateCourseModel
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
            <DeleteCategory
              show={allCatShow}
              onHide={() => setallCatShow(false)}
            />
          </>
        )}
        <ToastContainer />
      </Container>
    </motion.div>
  );
}
