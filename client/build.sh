docker build . -t oncode_client
docker run -d -p 8080:3000 oncode_client