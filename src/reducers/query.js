const getQueryReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "DELETE_REQUEST":
      return { ...state, deleteLoading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        queries: action.payload.queries,
        queriesCount: action.payload.queriesCount,
        filteredQueriesCount: action.payload.filteredQueriesCount,
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

const viewQueryReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        query: action.payload.query,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export { getQueryReducer, viewQueryReducer };
