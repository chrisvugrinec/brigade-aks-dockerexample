const { events, Job } = require("brigadier")	
  	
events.on("getpods", (brigadeEvent, project) => {	
  console.log("==> handling 'cmdemo' job")	
  const docker = new Job("cmdemo", "cvugrinec/azcli-kubectl")	
  docker.env = {
    "USERNAME": project.secrets.username,
    "PASSWORD": project.secrets.password,
    "TENANT": project.secrets.tenant
  }
  docker.privileged = true;	
  docker.tasks = [	
    "az login --service-principal --username $USERNAME --password $PASSWORD --tenant $TENANT",	
    "kubectl get pods",	
  ];	
  docker.run()	
  console.log("==> finished 'cmdemo' job")	
})
