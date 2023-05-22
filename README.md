# Mapflix

A Movie Locations Management Platform and API built
using the Hapi and Handlebars Frameworks.

![Capture](https://user-images.githubusercontent.com/97189399/225677795-f2c30a65-3a79-4202-8f95-49b445170650.JPG)

[Mapflix Demo Site](https://mapflix-prod.onrender.com/)\
[Mapflix API Docs](https://mapflix-prod.onrender.com/documentation) 

Note: In order to interact with the API you must provide a authorization token. This 
token can be retrieved by calling the `/authenticate` endpoint with valid credentials. See 
docs on this [here](https://mapflix-prod.onrender.com/documentation#/api/postApiUsersAuthenticate).

## How to Launch the Application Locally:

1. Clone into the repo or download the mapflix folder and cd into it.
2. Ensure you have node and npm installed locally
3. Populate your env file with the following variables and assign them values:
```
db
COOKIE_NAME
COOKIE_PASSWORD
CLOUDINARY_NAME
CLOUDINARY_API_KEY
CLOUDINARY_SECRET
TMDB_API_KEY
OPEN_WEATHER_MAP_API_KEY
SERVICE_URL
ENCRYPTION_KEY
IV
NODE_ENV
```

For oAuth authentication the following variables must be included:
```
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
GITHUB_ENCRYPTION
```

For running E2E tests the `NODE_ENV` variable must be set to "dev".


4. Run the following commands in the shell:

```
> npm install
> npm run start
````

5. Visit the site at the port specified in the shell output to interact with the web app. To 
interact with the API locally you can do so at the `/documentation` endpoint.


## Available Scripts:

- `npm run start` - starts the application
- `npm run lint` - runs lint checks
- `npm run test` - runs Application tests
- `npm run testapi` - runs API tests


## Technologies Used

Below are some examples of the technologies used in this project: 

- NodeJS
- hapi
- MongoDB, Mongoose & Cloud Atlas
- Handlebars
- Joi
- Swagger
- JWT
- Axios
- Mocha & Chai
- Cloudinary
- Leaflet.js
- Open Weather Map API
- The Movie Database API
- Render
- Glitch
- AWS
- bcrypt
- star-rating-svg
- SocialShareJS
- Github oAuth
- Cypress