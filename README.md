# HemnetGuessR 
Wordle inspiried game where you guess the price of a hemnent listing, after every attempt the game tells you if the guess was too high or too low, you recieve another clue which can be anything from the square feet to the amount of rooms. If you guess withing 5-7% of the listing price you win. 

## Stack
- Nextjs
- Typescript
- AWS Services. (see below diagram).
- Python
- Selenium
- Tailwind

## Game UI

Game  |  Past guessess
:-------------------------:|:-------------------------:
![image](https://github.com/Qrutz/TervsGame/assets/40356149/b885f989-52d7-47e4-8990-581d0da12fec) | ![image](https://github.com/Qrutz/TervsGame/assets/40356149/e52252e4-a298-4e94-b31f-8471593eec86)

## AWS Architechture

![AWS (2019) horizontal framework](https://github.com/Qrutz/TervsGame/assets/40356149/3b4aada6-a6aa-4753-aca2-d1fd1e452634)

- Amplify: Used for hosting our nextjs application.

- API Gateway: RESTful api which provides the daily house from the database, house is grabbed randomly.

- Lambda: The webscraper is a python lambda function which runs every 7 days and saves approx 50 listings per scrape.

- Cloudwatch: Responsible for running our lambda function / scraper every 7 days as a cron job.

- DynamoDB: Where all the houses data is hosted, since we are webscraping our data a non-schema db was optimal, scraped data can be unpredictable and come in many forms 🤡.
