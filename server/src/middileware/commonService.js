import pkg from "jsonwebtoken";

const { sign, verify } = pkg;

export const getJWT = (user, key) => {
    return "Bearer " + sign(user, key, { expiresIn: '86400000' });
};
export const getJWTVerify = (token) => {
    return verify(token, "zit");
};