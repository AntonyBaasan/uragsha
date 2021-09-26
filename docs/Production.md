

### Update k8s

```
doctl kubernetes cluster kubeconfig save <cluster id>

kubectl apply -f .\devops\k8s\deployment.yml

kubectl apply -f .\devops\k8s\services.yml
```
