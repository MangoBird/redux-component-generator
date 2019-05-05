const sagasPath = './src/redux/sagas';
const makeCamel = require('./utils');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = function generateSagas(domain) {
  console.log(`Generating common utils of ${domain}`)
  const camel = makeCamel(domain);
  const upper = domain.toUpperCase();
  const lower = domain.toLowerCase();

  const content = `
  export const parseFetchQuery = (query: FetchQuery) => {
    if (!query) return '';
    
    const queries = [];
  
    const { where, limit, offset } = query;
  
    Object.keys(where).forEach(key => {
      queries.push(\`where[${key}]=${where[key]}\`);
    });
    limit && queries.push(\`limit=${limit}\`);
    offset && queries.push(\`offset=${offset}\`);
  
    return queries.join('&');
  };
`;

//   mkdirp.sync(`${sagasPath}`);
//   fs.writeFileSync(`${sagasPath}/${lower}sSagas.ts`, content);
//   fs.appendFileSync(`${reducerPath}/rootSaga.ts`, `
// export * from './${lower}Reducer';`)
//   return;
};


