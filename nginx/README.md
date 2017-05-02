# grow docker nginx container

This docker image uses an nginx image, and sets some basic nginx configurations.

* Forwards all traffic to HTTPS. Using the certs `local.gogrow.com.crt` and `local.gogrow.com.key`.
* Creates a proxy for a node process on port 3000.

## File structure

    nginx             
      ├── Dockerfile  
      ├── local.gogrow.com.crt
      ├── local.gogrow.com.key
      └── nginx.conf