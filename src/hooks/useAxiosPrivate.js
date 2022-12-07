import { axiosPrivate } from "../axios";
import { useContext, useEffect } from "react";
import { DataContext } from "../context/DataContext";
import { refreshTokenAPI } from "../api"
import { getRefreshToken } from "../utils/utils";

const useAxiosPrivate = () => {
    const { accessToken, setAccessToken } = useContext(DataContext);

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config =>  (async () => {
                if (!config.headers['Authorization']) {
                    let validAccessToken = accessToken
                    if (!validAccessToken) {
                        const refreshToken = getRefreshToken()      
                        validAccessToken = await refreshTokenAPI(refreshToken);
                      }
                    config.headers['Authorization'] = `Bearer ${validAccessToken}`;
                    console.log("validAccessToken", validAccessToken)
                    setAccessToken(validAccessToken);
                }
                return config;
            })(), (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const refreshToken = localStorage.getItem("refreshToken")
                    const token = await refreshTokenAPI(refreshToken);
                    prevRequest.headers['Authorization'] = `Bearer ${token}`;
                    setAccessToken(token)
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [accessToken])

    return axiosPrivate;
}

export default useAxiosPrivate;