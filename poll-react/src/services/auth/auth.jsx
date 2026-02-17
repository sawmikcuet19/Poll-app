import axiosInstance from '../../environment/axiosInstance';
export const signup = async (singnupDTO) => {
    try {
        const response = await axiosInstance.post('/api/auth/signup', singnupDTO);
        return response;
    } catch (error) {
        throw error;
    }
};

export const login = async (loginDTO) => {
    try {
        const response = await axiosInstance.post('/api/auth/login', loginDTO);
        return response;
    } catch (error) {
        throw error;
    }
};