export const getArrayAsChunks = <T>(arr: T[], chunkSize: number): Array<T>[] => {
    let result: Array<T>[] = [];
    let data: T[] = arr.slice(0);
    while (data[0]) {
        result.push(data.splice(0, chunkSize));
    }
    return result;
};