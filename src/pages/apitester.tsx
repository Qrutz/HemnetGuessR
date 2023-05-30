import axios from "axios";
import React from "react";
import { useQuery, useQueryClient } from "react-query";

export default function apitester() {
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery("", fetchApiData);

  if (isLoading) return "Loading...";
  if (error) return "An error has occurred: " + error;

  console.log(data);

  async function fetchApiData() {
    const { data } = await axios.get(
      "http://localhost:5000/api/getRandomListing"
    );
    return data;
  }

  return (
    <div>
      <h1>API Tester</h1>
      <div className="">
        {data.images.map((image: any) => (
          <img src={image} />
        ))}
      </div>
    </div>
  );
}
