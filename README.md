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

In 
```
config/keys.js
```
make sure to change <atlasusername> and <password> to your atlas username and password
```
dbPassword = 'mongodb+srv://<atlasusername>:<password>@cluster0-o8nhq.mongodb.net/test?retryWrites=true';
```
