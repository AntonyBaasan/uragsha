### Example of build and push docker image of .net projects

```PS
# move to server directory
cd server

# build and create image of the signalling project
docker build -f .\Uragsha.Signalling\Dockerfile --force-rm -t uragsha.signalling .

# create tag with same name as remote repository and includes version
docker tag uragsha.signalling:latest antonybaasan/uragsha.signalling:v0.1

# create tag with same name as remote repository and includes version
docker push antonybaasan/uragsha.signalling:v0.1
```

### Build and push docker image of Web app project

```PS
cd webapp

# based on Dockerfile, this will build node project and create docker image
docker build -t uragsha.webapp:latest  .

docker tag uragsha.webapp:latest antonybaasan/uragsha.webapp:v0.1

docker push antonybaasan/uragsha.webapp:v0.1
```