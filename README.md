-----------------------------------------------

FRONTEND

Pasos de desarrollo:

1 - instalar nodejs (npm version 18 o superior)
	Ver: https://nodejs.org/en/download

2 - ejecutar:

	npm install
	
3 - Iniciar:

	nx serve app
	
4 - acceder al nevegador:

	http://localhost:4200
	
5 - modificar diseño:

	Estilos:
	
	\frontend\app\apps\app\src\scss
	
	Íconos:
	
	\frontend\app\apps\app\src\assets
	
	Layout principal:
	
	\frontend\libs\app\base\layout\src\lib\component\containers\default-layout
	
	Página de Login:
	
	\frontend\libs\app\base\feature\src\lib\component\login
	
	
---------------------------------------------

FRONTEND

Pasos para despliegue:

1 - ejecutar:

	nx build app
	
2 - ir a la carpeta:

	\frontend\dist\apps\app

3 - cambiar el nombre de "app" a "ui"

4 - sobreescribir en proyecto backend:

	\backend\public\ui
	
----------------------------------------------

BACKEND

Pasos para Desarrollo:

1 - instalar apache, mariadb y php8
	
	Linux:
	
	https://www.jairogarciarincon.com/clase/curso-instalacion-y-puesta-en-marcha-de-un-entorno-aws/instalacion-de-apache-mysql-y-php
	https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mysql-php-lamp-stack-on-ubuntu-20-04-es
	
	Windows:
	
	https://www.apachefriends.org/download.html

    Dependencias en Apache
	
	Linux: 
	
	apt-get update && apt-get install -y \
	nano \
    libicu-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
	libjpeg62-turbo-dev \
	libmcrypt-dev \
	libgd-dev \
	zlib1g-dev \
	libpq-dev \
	libxml2-dev \
	libzip-dev \
	libonig-dev \
	graphviz \
	build-essential \
	locales \
	zip \
	jpegoptim optipng pngquant gifsicle \
	vim \
	git \
	curl \
	python3-pip
	
	Windows:
	
	extension=gd
	extension=pdo_mysql
	extension=sodium

	Habilitar el modulo rewrite: a2enmod rewrite

	Instalar el cliente para conectarte desde php: apt-get install -y mariadb-client
	
	Crear una base datos con nombre: reforma

	https://desarrolloweb.com/articulos/crear-bbdd-mysql-linea-comandos.html 	

	Importar la base de datos desde el archivo
	
	https://help.clouding.io/hc/es/articles/360011334200-C%C3%B3mo-importar-la-base-de-datos-MySQL-desde-la-l%C3%ADnea-de-comandos

	\backend\database\mysql-dump\0-init-db.sql

2 - instalar composer
	
	Ver:
	
	https://getcomposer.org/download/
	
	curl -sS https://getcomposer.org/installer -o /tmp/composer-setup.php
	
	php /tmp/composer-setup.php --install-dir=/usr/local/bin --filename=composer
	
	Linux:
	https://www.digitalocean.com/community/tutorials/how-to-install-and-use-composer-on-ubuntu-20-04-es
	
	Windows:
	https://www.ionos.es/digitalguide/servidores/configuracion/instalar-php-composer-en-windows-10/

	Ejecutar dentro de la careta \backend:

	composer install --no-ansi --no-dev --no-interaction --no-progress --optimize-autoloader --no-scripts

3 - dentro de la careta \backend sobreescribir el contenido de:

	\vendor_override en \vendor
	
	\storage_override en \storage
	
4 - Configurar un virtual host, apuntando a la carpeta /public del proyecto:

    https://desarrolloweb.com/articulos/configurar-virtual-hosts-apache-windows.html	
	
5 - en el archivo \backend\.env actualizar el valor de las variables siguientes:	
	
	APP_URL=http://127.0.0.1:8000
	APP_INTERNAL_URL=http://127.0.0.1:8000
	L5_SWAGGER_CONST_HOST=http://127.0.0.1:8000
	VOYAGER_API_AUTH_INTERNAL_URL=http://127.0.0.1:8000

	DB_HOST=localhost
	DB_USERNAME=root
	DB_PASSWORD=

6 - dentro de la careta \backend ejecutar:

	php artisan storage:link
	
	php artisan vendor:publish --provider="Joy\\VoyagerApi\\VoyagerApiServiceProvider" --force
	
	php artisan joy-voyager-api:l5-swagger:generate
	
7 - dar permisos de ejecucion a la aplicacion:

	chmod -R 777 \backend
	
	chown -R www-data:www-data \backend
