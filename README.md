# zekademy-assignment
## How to run

To run
1. Clone the repository using
```
git clone https://github.com/yashgaur512/zekademy-assignment.git
```

2. install Dependencies using (Note: Node should be installed in your system to run npm command and you should be inside your zekademy-assignment folder)
```
npm i
```

3. Install Nodemon using 
```
npm install nodemon -g
```
4. Request for ACCESS_KEY and SECRET_ACCESS_KEY from developer

6. Replace randomKeys in the .env file with actual keys!!
<img width="1381" alt="Screenshot 2022-11-26 at 7 39 51 PM" src="https://user-images.githubusercontent.com/73823653/204092997-0406708c-d4e1-430b-8090-53bd8ee88ca1.png">


6. Run the following command
```
nodemon index.ts
```
Now the server should start and you can see an image like below in your terminal
<img width="1028" alt="Screenshot 2022-11-26 at 7 30 43 PM" src="https://user-images.githubusercontent.com/73823653/204092610-790b4898-468a-4f40-bbe5-e700ce91fb90.png">

You can now send post and get requests using Postman or through the browser.

**Please Note**
If using POSTMAN: 
-> Send post requests using x-www-form-urlencoded for register or login data
-> Send post requests for image using form-data
<img width="1281" alt="Screenshot 2022-11-26 at 7 34 53 PM" src="https://user-images.githubusercontent.com/73823653/204092844-f431664e-f0cb-4177-9644-73215022073c.png">
