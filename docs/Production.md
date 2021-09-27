
# Producton

The components of the Uragsha application are hosted in the Kubernetes cluster in the DigitalOcean cloud provider.
Before realase into 

### Prerequisite
- [Kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Doctl](https://docs.digitalocean.com/reference/doctl/how-to/install/)


### Steps to create and setup k8s cluster

These steps are created based on this documentation - [read here](https://www.digitalocean.com/community/tutorials/how-to-set-up-an-nginx-ingress-with-cert-manager-on-digitalocean-kubernetes)


```PS
# get the cluster id from DigitalOcean Kubernetes menu
doctl kubernetes cluster kubeconfig save <cluster id>

kubectl apply -f .\devops\k8s\deployment.yml

kubectl apply -f .\devops\k8s\services.yml

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.0.2/deploy/static/provider/do/deploy.yaml

# after this command user can access to HTTP urls
kubectl apply -f .\devops\k8s\ingress.yml

# Add Tsl certificate from LetsEncrypt

# Read more here about below steps - https://cert-manager.io/docs/tutorials/acme/ingress/
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.3/cert-manager.yaml

kubectl apply -f .\devops\k8s\prod_issuer.yml

# this will enable Pod to Pod communication, which is required for ACME http01 challenge
kubectl apply -f .\devops\k8s\ingress_nginx_svc.yaml
```

### For updating application version:
```PS
# Before this, udpate the components versions (docker image versions) accordingly
kubectl apply -f .\devops\k8s\deployment.yml

kubectl apply -f .\devops\k8s\services.yml

...
```


**Troubleshoot:**

Internal pod to pod communication has to be enabled in order to ACME challenge succeed:

https://www.digitalocean.com/community/questions/issue-with-waiting-for-http-01-challenge-propagation-failed-to-perform-self-check-get-request-from-acme-challenges
