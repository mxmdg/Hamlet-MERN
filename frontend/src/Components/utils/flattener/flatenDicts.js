function flattenObject(obj, prefix = '') {
    return Object.keys(obj).reduce((acc, key) => {
        const pre = prefix.length ? prefix + '_' : '';
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            Object.assign(acc, flattenObject(obj[key], pre + key));
        } else {
            acc[pre + key] = obj[key];
        }
        return acc;
    }, {});
}

function flattenArrayOfObjects(arr) {
    return arr.map(obj => flattenObject(obj));
}

// Ejemplo de uso
// const dataFromDatabase = [
//     { id: 1, name: 'John', address: { city: 'New York', zipcode: '10001' } },
//     { id: 2, name: 'Jane', address: { city: 'Los Angeles', zipcode: '90001' } }
// ];

// const flattenedData = flattenArrayOfObjects(dataFromDatabase);
// console.log(flattenedData);

module.exports = { flattenObject, flattenArrayOfObjects }