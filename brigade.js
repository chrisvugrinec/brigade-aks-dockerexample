const { events, Job } = require("brigadier")	

events.on("scale", (brigadeEvent, project) => {
  
  console.log("executing: "+brigadeEvent.type+" event");
  
  var scaleJob = new Job("cmdemo-scaledeployment", "cvugrinec/azcli-kubectl") 
  scaleJob.env = {
    "USERNAME": project.secrets.username,
    "PASSWORD": project.secrets.password,
    "TENANT": project.secrets.tenant,
    "INSTANCES": brigadeEvent.payload
  }
  scaleJob.tasks = [
    "az login --service-principal --username $USERNAME --password $PASSWORD --tenant $TENANT",
    "kubectl scale deploy busybox --replicas=$INSTANCES",
  ];
  scaleJob.run();
})
	
events.on("deploy", (brigadeEvent, project) => {	

  console.log("==> handling 'deployment' job")	

  // List Pod Job
  var listJob = new Job("cmdemo-listpods", "cvugrinec/azcli-kubectl")	
  listJob.env = {
    "USERNAME": project.secrets.username, 
    "PASSWORD": project.secrets.password,
    "TENANT": project.secrets.tenant 
  }
  listJob.tasks = [	
    "az login --service-principal --username $USERNAME --password $PASSWORD --tenant $TENANT",	
    "kubectl get pods",	
  ];	

  // Deploy Job, using ACI connector plugin...expanding cluster with ACI nodes
  var deployJob = new Job("cmdemo-deployjob", "cvugrinec/azcli-kubectl")
  deployJob.env = {
    "USERNAME": project.secrets.username,
    "PASSWORD": project.secrets.password,
    "TENANT": project.secrets.tenant
  }
  deployJob.tasks = [
    "az login --service-principal --username $USERNAME --password $PASSWORD --tenant $TENANT",
    "git clone https://github.com/chrisvugrinec/aks-brigadedemo.git",
    "cd aks-brigadedemo/busybox/",
    "kubectl create -f busybox.yaml"
  ];


  // Example of piping of jobs...first listPodJob...and then burstJob
  listJob.run().then(() => {
    deployJob.run()
  })


  console.log("==> finished 'deployment' job")	
})

