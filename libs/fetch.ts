import axios from "axios";

export const fetch = async (url: string) => {
  try {
    const res = await axios.get(url);
    console.log("res", res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
