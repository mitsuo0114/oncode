docker rm -f $(docker ps --filter ancestor=oncode_client -a -q)
