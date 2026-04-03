import apiClient from "./client";

export const adminLogin = (payload) => apiClient.post("/accounts/admin/login/", payload);

export const verifyStudent = (payload) => apiClient.post("/accounts/students/verify/", payload);

export const loginStudent = (payload) => apiClient.post("/accounts/students/login/", payload);

export const listStudents = () => apiClient.get("/accounts/students/");

export const createStudent = (payload) => apiClient.post("/accounts/students/", payload);
