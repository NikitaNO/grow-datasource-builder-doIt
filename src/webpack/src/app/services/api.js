import superagent from 'superagent-bluebird-promise';
export default {
  get(url, data) {
    return makeRequest(
      superagent
        .get(url)
        .send(data)
    );
  },
  post(url, data) {
    return makeRequest(
      superagent
        .post(url)
        .send(data)
    );
  },
  put(url, data) {
    return makeRequest(
      superagent
        .put(url)
        .send(data)
    );
  },
  delete(url, data) {
    return makeRequest(
      superagent
        .delete(url)
        .send(data)
    );
  }
};
function makeRequest(request) {
  return request
    .set('Accept', 'application/json')
    .then(response => response.body);
}