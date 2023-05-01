import CryptoJS from "crypto-js";

const key = CryptoJS.enc.Base64.parse("#base64Key#");
const iv  = CryptoJS.enc.Base64.parse("#base64IV#");

export const encryptData = (data) => {
    const encryptedData = CryptoJS.AES.encrypt(data, key, {iv: iv})
    return encryptedData;
}

export const decryptData = (data) => {
    const decryptedData = CryptoJS.AES.decrypt(data, key, {iv: iv})
    return decryptedData.toString(CryptoJS.enc.Utf8);
}