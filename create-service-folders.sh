#!/bin/bash

# 0. validate that we have atleast one argument
if [ "$#" -ne 1 ]; then
    echo "Illegal number of parameters"
    exit 1
fi

# 1. get service name from argument
service_name=$1;
mkdir $service_name
cd ./$service_name

# 2. create file structure:
mkdir functions mocks models schema services utils