[Facebook API Module](https://www.npmjs.com/package/fb)  
[Facebook Insights API Documentation](https://developers.facebook.com/docs/graph-api/reference/v2.2/insights)  
[Facebook Graph Explorer Helping Tool](https://developers.facebook.com/tools/explorer/145634995501895/)
[https://developers.facebook.com/docs/marketing-api/access](https://developers.facebook.com/docs/marketing-api/access)

I expect an object in this form
```javascript
{  
    pageId: Number   
    name: String  
    period: String  
    since: unix timestamp optional  
    until: unix timestamp optional  
    returnLastValue: Boolean  
}
```

These are options that are given to the user for their particular report being run
```javascript
[
{
    name: 'page_fans_gender_age',   
    period:['lifetime'],
    description:'Aggregated demographic data about the people who like your Page based on the age and gender information they provide in their user profiles.'
},
{
    name: 'page_fan_adds',
    period:['day'],
    description:'The number of new people who have liked your Page.'
},
{
    name: 'post_video_views_organic_unique',
    period: ['lifetime'],
    description: 'The number of people who viewed at least 3 seconds of your video organically.'
},
{
    name: 'page_fan_removes',
    period: ['day'],
    description:'Unlikes of your Page'
},
{
    name: 'page_stories',
    period: ['day', 'week', 'days_28'],
    description: 'The number of stories created about your Page (Stories)'
},
{
    name: 'page_storytellers_by_city',
    period: ['day','week','days_28'],
    description: 'The number of People Talking About the Page by user city'
},
{
    name: 'page_storytellers_by_country',
    period: ['day', 'week', 'days_28'],
    description: 'The number of People Talking About the Page by user country'
},
{
    name: 'page_impressions_organic',
    period: ['day','week','days_28'],
    description: 'The number of times your posts were seen in News Feed or Ticker or on visits to your Page. These impressions can be Fans or non-Fans'
},
{
    name: 'page_engaged_users',
    period: ['day', 'week', 'days_28'],
    description: 'The number of people who engaged with your Page. Engagement includes any click'
},
{
    name: 'page_negative_feedback',
    period: ['day', 'week', 'days_28'],
    description: 'The number of times people took a negative action (e.g., un-liked or hid a post)'
},
{
    name: 'page_fans_city',
    period: ['lifetime'],
    description: 'Aggregated Facebook location data, sorted by city, about the people who like your Page.'
},
{
    name: 'page_fans_county',
    period: ['lifetime'],
    description: 'Aggregated Facebook location data, sorted by country, about the people who like your Page'
},
{
    name: 'page_fans',
    period: ['lifetime'],
    description: 'The total number of people who have liked your Page.'
},

{
    name: 'page_views_external_referrals',
    period: ['day'],
    description: 'Top referring external domains sending traffic to your Page.'
},
{
    name: 'page_views',
    period: ['day', 'week'],
    description: 'Page Views'
},
{
    name: 'page_views_login',
    period: ['day'],
    description: 'Page Views from users logged into Facebook'
},
{
    name: 'page_posts_impressions_unique',
    period: ['day', 'week', 'days_28'],
    description: 'The number of people who saw any of your Page posts'
}
]
```

###replaceCertainReportParams
   authId and pageId need replacing. We expect the object to be in the same format of reportParam objects.
   At least this.
   ```{
   authId: SomeString,
   report:{
       params:{
         pageId:SomeString 
       }
     }
   }```
   