# Club Manager

## How to deploy web app

*IMP*
Check the content of firebase.json. igore section should contain only firebase.json. Otherwise it is fould the icons are not shwoing in the app
```
{
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json"
    ]
  }
}

```
1. Export web 
```
   npx expo export --platform web --output-dir ./firebase/public
```
2. Got to firebase directoy and run
```
   firebase deploy   
```


## How to deploy to Playstore
1. EAS BUILD to build artifact in expo server
```
eas build --platform android
```
