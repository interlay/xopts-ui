
export async function getOptions<T>():Promise<T>{
    const response = await fetch("http://localhost:3000/options");
    const options = await response.json();
    return options;
}
