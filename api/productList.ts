import apiManager from "./api";

export const productList = async (data: any) => {
  try {
    const res = apiManager("/products", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
      data: data,
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
