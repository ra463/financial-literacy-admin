import React, { useReducer, useContext, useEffect } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { getCategoryReducer as getcategory } from "../../reducers/course";
import { deleteCategoryReducer as deletecategory } from "../../reducers/course";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container, Table } from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";
import axiosInstance from "../../utils/axiosUtil";

export default function DeleteCategory(props) {
  const { state } = useContext(Store);
  const { token } = state;

  const [{ categories }, dispatch] = useReducer(getcategory, {
    loading: false,
    error: "",
  });

  const [{ loading }, dispatch1] = useReducer(deletecategory, {
    loading: false,
    error: "",
  });

  const deleteCategoryHandler = async (id) => {
    try {
      dispatch1({ type: "DELETE_CATEGORY_REQUEST" });

      const { data } = await axiosInstance.delete(
        `/api/admin/delete-category/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (data) {
        toast.success("Category Deleted.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        dispatch1({ type: "DELETE_CATEGORY_SUCCESS" });
      } else {
        toast.error(data.error.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } catch (err) {
      dispatch1({ type: "DELETE_CATEGORY_FAIL" });
      toast.error(getError(err), {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_CATEGORY_REQUEST" });
      try {
        const res = await axiosInstance.get(`/api/admin/all-categories`, {
          headers: { Authorization: token },
        });

        dispatch({ type: "FETCH_CATEGORY_SUCCESS", payload: res.data });
      } catch (error) {
        dispatch({
          type: "FETCH_CATEGORY_FAIL",
          payload: getError(error),
        });
        toast.error(getError(error), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };
    fetchData();
  }, [categories]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          All Categories
        </Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <Container className="small-container">
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories &&
                  categories.map((category) => (
                    <tr key={category._id}>
                      <td>{category.name}</td>
                      <td>
                        <Button
                          variant="danger"
                          className="btn-sm"
                          onClick={() => {
                            deleteCategoryHandler(category._id);
                          }}
                        >
                          Delete
                        </Button>
                        {loading && <LoadingBox></LoadingBox>}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            <ToastContainer />
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
