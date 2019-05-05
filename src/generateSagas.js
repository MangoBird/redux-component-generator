const sagasPath = './src/redux/sagas';
const makeCamel = require('./utils');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = function generateSagas(domain) {
  console.log(`Generating sagas of ${domain}`)
  const camel = makeCamel(domain);
  const upper = domain.toUpperCase();
  const lower = domain.toLowerCase();

  const content = `
  import { put } from 'redux-saga/effects';
  import { findAndDelete${camel}AC, upsert${camel}sAC } from '../actions';
  import {
    delete${camel},
    fetch${camel}s,
    post${camel},
    put${camel},
    Post${camel}Payload,
    Put${camel}Payload
  } from '../apis';
  
  export function* post${camel}Saga({ payload }: { payload: Post${camel}Payload }) {
    try {
      const { id } = yield post${camel}(payload);
      yield put(
        upsert${camel}sAC({ id }, { id })
      );
      yield fetch${camel}sSaga();
    } catch (err) {
      console.error('post ${lower} error occurred', err);
    }
  }
  
  export function* fetch${camel}sSaga() {
    try {
      const ${lower}sRes = yield fetch${camel}s();
      for (const { id } of ${lower}sRes) {
        yield put(
          upsert${camel}sAC(
            {
              id
            },
            { id }
          )
        );
      }
    } catch (err) {
      console.error('fetch ${lower} error occurred', err);
    }
  }
  
  export function* put${camel}Saga({ payload }: { payload: Put${camel}Payload }) {
    try {
      yield put${camel}(payload);
      yield fetch${camel}sSaga();
    } catch (err) {
      console.error('post ${lower} error occurred', err);
    }
  }
  
  export function* delete${camel}Saga({ id }: { id: number }) {
    try {
      yield delete${camel}(id);
      yield put(findAndDelete${camel}AC(id));
    } catch (err) {
      console.error('delete ${lower} error occurred', err);
    }
  }  
  `;

  mkdirp.sync(`${sagasPath}`);
  fs.writeFileSync(`${sagasPath}/${lower}sSagas.ts`, content);

  return;
};


