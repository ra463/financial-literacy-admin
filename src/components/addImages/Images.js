import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
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
import { FaSearch, FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import CustomSkeleton from "../layout/CustomSkeleton";
import LoadingBox from "../layout/LoadingBox";
import { getImagesReducer } from "../../reducers/images";
import AddImages from "./AddImages";

export default function Images() {
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
    { deleteLoading, loading, error, images, filteredImagesCount },
    dispatch,
  ] = useReducer(getImagesReducer, {
    loading: true,
    error: "",
  });

  const deleteImage = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this Image?") === true
    ) {
      try {
        setDel(true);
        const res = await axiosInstance.delete(
          `/api/admin/delete-image/${id}`,
          {
            headers: { Authorization: token },
          }
        );
        setDel(false);
        if (res.data) {
          toast.success("Image Deleted Succesfully", {
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
          `/api/admin/get-all-image/?keyword=${query}&resultPerPage=${resultPerPage}&currentPage=${curPage}`,
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

  const numOfPages = Math.ceil(filteredImagesCount / resultPerPage);
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
                <Button onClick={() => setModalShow(true)}>Add Image</Button>
                <div className="search-box float-end">
                  <InputGroup>
                    <Form.Control
                      aria-label="Search Input"
                      placeholder="Search"
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
                      <th>Image</th>
                      <th>Added At</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <CustomSkeleton
                        resultPerPage={resultPerPage}
                        column={5}
                      />
                    ) : images && images.length > 0 ? (
                      images.map((image, i) => (
                        <tr key={image?._id} className="odd">
                          <td className="text-center">{skip + i + 1}</td>
                          <td>{image?.title}</td>
                          <td>
                            <img
                              className="img-fluid"
                              src={image?.image}
                              alt="pic"
                              width="70"
                              height="50"
                            />
                          </td>
                          <td>
                            {getDateTime(image?.createdAt && image?.createdAt)}
                          </td>
                          <td>
                            <Button
                              disabled={loading ? true : false}
                              onClick={() => {
                                deleteImage(image._id);
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
                        <td colSpan={5} className="text-center">
                          No Images(s) Found
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
                {resultPerPage < filteredImagesCount && (
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
        <AddImages show={modalShow} onHide={() => setModalShow(false)} />
        <ToastContainer />
      </Container>
    </motion.div>
  );
}
