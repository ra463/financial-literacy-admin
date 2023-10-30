const addImagesReducer = (state, action) => {
  switch (action.type) {
    case "ADD_REQUEST":
      return { ...state, loading: true };
    case "ADD_SUCCESS":
      return { ...state, loading: false, success: true };
    case "ADD_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const getImagesReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "DELETE_REQUEST":
      return { ...state, deleteLoading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        images: action.payload.images,
        imageCount: action.payload.imageCount,
        filteredImagesCount: action.payload.filteredImagesCount,
      };
    case "DELETE_SUCCESS":
      return { ...state, deleteLoading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_FAIL":
      return { ...state, deleteLoading: false, deleteError: action.payload };
    default:
      return state;
  }
};

export { addImagesReducer, getImagesReducer };
