#!/bin/bash
docker-compose down
cd server
docker build -t server .
cd ..
docker-compose up -d