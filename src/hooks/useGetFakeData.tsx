import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const apiRequest = async () => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/posts"
  );
  //  returning fake chart data

  return {
    data: {
      pear: 10,
      // apple: 20,
      strawberry: 50,
      cherry: 35,
      plum: 15,
      blueberry: 10,
    },
  };
};

const useGetFakeData = () => {
  return useQuery(["getFakeData"], apiRequest, {
    refetchOnWindowFocus: false,
    keepPreviousData: false,
    staleTime: 5000,
  });
};

export default useGetFakeData;
