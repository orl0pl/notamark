<p align="center">
<img width="400" src="https://github.com/orl0pl/notamark/blob/classic/.images/notemarklogowide.png" alt="Notamark Logo" align="center">
 
</p>
<p align="center">
Accesible notes for everyone
</p>
<span align="center">Built using <b>Next.js</b>, <b>MongoDB</b> and <b>Typescript</b>.</span>



## Features

- CRUD operations on notes, lessons and subejcts
- secure ticket based user managment
 
## Setup
1. Clone this git repo.
2. Create MongoDB database.
3. Copy connection string
4. Create `.env.local` file.
5. Add `MONGODB_URI` variable to `.env.local` and set it to your copied connection string.
6. Replace `<password>` with your database password.
7. Add `NEXTAUTH_URL` variable to `.env.local` and set it to your *ip addres* or *domain name*, **don't forget to add *http/https* on start**.
8. In `url-config.js` replace `SERVER_HOST` variable with your *ip addres* or *domain name*, **don't forget to add *http/https* on start**.
9. Install depediences: `npm install`
10. Build: `npm run build`
11. Run: `npm start`
12. Go to *ip addres* or *domain name* in browser.
13. Go through setup screen.
## Troubleshotting
#### `Invalid/Missing environment variable: "MONGODB_URI"`
Copy your connection string from `.env.local`
On windows run: `set MONGODB_URI="<paste your connection string>"`
On linux/macOS run: `export MONGODB_URI="<paste your connection string>"`
#### `MongoServerSelectionError: [...] routines:ssl3_read_bytes:tlsv1 alert internal error:[...]\rec_layer_s3.c:1605:SSL alert number 80`
Looks like you don't added your ip addres to network access in database settings.
