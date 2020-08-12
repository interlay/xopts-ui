import { toast } from "react-toastify";

export function successToast(message: string, durationTime: number = 5000) {
    toast.success(message, {
        position: "top-center",
        autoClose: durationTime,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}
  
export function errorToast(message: string, durationTime: number = 5000) {
    toast.error(message, {
        position: "top-center",
        autoClose: durationTime,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}