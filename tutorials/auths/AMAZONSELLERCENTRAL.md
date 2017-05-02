# Amazon Seller Central Auth Example

This example has only one auth strategy. It will show a form to collect information and then store the credentials on the callback.

```
authStrategies: [
  {
    view: 'auth/amazon-seller-central.html',
    defaultAuthParams: {
      accessKeyId: '',
      secretAccessKey: '',
      merchantId: '',
      marketplaceId: '',
      url: '',
      name: ''
    },
    saveDataSourceAuthParamsToReq(req) {
      return new BPromise((resolve, reject) => {
        req.dataSourceAuthParams = {
          authInfo: {
            accessKeyId: req.body.accessKeyId,
            secretAccessKey: req.body.secretAccessKey,
            merchantId: req.body.merchantId,
            marketplaceId: req.body.marketplaceId,
            url: req.body.url
          },
          name: req.body.name
        };
        resolve();
      });
    }
  }
]
```

It does this by using the view parameter. It will render the `auth/amazon-seller-central.html` file with default parameters.

```
{
    view: 'auth/amazon-seller-central.html',
    defaultAuthParams: {
      accessKeyId: '',
      secretAccessKey: '',
      merchantId: '',
      marketplaceId: '',
      url: '',
      name: ''
    }
}
```

```
<form id="AuthForm" method="post" action="/api/data-source/auth/AmazonSellerCentral/callback">
  <input type="hidden" name="_csrf" value="<%= csrfToken %>">
  <input type="text" name="name" placeholder="Connection Name" value="<%= name %>" /><br/>
  <select name="url" class="form-control">
      <option value="">Select Seller Location</option>
      <option value="mws.amazonservices.com">USA</option>
      <option value="mws.amazonservices.ca">Canada</option>
      <option value="mws.amazonservices.co.uk">UK</option>
      <option value="mws.amazonservices.jp">Japan</option>
  </select><br/>
  <input type="text" name="accessKeyId" placeholder="Access Key ID" value="<%= accessKeyId %>" /><br/>
  <input type="text" name="secretAccessKey" placeholder="Secret Access Key" value="<%= secretAccessKey %>" /><br/>
  <input type="text" name="merchantId" placeholder="Merchant ID" value="<%= merchantId %>" /><br/>
  <input type="text" name="marketplaceId" placeholder="Marketplace ID" value="<%= marketplaceId %>" /><br/>
  <div class="connection-helper">
    <span>Need help connecting to Amazon Seller Central?</span>
    <p><a href="http://help.grow.com/connecting-your-data/amazon/how-to-generate-your-api-key-for-amazon-seller-central" target="_blank">Click here for the guide.</a></p>
  </div>
  <input type="submit" value="Submit" class="btn btn-primary submit-button-spacing">
</form>
```

Then in the callback it will capture those credentials.

```
{
  saveDataSourceAuthParamsToReq(req) {
    return new BPromise((resolve, reject) => {
      req.dataSourceAuthParams = {
        authInfo: {
          accessKeyId: req.body.accessKeyId,
          secretAccessKey: req.body.secretAccessKey,
          merchantId: req.body.merchantId,
          marketplaceId: req.body.marketplaceId,
          url: req.body.url
        },
        name: req.body.name
      };
      resolve();
    });
  }
}
```