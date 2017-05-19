const BPromise = require('bluebird');
// cdIsTMaB1M4I1M2mcEfJ1M9lcb.7cCA7v7wg1Mkx1b2mvdxZTMlWjf__
module.exports = [
  {
    /**
     * This will show an html form. Give it
     * the property of view, with the path to the html view
     */
    view: 'auth',

    /**
     * When the form is submitted it will then call this function
     */
    saveDataSourceAuthParamsToReq(req) {

      //Must return a Promise
      return new BPromise((resolve, reject) => {

        //To save this auth data into a new auth object we must create this structure on
        //the req object
        req.dataSourceAuthParams = {
          authInfo: {
            apiKey: req.body.apiKey
          },
          name: req.body.nickname
        };

        // When everything is good resolve the promise
        resolve();
      });
    }
  }
];