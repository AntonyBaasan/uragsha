### Build and push docker images

```
cd server

docker build -f .\Uragsha.Signalling\Dockerfile --force-rm -t uragsha.signalling .

# create tag with same name as remote repository and includes version
docker tag uragsha.signalling:latest antonybaasan/uragsha.signalling:v0.1

# create tag with same name as remote repository and includes version
docker push antonybaasan/uragsha.signalling:v0.1
```
