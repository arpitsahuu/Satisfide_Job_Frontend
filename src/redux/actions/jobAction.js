import axios from 'axios';
import { setJobs, setLoading, setError, setJob } from '../sclices/jobSclice';
const basePath = `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/employer`

const config = () => {
    return {
        headers: {
            'authorization': localStorage.getItem('token') || '' // Ensure token is always a string
        },
        withCredentials: true
    };
};

export const createJobs = (userData) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const { data } = await axios.post(`${basePath}/job/create`, { ...userData }, config());
        console.log(data, "data");
        dispatch(setLoading(false));
        dispatch(setJobs(data.student))
    } catch (error) {
        dispatch(setLoading(false));
        console.log(error, "error");
        dispatch(setError(error?.response?.data?.message || "createJob failed"));
    }
}

export const allJobs = (filters = {}) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      console.log("Filter parameters:", filters);
  
      // Pass the filter parameters in the request payload
      const { data } = await axios.post(`${basePath}/job/readall`, filters, config());
  
      console.log(data, "data");
      dispatch(setLoading(false));
      dispatch(setJobs(data.jobs));
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error, "error");
      dispatch(setError(error?.response?.data?.message || "allJobs failed"));
    }
  };

export const getJobById = (id, body = {}) => async (dispatch) => {
    console.log(id);
    try {
        dispatch(setLoading(true));
        const { data } = await axios.post(`${basePath}/job/readsingle/${id}`, body, config());
        console.log(data, "data");
        dispatch(setLoading(false));
        dispatch(setJob(data.job))
    } catch (error) {
        dispatch(setLoading(false));
        console.log(error, "error");
        dispatch(setError(error?.response?.data?.message || "createJob failed"));
    }
}

