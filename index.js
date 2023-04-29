const fs = require("fs")
const axios = require('axios');
const {XMLParser} = require("fast-xml-parser");

async function getOpenAIAPIKey() {
    const response = await axios.get('http://localhost:3000/openai-api-key');
    const data = await response.data
    return data.OpenAIAPIKey
}

async function callOpenAIAPI(prompt) {
    const url = 'https://api.openai.com/v1/chat/completions';
    const data = {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 2000,
    };
    const OpenAIAPIKey = await getOpenAIAPIKey();
    // console.log(OpenAIAPIKey)

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OpenAIAPIKey}`,
            },
        });
        // console.log("response.data____________", response.data)
        // console.log("response.data.choices____________", response.data.choices)
        const promptResponse = response.data.choices[0].message.content;
        console.log("Call OpenAIAPI()____________", promptResponse)
        return promptResponse;
    } 
    catch (error) {
        console.error('Error:', error);
    }
}

function createTaskPrompt(goal, fileStructure, taskObj) {
    var prompt = 
    `Goal: ${goal}

    File Structure: ${fileStructure}

    Write the all the code to be written in the following file: ${taskObj.fileName}
    All text not in code form must be commented out.
    File description: ${taskObj.description}`
    return prompt
}


function createInitialPromptForOpenAIAPI(goal) {
    var prompt = 
    `Here is the project Goal: ${goal} 

    I want you to create a file structure for the project and describe what functionalities need to be within each file. Return the file structure within a set of <fileStructure> tags and the data for each file within a set of <file> tags. The following is an example of how your response should look: 
    """
    <fileStructure>
        - app.js
        - config/
            - config.js
        - controllers/
            - journalController.js
            - userController.js
        - models/
            - journal.js
            - user.js
        - services/
            - twilioService.js
            - googleDocsService.js
        - utils/
            - scheduler.js
        - views/
            - settings.ejs
        - routes/
            - journalRoutes.js
            - userRoutes.js
    </fileStructure>
    <file>
        <filename>app.js</filename> 
        <description> The entry point of the application, responsible for setting up the server, initializing routes, and starting the scheduler.</description>
    </file>
    <file>
        <filename>config.js</filename> 
        <description> Contains the configuration settings for the application, including API keys and environment variables.</description>
    </file>
    <file>
        <filename>journalController.js</filename> 
        <description> Handles the main functionality related to the journal, such as sending the journal prompts and processing the responses from users.</description>
    </file>
    <file>
        <filename>userController.js</filename>
        <description> Manages user-related actions, including creating and updating user settings.</description>
    </file>
    """`
    return prompt
}

function getFileStructure(inputString) {
    let fileStructure = inputString.split('<fileStructure>')[1].split('</fileStructure>')[0].trim();
    return fileStructure;
}
function getFiles(inputString) {
    let filesRaw = inputString.split('</fileStructure>')[1].split('<filename>');
    filesRaw.shift(); // Remove the first empty element

    let files = filesRaw.map(file => {
        let fileName = inputString.split('<fileStructure>')[1].split('</fileStructure>')[0].trim();
        fileName = parts[0].trim();
        let description = parts[1].split('</description>')[0].trim();

        return {
            filename: fileName,
            description: description,
        };
    });

    return files;
}

function parseInitialResponse(initialResponse) {
    const parser = new XMLParser();
    let projectObj = parser.parse(initialResponse);
    console.log(projectObj)
    return projectObj
}

async function init(goal) {
    var initialPrompt = createInitialPromptForOpenAIAPI(goal)
    // console.log("initialPrompt________", initialPrompt)
    var unparsedInitialResponse = await callOpenAIAPI(initialPrompt)
    var projectObj = await parseInitialResponse(unparsedInitialResponse)
    // var fileStructure = await getFileStructure(unparsedInitialResponse)
    // var files = await getFiles(unparsedInitialResponse)
    for (let file of files) {
        var taskPrompt = await createTaskPrompt(goal, fileStructure, file)
        var codeResponse = await callOpenAIAPI(taskPrompt)
        fs.writeFile(`project/${file.fileName}`, (`//${file.description}` + '\n'), (err) => {
            if (err) throw err;
            console.log('Data written to file successfully.');
        })
        fs.appendFile(`project/${file.fileName}`, codeResponse, (err) => {
            if (err) throw err;
            console.log('Data written to file successfully.');
        })
    }
}
console.log("start__________")
init("Write a text message based journaling application using node.js. It will leverage Twilio API to send journal prompts via text messages and to append their text message responses to a journal document. The journal document then gets uploaded to google docs api. The text messages are sent out once per day at a time the user specifies in their user settings page.")


// callOpenAIAPI("the following says test 9 times")

// getOpenAIAPIKey();