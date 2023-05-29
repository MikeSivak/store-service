export const getArrayAsChunks = (arr: any[], chunkSize: number): any => {
    let result: any = [];
    let data: any = arr.slice(0);
    while (data[0]) {
        result.push(data.splice(0, chunkSize));
    }
    return result;
};