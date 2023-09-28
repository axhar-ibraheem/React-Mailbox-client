import { useEffect } from "react";
import { setChecked,  } from "../store/mailSlice";
import { showNotification } from "../store/authSlice";
const useUnselect = (dispatch) => {
    useEffect(() => {
        return () => {
          dispatch(setChecked({ id: null, selector: "none" }));
          dispatch(showNotification({ message: null, variant: null }));
        };
      }, [dispatch]);
}
export default useUnselect;