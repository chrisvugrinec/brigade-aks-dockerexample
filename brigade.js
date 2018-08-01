const { events, Job } = require("brigadier")	
  	
events.on("dodemo", (brigadeEvent, project) => {	

  console.log("==> handling 'cmdemo' job")	

  // List Pod Job
  const listPodJob = new Job("cmdemo-listpods", "cvugrinec/azcli-kubectl")	
  listPodJob.env = {
    "USERNAME": project.secrets.username, 
    "PASSWORD": project.secrets.password,
    "TENANT": project.secrets.tenant 
  }
  listPodJob = true;	
  listPodJob.tasks = [	
    "az login --service-principal --username $USERNAME --password $PASSWORD --tenant $TENANT",	
    "kubectl get pods",	
  ];	

  // Burst Job, using ACI connector plugin...expanding cluster with ACI nodes
  const burstJob = new Job("cmdemo-burstjob", "cvugrinec/azcli-kubectl")
  listPodJob.env = {
    "USERNAME": project.secrets.username,
    "PASSWORD": project.secrets.password,
    "TENANT": project.secrets.tenant
  }
  burstJob.tasks = [
    "az login --service-principal --username $USERNAME --password $PASSWORD --tenant $TENANT",
    "git clone https://github.com/chrisvugrinec/busybox-example.git",
    "cd busybox-example.git",
    "k create -f busybox.yaml"
  ];


  // Example of piping of jobs...first listPodJob...and then burstJob
  listPodJob.run().then(() => {
    burstJob.run()
  })


  console.log("==> finished 'cmdemo' job")	
})

