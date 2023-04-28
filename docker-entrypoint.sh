#!/bin/sh
set -e

#Show Node versions
echo "----- versions"
version=$(node -vdoersion);
echo "NODE          --> $version"

# version=`composer --version | grep -Po '\d.\d.\d '`
# echo "Composer     --> $version"

# cd /data/code || exit 1

# echo "----- install dependencies"
# # remove composer complaint about being run as root, we're inside a docker container it's ok
# export COMPOSER_ALLOW_SUPERUSER=1
# composer install --no-interaction

# echo "----- creating e2e database"
# # replacing the "use hozana" to "use hozana_e2e"
# sed 's/USE `hozana`;/USE `hozana_e2e`;/g' hozana_org.sql > hozana_e2e.sql

# # connecting and creating db structure
# mysql -h db -u root --password="$DB_ENV_MYSQL_ROOT_PASSWORD" -e "drop database if exists hozana_e2e;"
# mysql -h db -u root --password="$DB_ENV_MYSQL_ROOT_PASSWORD" -e "create database if not exists hozana_e2e;"
# mysql -h db -u root --password="$DB_ENV_MYSQL_ROOT_PASSWORD" -e "grant all privileges on hozana_e2e.* to 'hozana'@'%';"
# mysql -h db -u hozana -phozana hozana_e2e < hozana_e2e.sql

# # removing tmp file
# rm ./hozana_e2e.sql

# echo "----- migrate database"
# ./bin/console doctrine:migrations:migrate latest -v --no-interaction
# ./bin/console doctrine:migrations:migrate latest -v --no-interaction --em=crm

# # fix access rights to cache:
# # our composer installs created them with root owner, while apache runs as www
# chmod -Rf 777 /data/code/var

# apache2-foreground
