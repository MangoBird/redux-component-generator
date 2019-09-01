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
  import _ from 'lodash';
  import { put } from 'redux-saga/effects';
  import { findAndDelete${camel}AC, upsert${camel}sAC, init${camel}s, bulkInsert${camel}s } from '../actions';
  import {
    delete${camel},
    fetch${camel}s,
    post${camel},
    put${camel},
    Post${camel}Payload,
    Put${camel}Payload,
    Fetch${camel}Query
  } from '../apis';
  import { ${camel} } from '../reducers';

  export function* post${camel}Saga({
    payload,
    query
  }: {
    payload: Post${camel}Payload;
    query?: Fetch${camel}Query;
  }) {
    try {
      const { id } = yield post${camel}(payload);
      yield put(
        upsert${camel}sAC({ id }, { id })
      );
      yield fetch${camel}sSaga({ query });
    } catch (err) {
      console.error('post ${lower} error occurred', err);
    }
  }
  
  export function* fetch${camel}sSaga(action?: { query?: Fetch${camel}Query) {
    const query = _.get(action, 'query');

    try {
      const { payload: ${lower}sRes, totalCount } = yield fetch${camel}s(query);

      const new${camel}s = ${lower}sRes.map(
        (${lower}: any): ${camel} => ({})
      );
  
      yield put(init${camel}s());
      yield put(bulkInsert${camel}s(new${camel}s));
    } catch (err) {
      console.error('fetch ${lower} error occurred', err);
    }
  }
  
  export function* put${camel}Saga({
    payload,
    query
  }: {
    payload: Put${camel}Payload;
    query: Fetch${camel}Query;
  }) {
    try {
      yield put${camel}(payload);
      yield put(init${camel}s());
      yield fetch${camel}sSaga({ query });
    } catch (err) {
      console.error('put ${lower} error occurred', err);
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
  fs.appendFileSync(`${sagasPath}/rootSaga.ts`, `
  // takeLatest(POST_${upper}_API as any, post${camel}Saga),
  // takeLatest(FETCH_${upper}S_API as any, fetch${camel}sSaga),
  // takeLatest(PUT_${upper}_API as any, put${camel}Saga),
  // takeLatest(DELETE_${upper}_API as any, delete${camel}Saga),`)

  return;
};


