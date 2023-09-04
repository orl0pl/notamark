

/* 
███╗   ██╗ ██████╗ ████████╗ █████╗ ███╗   ███╗ █████╗ ██████╗ ██╗  ██╗
████╗  ██║██╔═══██╗╚══██╔══╝██╔══██╗████╗ ████║██╔══██╗██╔══██╗██║ ██╔╝
██╔██╗ ██║██║   ██║   ██║   ███████║██╔████╔██║███████║██████╔╝█████╔╝ 
██║╚██╗██║██║   ██║   ██║   ██╔══██║██║╚██╔╝██║██╔══██║██╔══██╗██╔═██╗ 
██║ ╚████║╚██████╔╝   ██║   ██║  ██║██║ ╚═╝ ██║██║  ██║██║  ██║██║  ██╗
╚═╝  ╚═══╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
                                                                       
Setup
*/
/*
You will setup notamark app. Type admin login, password and username below.
*/

import clientPromise from "./lib/dbConnect";

const login = 'admin';
const password = 'admin';
const username = 'Admin';

/*
Now you must create .env.local file in current folder.
Also you need to create mongodb database and copy connection string.

In .env.local file type:
MONGODB_URI="<Paste here your mongodb connection string>"

Now you must to copy your servers local/global ip adress.
In .env.local file type:
NEXTAUTH_URL="<Paste your copied ip adress>"
In url-config.js replace:
const SERVER_HOST = "http://192.168.100.6:3000"
with
const SERVER_HOST = "<Paste your copied ip adress>"

Now in the command line type that:
npm install

Now in the command line write:
ts-node setup.ts
*/

async function setup() {
    const client = await clientPromise;
    await client.db('notamark').collection("users").insertOne({
        accountLevel: 2,
        login: login,
        password: password,
        name: username
    })
}
