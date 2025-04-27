import { defineQuery } from "next-sanity";

export const USER_BY_GMAIL_QUERY =
    defineQuery(`*[_type == 'user' && email == $email][0] {
        _id,
        id,
        name,
        username,
        email,
        password,
        profile
        }`);