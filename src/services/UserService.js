import axios from "axios";

// export async function getAllUsers() {
//   try {
//     const response = await fetch("/api/users");
//     console.log(response + "   Services");
//     return await response.json();
//   } catch (error) {
//     return [];
//   }
// }
export async function createNotes(data) {
  const response = axios({
    method: "post",
    url: "/api/users",
    data,
  });
  console.log(JSON.stringify(data) + "      jay");
  return await response;
}

export async function deleteNoteById(data) {
  console.log("DELETE IS CALLEd" + JSON.stringify(data));

  const response = axios({
    method: "delete",
    url: "/api/users",
    data,
  });
  return response;
}

export async function loginData(data) {
  const response = axios({
    method: "post",
    url: "/login",
    data,
  });
  return await response;
}

export async function registerData(data) {
  const response = axios({
    method: "post",
    url: "/register",
    data,
  });
  return await response;
}

export async function getAllNotes() {
  return await axios.get("http://localhost:9000/api/users");
  // , { crossdomain: true })
  // .then((response) => {
  //   responseData=response
  //   console.log(JSON.stringify(response.data) + "   GET ALL Services");

  // });
  // return JSON.stringify(response.data);
  // console.log(response.data + "       COMING GET QOUTe");
  // setText(response.data);
}

// export async function createUser(data) {
//   console.log(data + "  ASYNc");
//   const response = await fetch(`/api/user`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ notes: data }),
//   });
//   console.log(JSON.stringify({ notes: data }));
//   return await response.json();
// }
