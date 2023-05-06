# AI-Powered Code Generation

## Description
Project Autocode is an intelligent coding assistant that streamlines the software development process by leveraging the power of OpenAI API to generate project file structures and code. Upon receiving a description of a coding project, it performs the following steps:
  
## Table of Contents:
* [Installation](#installation-instructions)
* [Usage Information](#usage-information)
* [Future](#future)
* [Questions](#questions)

## Installation Instructions
Git clone this repo. You will need node.js installed in order to run it.
  
## Usage Information
You will need to put your own open ai api key into a .env file in the root folder. You will also need to change the parameters in the init() function to include your own project name and specification. Use node package manager to install dependencies (run "npm i" while in the root folder.) Run the server.js file using node, and then run the index.js file with node using another terminal.

## Future
* About 20% of the time, the initial prompt will return the file descriptions in the wrong format. Unit tests can check for this and scrap the flawed prompt response and make the api call again til it passes tests.
* Have the code run itself after generated and do semiautomatic error handling:
  * Install dependencies (Run code, parse error messages and attempt to install missing dependency one by one; Have cap on certain amount of attempts before passing off to the user to handle manually)
  * Fix bugs (Run code, parse error messages to identify file in which error occured-> paste error message and problematic code into new openAI prompt and have it return a corrected version->overwrite original file->attempt again to run code. Again, have cap on certain amount of attempts before the error is passed off to the user to handle manually.)
* Add a CLI or web interface for users to input project parameters.

## Questions
For any questions about this project,  
reach out to [willrcline](https://github.com/willrcline)  
or...  
send an email to willrcline.atx@gmail.com