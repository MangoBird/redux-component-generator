const actionCreatorsPath = './src/redux/actions';
const makeCamel = require('./utils');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = function generateACs(domain) {
  console.log(`Generating action creator of ${domain}`)

  let camel = makeCamel(domain);
  const upper = domain.toUpperCase();
  const lower = domain.toLowerCase();

  // let upper = camel[0].toUpperCase() + camel.slice(1, camel.length);

  const content = `
  import { Post${camel}Payload, Put${camel}Payload, Fetch${camel}Query } from '../apis';
  import { ${camel} } from '../reducers';

  export const INIT_${upper}S = 'INIT_${upper}S';
  export const BULK_INSERT_${upper}S = 'BULK_INSERT_${upper}S';
  export const UPDATE_${upper}S = 'UPDATE_${upper}S';
  export const UPSERT_${upper}S = 'UPSERT_${upper}S';
  export const DELETE_${upper} = 'DELETE_${upper}';

  export const POST_${upper}_API = 'POST_${upper}_API';
  export const FETCH_${upper}S_API = 'FETCH_${upper}S_API';
  export const DELETE_${upper}_API = 'DELETE_${upper}S_API';
  export const PUT_${upper}_API = 'PUT_${upper}_API';

  export const init${camel}s = () => ({
    type: INIT_${upper}S
  });
  
  export const bulkInsert${camel}s = (${lower}s: ${camel}[]) => ({
    type: BULK_INSERT_${upper}S,
    ${lower}s
  });  

  export const update${camel}sAC = (query: any, matcher: any) => ({
    type: UPDATE_${upper}S,
    query,
    matcher
  });

  export const upsert${camel}sAC = (query: any, matcher: any) => ({
    type: UPSERT_${upper}S,
    query,
    matcher
  });

  export const findAndDelete${camel}AC = (id: number) => ({
    type: DELETE_${upper},
    id
  });

  export const post${camel}ApiAC = (payload: Post${camel}Payload) => ({
    type: POST_${upper}_API,
    payload
  });

  export const fetch${camel}sApiAC = (query?: Fetch${camel}Query) => ({
    type: FETCH_${upper}S_API,
    querys
  });

  export const delete${camel}ApiAC = (id: number) => ({
    type: DELETE_${upper}_API,
    id
  });

  export const put${camel}ApiAC = (payload: Put${camel}Payload) => ({
    type: PUT_${upper}_API,
    payload
  });


  //  interface Props {
  //    dPost${camel}Api: (payload: Post${camel}Payload) => any;
  //    dFetch${camel}sApi: (query?: string) => any;
  //    dPut${camel}Api: (payload: Put${camel}Payload) => any;
  //    dDelete${camel}Api: (id: number) => any;
  //    dInit${camel}s: () => any;
  //  }
  //
  //  const mapDispatchToProps = (dispatch: any) => ({
  //    dPost${camel}Api: (payload: Post${camel}Payload) => dispatch(post${camel}ApiAC(payload)),
  //    dFetch${camel}sApi: (query?: Fetch${camel}Query) => dispatch(fetch${camel}sApiAC(query))
  //    dPut${camel}Api: (payload: Put${camel}Payload) =>
  //      dispatch(put${camel}ApiAC(payload))
  //    dDelete${camel}Api: (id: number) => dispatch(delete${camel}sApiAC(id)),
  //  ({
  `;

  mkdirp.sync(`${actionCreatorsPath}`);
  fs.writeFileSync(`${actionCreatorsPath}/${lower}Actions.ts`, content);
  fs.appendFileSync(`${actionCreatorsPath}/index.ts`, `
export * from './${lower}Actions';`)

  return;
};
