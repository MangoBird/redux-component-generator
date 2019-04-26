const apiCallsPath = './src/redux/apis';
const makeCamel = require('./utils');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = function generateApiCalls(domain) {
  console.log(`Generating api calls of ${domain}`)
  const camel = makeCamel(domain);
  const upper = domain.toUpperCase();
  const lower = domain.toLowerCase();

  const content = `
  import axios from 'axios';
  import { API_URL } from '../../common/utils';
  
  export const fetch${camel}s = async () => {
    const { data, status } = await axios
      .get(API_URL + '/${lower}s')
      .then(result => {
        console.log('FETCH /${lower}s', result);
        return result;
      })
      .catch(err => {
        console.log('FETCH /${lower}s', err.response);
        return err.response;
      });
  
    if (status !== 200) {
      throw new Error('FETCH_${upper}_FAILED');
    }
  
    return data.payload;
  };
  
  export interface Post${camel}Payload {
  }
  
  export const post${camel} = async (payload: Post${camel}Payload) => {  
    const { data, status } = await axios
      .post(API_URL + '/${lower}s', payload)
      .then(result => {
        console.log('POST /${lower}s', result);
        return result;
      })
      .catch(err => {
        console.log('POST /${lower}s', err.response);
        return err.response;
      });
  
    if (status !== 200) {
      throw new Error('POST_${upper}_FAILED');
    }
  
    return data;
  };
  
  export interface Put${camel}Payload {
    id: number;
  }
  
  export const put${camel} = async (payload: Put${camel}Payload) => {
    console.log('SENDING PUT ${upper} ', payload);
    const { data, status } = await axios
      .put(API_URL + '/${lower}s', {
        data: payload,
        where: {
          id: payload.id
        }
      })
      .then(result => {
        console.log('PUT /${lower}s', result);
        return result;
      })
      .catch(err => {
        console.log('PUT /${lower}s', err.response);
        return err.response;
      });
  
    if (status !== 200) {
      throw new Error('PUT_${upper}_FAILED');
    }
  
    return data;
  };
  
  export const delete${camel} = async (id: number) => {
    const { status } = await axios
      .delete(API_URL + '/${lower}s', {
        data: { where: { id } }
      })
      .then(result => {
        console.log('DELETE /${lower}s', result);
        return result;
      })
      .catch(err => {
        console.log('DELETE /${lower}s', err.response);
        return err.response;
      });
  
    if (status !== 200) {
      throw new Error('DELETE_${upper}_FAILED');
    }
  };
  
  `;

  mkdirp.sync(`${apiCallsPath}`);
  fs.writeFileSync(`${apiCallsPath}/${lower}Apis.ts`, content);
  fs.appendFileSync(`${apiCallsPath}/index.ts`, `export * from './${lower}Apis'`)

  return;
};
