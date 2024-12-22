# Welcome

This is my take on a showcase of a simple loan-service engine. Tech stack includes node, express, typescript, postgresql, typeORM, and finally docker to containerize the app.

## Get Started

I recommend the use of Docker to run this app. This ensures consistency and compatibility accross different machines. it's so simple you only need one command to run, and it will install and initialize everything else needed to run the app:

1. Start the app with: docker-compose up -d
2. Open docker dashboard to monitor app container logs
3. Create new connection in DBMS (e.g. dbeaver), see docker-compose.yml for connection config
4. Done! You can now start developing

# Requirement - Loan Service (system design and abstraction)

We are building a loan engine. A loan can a multiple state: proposed , approved, invested, disbursed. the rule of state:

1. proposed is the initial state (when loan created it will has proposed state):
2. approved is once it approved by our staff.
   a. an approval must contains several information:
   i. the picture proof that a field validator has visited the borrower
   ii. the employee id of field validator
   iii. date of approval
   b. once approved it can not go back to proposed state
   c. once approved loan is ready to be offered to investors/lender
3. invested is once total amount of invested is equal the loan principal
   a. loan can have multiple investors, each with each their own amount
   b. total of invested amount can not be bigger than the loan principal amount
   c. once invested all investors will receive an email containing link to agreement letter (pdf)
4. disbursed is when loan is given to borrower.
   a. a disbursement must contains several information:
   i. the loan agreement letter signed by borrower (pdf/jpeg)
   ii. the employee id of the field officer that hands the money and/or collect the agreement letter
   iii. date of disbursement

movement between state can only move forward, and a loan only need following information: - borrower id number - principal amount - rate, will define total interest that borrower will pay - ROI return of investment, will define total profit received by investors - link to the generated agreement letter

design a RESTFful api that satisfy above requirement.
