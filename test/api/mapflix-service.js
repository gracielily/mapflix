import axios from "axios";

import { url } from "../fixtures.js";

export const mapflixService = {
    baseUrl: url,

    async authenticate(user) {
        const response = await axios.post(`${this.baseUrl}/api/users/authenticate`, user);
        axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
        return response.data;
    },

    async clearAuth() {
        axios.defaults.headers.common.Authorization = "";
    },

    async createUser(user) {
        const res = await axios.post(`${this.baseUrl}/api/users`, user);
        return res.data;
    },

    async getUser(id) {
        const res = await axios.get(`${this.baseUrl}/api/users/${id}`);
        return res.data;
    },

    async getAllUsers() {
        const res = await axios.get(`${this.baseUrl}/api/users`);
        return res.data;
    },

    async deleteUser(id) {
        const res = await axios.delete(`${this.baseUrl}/api/users/${id}`);
        return res.data;
    },

    async deleteAllUsers() {
        const res = await axios.delete(`${this.baseUrl}/api/users`);
        return res.data;
    },

    async createShow(show) {
        const res = await axios.post(`${this.baseUrl}/api/shows`, show);
        return res.data;
    },

    async deleteAllShows() {
        const response = await axios.delete(`${this.baseUrl}/api/shows`);
        return response.data;
    },

    async deleteShow(id) {
        const response = await axios.delete(`${this.baseUrl}/api/shows/${id}`);
        return response;
      },
    
    async getAllShows() {
    const res = await axios.get(`${this.baseUrl}/api/shows`);
    return res.data;
    },

    async searchForShow(queryParam, searchTerm) {
        const res = await axios.get(`${this.baseUrl}/api/shows?${queryParam}=${searchTerm}`);
        return res.data;
    },
    
    async getShow(id) {
    const res = await axios.get(`${this.baseUrl}/api/shows/${id}`);
    return res.data;
    },

    async createPoint(id, point) {
        const res = await axios.post(`${this.baseUrl}/api/shows/${id}/points`, point);
        return res.data;
    },

    async deleteAllPoints() {
        const response = await axios.delete(`${this.baseUrl}/api/points`);
        return response.data;
    },

    async deletePoint(id) {
        const response = await axios.delete(`${this.baseUrl}/api/points/${id}`);
        return response;
      },
    
    async getAllPoints() {
    const res = await axios.get(`${this.baseUrl}/api/points`);
    return res.data;
    },
    
    async getPoint(id) {
    const res = await axios.get(`${this.baseUrl}/api/points/${id}`);
    return res.data;
    },
};
