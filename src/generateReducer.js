const reducerPath = './src/redux/reducers';
const makeCamel = require('./utils');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = function generateReducer(domain) {
  console.log(`Generating reducer of ${domain}`)
  const camel = makeCamel(domain);
  const upper = domain.toUpperCase();
  const lower = domain.toLowerCase();

  const content = `
  import produce from 'immer';
  import _ from 'lodash';
  import { findOneAndUpdateImmutably, upsertImmutably } from '../../common/utils';
  import {
    DELETE_${upper},
    UPDATE_${upper}S,
    UPSERT_${upper}S
  } from '../actions';
  
  export interface ${camel} {
    id: number;
  }
  
  export const initial${camel}s: ${camel}[] = [];
  
  export const find${camel}ById = (${lower}s: ${camel}[], id: number) => {
    return ${lower}s.find(${lower} => ${lower}.id === id);
  };
  
  export const ${lower}sReducer = (${lower}s = initial${camel}s, action: any) => {
    switch (action.type) {
      case INIT_${upper}: {
        return [];
      }
      case BULK_INSERT_${upper}: {
        return [...${lower}s, ...action.${lower}s];
      }
      case UPSERT_${upper}S: {
        const new${camel}s = upsertImmutably(${lower}s, action.query, action.matcher);
        return new${camel}s;
      }
      case UPDATE_${upper}S: {
        const new${camel}s = findOneAndUpdateImmutably(
          ${lower}s,
          action.query,
          action.matcher
        );
        return new${camel}s;
      }
      case DELETE_${upper}: {
        const new${camel}s = produce(${lower}s, draft => {
          const index = draft.findIndex(${lower} => ${lower}.id === action.id);
  
          if (index > -1) {
            draft.splice(index, 1);
          }
        });
  
        return new${camel}s;
      }
      default: {
        return ${lower}s;
      }
    }
  };
  
  `;

  mkdirp.sync(`${reducerPath}`);
  fs.writeFileSync(`${reducerPath}/${lower}Reducer.ts`, content);
  fs.appendFileSync(`${reducerPath}/index.ts`, `
  // takeLatest(POST_${upper}_API as any, post${camel}Saga),
  // takeLatest(FETCH_${upper}S_API as any, fetch${camel}sSaga),
  // takeLatest(PUT_${upper}_API as any, put${camel}Saga),
  // takeLatest(DELETE_${upper}_API as any, delete${camel}Saga),`)

  return;
};
