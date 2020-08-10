import { toast } from "react-toastify";

export function successToast(message: string, durationTime: number) {
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
  
export function errorToast(message: string, durationTime: number) {
    toast.error(message, {
        position: "bottom-center",
        autoClose: durationTime,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}