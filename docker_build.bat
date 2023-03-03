docker build ^
-t tda-devbase-docker ^
--build-arg "DATABASE_URL=mysql://plx7tr1956m6zgbpsz5p:pscale_pw_4tGSrZH2IWWqpfRVP5ArL1dFIPgAzVA80LNXZ8UACjQ@eu-central.connect.psdb.cloud/upshop-prod?sslaccept=strict" ^
--build-arg "NEXTAUTH_SECRET=vHvusNYOxpuLYuOFhhYzBTbgwP+KXC59Al4KgeMCOrc=" ^
.
