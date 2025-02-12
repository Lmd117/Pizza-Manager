# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Running the project locally
To run the frontend for local development, run 
    npm run dev
in the terminal for the root project. Then, simply click on the provied link to access the local frontend.
The project connects with AWS servers through an API Gateway so will work and connect with the database AWS DynamoDB.

# What I thought about this process
I leaned into using Amazon services for this project because I had some experience before and I knew that it had a lot of documentation for hosting everything online for data persistence. I have previous experience with AWS Amplify that I used for my senior project at University, but hadn't been the one to set up API Gateway before, as another one of my groupmates had done so. It had a bit of a learning curve to work with and around security protocols, but did that soon enough. I'm glad that I chose to use AWS as they have free versions of just about everything you would need to host a smaller web application and included everything that I needed: Amplify, Lambda, API Gateway, DynamoDB. I had some issues trouble shooting with AWS, but once I started to include tests for types and error within the code, solving the bugs became much easier.