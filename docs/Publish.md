# Publish to Docker Registry

All the components of the Uragsha application need to be converted to Docker images and hosted in Docker registry. Reason is, for the production deployment and management we use Kubernetes.

Docker registry addresses:
- https://hub.docker.com/repository/docker/antonybaasan/uragsha.webapp
- https://hub.docker.com/repository/docker/antonybaasan/uragsha.signalling


## Example of building and pushing docker image of .net projects

```PS
# move to server directory
cd server

# build and create image of a project
docker build -f <Project dir\Dockerfile> --force-rm -t <Image name> .

# create tag with same name as remote repository and include a version
docker tag <Image name>:latest antonybaasan/<ImageName>:<Version>

# push to remote registry
docker push antonybaasan/<ImageName>:<Version>
```

This is an example with Signalling application.
```PS
cd server

docker build -f .\Uragsha.Signalling\Dockerfile --force-rm -t uragsha.signalling .

docker tag uragsha.signalling:latest antonybaasan/uragsha.signalling:v0.1

docker push antonybaasan/uragsha.signalling:v0.1
```

## Build and push docker image of Web app project

```PS
cd webapp

# based on Dockerfile, this will build node project and create docker image
docker build -t uragsha.webapp:latest  .

# create a tag that matches with remote registry
docker tag uragsha.webapp:latest antonybaasan/uragsha.webapp:v0.1

# push to remote registry
docker push antonybaasan/uragsha.webapp:v0.1
```