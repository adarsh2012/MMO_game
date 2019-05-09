# GeekGames (Server code) 
When cloned/downloaded, run the following commond:

```
node server.js
```


make sure to change the <loadLB_ip> and <my_ip> in server.js to your load balancer's ip address and your server's IP address

```
const options = { 
    url: '<loadLB_ip> ', 
    headers: { 
    'origin': '<my_ip>' 
    } 
    } 
    const sendGET = setInterval(function () { 
    var req = request.post(options, function (res) { 
    console.log('Request send.') 
    }); 
    }, 1000);
    
```
