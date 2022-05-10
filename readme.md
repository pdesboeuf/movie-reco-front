# installation 



# LANCEMENT DU SERVEUR
nodemon server.js

# via Docker
Start
docker-compose -f docker/docker-compose.yml up --build
Stop
docker-compose -f docker/docker-compose.yml down

# GCLOUD
gcloud builds submit --tag gcr.io/movie-reco-349807/movie-reco-front --file
gcloud run deploy --image gcr.io/movie-reco-349807/movie-reco-front

https://movie-reco-front-ipocppcxga-ew.a.run.app/search
https://movie-reco-back-ipocppcxga-ew.a.run.app/list