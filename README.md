# deployed
My first project Yelpcamp
This project was part of the course I joined on www.udemy.com.

You can view the running application at https://protected-hollows-85414.herokuapp.com.


How to run the application :-
1. Download the clone.
2. Please have nodejs and mongodb installed locally on your machine.
3. Open cmd and go to the directory having app.js.
4. Run npm start. ( this will install the required npm modules).
5. Setup mongodb on your system.
6. Open new terminal and go to C:/mongodb/bin (or where your mongodb is installed).
7. Run mongod. (This will start mongodb server).
8. After mongodb server is running, Go to previous terminal and in the same directory having app.js, run node app.js.
9. This will start the server locally.
10. Go to browser at ://localhost:3000.

Slight modification in code for running locally :-
1. Open app.js.
2. Comment #21(mongoose.connect("mongodb://yelpcampdb:password@ds147789.mlab.com:47789/yelpcamp");) and uncomment line no 19
   (mongoose.connect("mongodb://localhost/yelp_db_v7");). This will be running mongodb locally.
3. In #61 change "process.env.PORT" to "3000".
