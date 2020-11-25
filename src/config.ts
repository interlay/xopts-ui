const useMockLib = (process.env.REACT_APP_USE_MOCK_LIB || "0").toLowerCase();
export const USE_MOCK_LIB = ["1", "yes", "true"].includes(useMockLib);
