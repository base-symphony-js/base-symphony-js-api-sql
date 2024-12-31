# Copyright (c) 2024 Luis Solano. All rights reserved.
# Licensed under the MIT License. See the LICENSE file in the root of this repository for more information.
if [ "$1" == "local" ]
then
  echo "Switching to local environment"
  yes | cp -rf "env/local/.env" "./.env"
elif [ "$1" == "dev" ]
then
  echo "Switching to development environment"
  yes | cp -rf "env/dev/.env" "./.env"
elif [ "$1" == "qa" ]
then
  echo "Switching to qa environment"
  yes | cp -rf "env/qa/.env" "./.env"
elif [ "$1" == "prod" ]
then
  echo "Switching to production environment"
  yes | cp -rf "env/prod/.env" "./.env"
else
  echo "Invalid environment."
fi