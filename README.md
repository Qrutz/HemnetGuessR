# HemnetGuessR 
Wordle inspiried game where you guess the price of a hemnent listing, after every attempt the game tells you if the guess was too high or too low, you recieve another clue which can be anything from the square feet to the amount of rooms. If you guess withing 5-7% of the listing price you win. 

## Stack
- Nextjs
- Typescript
- AWS Services. (see below diagram).
- Serverless framework
- Selenium
- Python
- Tailwind

## Game UI

Game  |  Past guessess
:-------------------------:|:-------------------------:
![image](https://github.com/Qrutz/HemnetGuessR/assets/40356149/528da5b7-27dc-48a7-8f5a-7d81b44dfc78) | ![image](https://github.com/Qrutz/HemnetGuessR/assets/40356149/edcda655-c2ca-4891-b40c-fdca42a3adb6)


## AWS Architechture
![AWS (2019) horizontal framework](https://github.com/Qrutz/HemnetGuessR/assets/40356149/e92721f8-f7df-46c2-98e1-4b54deaf6df5)



- Amplify: Used for hosting our nextjs application.

- API Gateway: RESTful api which provides the daily house from the database, house is grabbed randomly.

- Lambda: The webscraper is a python lambda function which runs every 7 days and saves approx 50 listings per scrape.

- Cloudwatch: Responsible for running our lambda function / scraper every 7 days as a cron job.

- DynamoDB: Where all the houses data is hosted, since we are webscraping our data a non-schema db was optimal, scraped data can be unpredictable and come in many forms 🤡.
