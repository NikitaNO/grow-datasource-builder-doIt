FROM nginx

# Remove the default Nginx configuration file
RUN rm -v /etc/nginx/nginx.conf

# Copy a configuration file from the current directory
ADD nginx.conf /etc/nginx/

# Add SSL certs
RUN mkdir -p /etc/ssl/local.gogrow.com
ADD ./local.gogrow.com.crt /etc/ssl/local.gogrow.com/
ADD ./local.gogrow.com.key /etc/ssl/local.gogrow.com/

# Append "daemon off;" to the configuration file
RUN echo "daemon off;" >> /etc/nginx/nginx.conf

# Expose ports
EXPOSE 80 443

# Set the default command to execute
# when creating a new container
CMD service nginx start
