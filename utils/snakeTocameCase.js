// Function to convert a string from snake_case or kebab-case to camelCase
module.exports.snakeToCamelCase = (str) => 
    str.replace(/([-_][a-z0-9])/gi, ($1) =>
      $1.toUpperCase().replace('-', '').replace('_', '')
    );
  
  // Function to convert all keys of an object from snake_case to camelCase
  module.exports.convertObjectFromSnakeToCamelCase = (obj) => {
    return Object.keys(obj).reduce((prev, cur) => {
      return { ...prev, [snakeToCamelCase(cur)]: obj[cur] };
    }, {});
  };

  module.exports.convertSnakeToCamel = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
  
    if (Array.isArray(obj)) {
      return obj.map((item) => convertSnakeToCamel(item));
    }
  
    return Object.keys(obj).reduce((newObj, key) => {
      const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      newObj[camelCaseKey] = convertSnakeToCamel(obj[key]);
      return newObj;
    }, {});
  }
  
  
  
