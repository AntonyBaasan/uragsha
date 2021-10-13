VERSION=${1:-latest}

echo $VERSION

# publish .net server applications
cd server
docker build -f ./Uragsha.Signalling/Dockerfile --force-rm -t antonybaasan/uragsha.signalling:$VERSION .
docker push antonybaasan/uragsha.signalling:$VERSION

docker build -f ./Uragsha.WebApi/Dockerfile --force-rm -t antonybaasan/uragsha.webapi:$VERSION .
docker push antonybaasan/uragsha.webapi:$VERSION

docker build -f ./Uragsha.Scheduler.HostedService/Dockerfile --force-rm -t antonybaasan/uragsha.scheduler:$VERSION .
docker push antonybaasan/uragsha.scheduler:$VERSION

docker build -f ./Uragsha.InstantMatcher.HostedService/Dockerfile --force-rm -t antonybaasan/uragsha.instantmatcher:$VERSION .
docker push antonybaasan/uragsha.instantmatcher:$VERSION

# publish angular web application
cd ../webapp
npm run build --aot --outputHashing=all
docker build -t antonybaasan/uragsha.webapp:$VERSION  .
docker push antonybaasan/uragsha.webapp:$VERSION

read -p "Press enter to continue"