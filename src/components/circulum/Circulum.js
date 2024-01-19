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
import { FaEye, FaSearch, FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import CustomSkeleton from "../layout/CustomSkeleton";
import LoadingBox from "../layout/LoadingBox";
import { getCirculumReducer } from "../../reducers/circulums";
import CreateCirculum from "./CreateCirculum";

export default function Circulum() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [curPage, setCurPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [del, setDel] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const curPageHandler = (p) => setCurPage(p);

  const [
    { deleteLoading, loading, error, circulum, filteredCirculumCount },
    dispatch,
  ] = useReducer(getCirculumReducer, {
    loading: true,
    error: "",
  });

  const deleteCirculum = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this Circulum?") === true
    ) {
      try {
        setDel(true);
        const res = await axiosInstance.delete(
          `/api/admin/delete-circulum/${id}`,
          {
            headers: { Authorization: token },
          }
        );
        setDel(false);
        if (res.data) {
          toast.success("Circulum Deleted Succesfully", {
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
          `/api/admin/get-circulums/?keyword=${query}&resultPerPage=${resultPerPage}&currentPage=${curPage}`,
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

  const numOfPages = Math.ceil(filteredCirculumCount / resultPerPage);
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
                    Total Circulum: <b>{filteredCirculumCount}</b>
                  </span>
                  <Button onClick={() => setModalShow(true)}>
                    Create Circulum
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
                      <th>Title</th>
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
                    ) : circulum && circulum.length > 0 ? (
                      circulum.map((course, i) => (
                        <tr key={course?._id} className="odd">
                          <td className="text-center">{skip + i + 1}</td>
                          <td>{course?.title}</td>
                          <td>
                            {getDateTime(
                              course?.createdAt && course?.createdAt
                            )}
                          </td>
                          <td>
                            <Button
                              onClick={() => {
                                navigate(`/admin/view/circulum/${course._id}`);
                              }}
                              type="success"
                              className="btn btn-primary"
                            >
                              <FaEye />
                            </Button>
                            <Button
                              disabled={loading ? true : false}
                              onClick={() => {
                                deleteCirculum(course._id);
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
                        <td colSpan={4} className="text-center">
                          No Circulum(s) Found
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
                {resultPerPage < filteredCirculumCount && (
                  <CustomPagination
                    pages={numOfPages}
                    pageHandler={curPageHandler}
                    curPage={curPage}
                  />
                )}
              </Card.Footer>
            </Card>
            <CreateCirculum
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
          </>
        )}
        <ToastContainer />
      </Container>
    </motion.div>
  );
}
