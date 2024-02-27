#!/bin/bash

# /usr/sbin/sshd
mongod -replSet "rs0" &
npm run api &
npm run frontend &

until mongosh; do
    sleep 1
done

mongosh --eval "rs.initiate()"

wait
echo Done
