import axios from 'axios';
import { setAllJobs, setApplication, setError, setLoading, setPage, setStudent } from '../sclices/studentSclice';
const basePath = `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/user`

const config = () => {

    return {
        headers: {
            'authorization': localStorage.getItem('token') || '' // Ensure token is always a string
        },
        withCredentials: true
    };
};

/* auth */
export const loginStudent = (userData) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const { data } = await axios.post(`${basePath}/student/signin`, { ...userData });
        localStorage.setItem("token", data.token);
        dispatch(setStudent(data.student));
    } catch (error) {
        console.error("Login Error:", error);
        dispatch(setError(error?.response?.data?.message || "Login failed"));
    } finally {
        dispatch(setLoading(false));
    }
};

export const registerStudent = (userData) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const { data } = await axios.post(`${basePath}/student/signup`, { ...userData });
        dispatch(setLoading(false));
        localStorage.setItem("token", data.token);
        dispatch(setStudent(data.student))
    } catch (error) {
        dispatch(setLoading(false));
        dispatch(setError(error?.response?.data?.message || "registerStudent failed"));
    }
}

export const currentStudent = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));

        const token = localStorage.getItem('token');

        if (!token) {
            console.log("token not found");
            return;
        }

        const { data } = await axios.post(`${basePath}/student`, null, config());
        dispatch(setStudent(data.student));
    } catch (error) {
        console.error("cors===", error);
        dispatch(setError(error?.response?.data?.message || "Failed to get current user"));
    } finally {
        dispatch(setLoading(false));
    }
};

export const logoutStudent = (userData) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const data = await axios.get(`${basePath}/student/signout`, config());
        dispatch(setLoading(false));
        dispatch(setStudent(null))
        localStorage.removeItem("token")

    } catch (error) {
        dispatch(setLoading(false));
        console.log(error, "error");
        dispatch(setError(error?.response?.data?.message || "registerStudent failed"));
    }
}

/* profile */
export const updateStudent = (userData) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const { data } = await axios.post(`${basePath}/student/update`, userData, config());
        console.log(data, "updated");
        dispatch(currentStudent());
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setLoading(false));

        console.log(error, "error");
        dispatch(setError(error?.response?.data?.message || "get current user failed"));
    }
}

export const uploadResuma = (fileData) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        console.log(fileData)
        const formData = new FormData();
        formData.append('resume', fileData);
        const { data } = await axios.post(`${basePath}/student/resumaPdf`, formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
                'authorization': `${localStorage.getItem('token')}`
            },
        });
        dispatch(currentStudent());

        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setLoading(false));
        console.log(error, "error");
        dispatch(setError(error?.response?.data?.message || "get current user failed"));
    }
}

export const sendMail = (email) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const { data } = await axios.post(`${basePath}/student/send-mail`, email, config());
        console.log(data, "send mail");
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setLoading(false));
        console.log(error, "error");
        dispatch(setError(error?.response?.data?.message || "get current user failed"));
    }
}

export const resetPassword = (password, id) => async (dispatch) => {
    if (!id) return;
    try {
        dispatch(setLoading(true));
        const { data } = await axios.post(`${basePath}/student/forget-link/${id}`, { password }, config());
        console.log(data, "password changed");
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setLoading(false));
        console.log(error, "error");
        dispatch(setError(error?.response?.data?.message || "get current user failed"));
    }
}


/* jobs */
export const AllJobs = (obj = {}) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const { data } = await axios.post(`${basePath}/student/AllJobs`, obj, config());
        console.log(data.jobs, "====");
        dispatch(setAllJobs(data.jobs))
        dispatch(setPage({
            totalPages: data.totalPages,
            currentPage: data.currentPage
        })
        )

        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setLoading(false));
        console.log(error, "error");
        dispatch(setError(error?.response?.data?.message || "get current user failed"));
    }
}

export const applicationSend = (dets) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const { data } = await axios.post(`${basePath}/student/apply`, dets, config());
        console.log(data, "applicationSend");
        dispatch(AllJobs())
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setLoading(false));
        console.log(error, "error allApplications");
        dispatch(setError(error?.response?.data?.message || "send Application failed"));
    }
}

export const getApplication = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const { data } = await axios.get(`${basePath}/student/applications`, config());
        console.log(data, "get applications");
        dispatch(setApplication(data.applications));
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setLoading(false));
        console.log(error, "error");
        dispatch(setError(error?.response?.data?.message || "get Application failed"));
    }
}







/* left */
export const avatarStudent = (fileData) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const formData = new FormData();
        formData.append('avatar', fileData);
        const res = await axios.post(`${basePath}/student/avatar`, formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
                'authorization': `${localStorage.getItem('token')}`
            },
        });
        dispatch(setLoading(false));
        dispatch(currentStudent());

    } catch (error) {
        dispatch(setLoading(false));
        dispatch(setError(error?.response?.data?.message || "get current user failed"));
    }
}
