FROM mongo:latest AS mongo
RUN apt-get update && \
    apt install curl && \
    curl -fsSL https://deb.nodesource.com/setup_21.x | bash - && \
    apt-get install -y nodejs && \
    apt-get install -y openssh-server && \
    apt-get install -y less && \
    apt-get install -y vim
# RUN mkdir /var/run/sshd
# RUN echo 'root:pass' | chpasswd
# RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
# RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd
# EXPOSE 22
EXPOSE 3000
EXPOSE 3001
WORKDIR /usr/src/app
COPY package*.json .
RUN npm config rm proxy
RUN npm config rm https-proxy
RUN npm install
COPY . .
RUN chmod u+x start.sh
ENV WORK_DIR=/usr/src/app
CMD ./start.sh