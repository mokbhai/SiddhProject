#!/bin/bash

# run the proto-gen.sh script
./proto-gen.sh

# run the docker compose file
docker-compose down && docker-compose up --build

# open the client in the browser
open http://localhost:3000/
    