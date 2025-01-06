#!/usr/bin/env bash

if [[ ! -d "results/bun" ]]; then
    mkdir -p results/bun
fi

if [[ ! -d "results/node" ]]; then
    mkdir -p results/node
fi

sudo chown -R $USER:$USER results

docker compose up test_node_load --remove-orphans --abort-on-container-exit
docker compose up test_bun_load --remove-orphans --abort-on-container-exit

docker compose up test_node_stress --remove-orphans --abort-on-container-exit
docker compose up test_bun_stress --remove-orphans --abort-on-container-exit