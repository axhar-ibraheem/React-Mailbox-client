import { setMailsLoading } from "../store/mailSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useCallback } from "react";

const useAxiosFetch = () => {
  const dispatch = useDispatch();

  const fetchData = useCallback(
    async (urls, method, data = null, onSuccess = null) => {
      if (Array.isArray(urls)) {
        dispatch(setMailsLoading(true));
      }

      try {
        let responses;

        if (Array.isArray(urls)) {
          const requests = urls.map((url) =>
            axios({
              method: method,
              url: url,
              data: data ? data : null,
            })
          );

          responses = await Promise.all(requests);
        } else if (typeof urls === "string") {
          const response = await axios({
            method: method,
            url: urls,
            data: data,
          });

          responses = response;
        }

        if (onSuccess) {
          onSuccess(responses);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        if (Array.isArray(urls)) {
          dispatch(setMailsLoading(false));
        }
      }
    },
    [dispatch]
  );

  return { fetchData };
};

export default useAxiosFetch;
