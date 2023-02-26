import axios from "axios";

import { url } from "../fixtures.js";

export const mapflixService = {
  baseUrl: url,

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

  async deleteAllUsers() {
    const res = await axios.delete(`${this.baseUrl}/api/users`);
    return res.data;
  },
};
