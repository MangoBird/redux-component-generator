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
    BULK_INSERT_${upper}S,
    BULK_UPSERT_${upper}S,
    DELETE_${upper},
    INIT_${upper}S,
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
      case INIT_${upper}S: {
        return [];
      }
      case BULK_INSERT_${upper}S: {
        return [...${lower}s, ...action.${lower}s];
      }
      case BULK_UPSERT_${upper}S: {
        let new${camel}s = ${lower}s;
  
        action.${lower}s.forEach((partial${camel}: Partial<${camel}>) => {
          new${camel}s = upsertImmutably(new${camel}s, partial${camel}, {
            id: partial${camel}.id
          });
        });
  
        return new${camel}s;
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
export * from './${lower}Reducer';`)
  return;
};
