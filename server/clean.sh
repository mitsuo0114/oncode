docker rm -f $(docker ps --filter ancestor=oncode_server -a -q)
