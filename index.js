const fs = require("fs-extra")
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
        // console.log("Call OpenAIAPI()____________", promptResponse)
        return promptResponse;
    } 
    catch (error) {
        console.error('Error:', error);
    }
}

function createTaskPrompt(goal, fileStructure, filePath, description) {
    var prompt = 
    `Goal: ${goal}

    File Structure: ${fileStructure}

    Write the all the code to be written in the following file: ${filePath}
    All text not in code form must be commented out.
    File description: ${description}`
    return prompt
}


function createInitialPromptForOpenAIAPI(goal) {
    var prompt = 
    `Here is the project Goal: ${goal} 

    I want you to create a file structure for the project and describe what functionalities need to be within each file. Return the file structure within a set of <fileStructure> tags and the data for each file within a set of <file> tags. The following is an example of how your response should look: 
    """
    <fileStructure>
        "app.js",
        "config/config.js",
        "controllers/journalController.js",
        "controllers/userController.js",
        "models/journal.js",
        "models/user.js",
        "services/twilioService.js",
        "services/googleDocsService.js",
        "utils/scheduler.js",
        "views/settings.ejs",
        "routes/journalRoutes.js",
        "routes/userRoutes.js"
    </fileStructure>
    <fileDetails>
        <filePath>app.js</filePath> 
        <description> The entry point of the application, responsible for setting up the server, initializing routes, and starting the scheduler.</description>
        <filePath>config/config.js</filePath> 
        <description> Contains the configuration settings for the application, including API keys and environment variables.</description>
        <filePath>controllers/journalController.js</filePath> 
        <description> Handles the main functionality related to the journal, such as sending the journal prompts and processing the responses from users.</description>
        <filePath>controllers/userController.js</filePath>
        <description> Manages user-related actions, including creating and updating user settings.</description>
    </fileDetails>
    """`
    return prompt
}

function getFileStructure(inputString) {
    let fileStructure = inputString.split('<fileStructure>')[1].split('</fileStructure>')[0].trim();
    return fileStructure;
}
function getFiles(inputString) {
    let filesRaw = inputString.split('</fileStructure>')[1].split('<filePath>');
    filesRaw.shift(); // Remove the first empty element

    let files = filesRaw.map(file => {
        let filePath = inputString.split('<fileStructure>')[1].split('</fileStructure>')[0].trim();
        filePath = parts[0].trim();
        let description = parts[1].split('</description>')[0].trim();

        return {
            filePath: filePath,
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

async function createFile(path, content) {
    try {
        // Ensure the dir exists. If it doesn't, this will create it
        await fs.ensureDir(path.substring(0, path.lastIndexOf("/")));
        
        // Write the file
        await fs.writeFile(path, content);
        
        console.log("File created successfully at", path);
    } catch (err) {
        console.error(err);
    }
}

async function init(projectName, goal) {
    var initialPrompt = createInitialPromptForOpenAIAPI(goal)
    // console.log("initialPrompt________", initialPrompt)
    var unparsedInitialResponse = await callOpenAIAPI(initialPrompt)
    var projectObj = await parseInitialResponse(unparsedInitialResponse)
    var fileStructure = projectObj.fileStructure
    var filePathsArray = projectObj.fileDetails.filePath
    var fileDescriptionArray = projectObj.fileDetails.description
    for (i=0; i < filePathsArray.length; i++) {
        var filePath = filePathsArray[i]
        var description = fileDescriptionArray[i]
        var taskPrompt = createTaskPrompt(goal, fileStructure, filePath, description)
        var codeResponse = await callOpenAIAPI(taskPrompt)
        
        createFile(`dist/${projectName}/${filePath}`, codeResponse)
        // fs.writeFile(`${projectName}/${filePath}`, (`//${description}` + '\n'), (err) => {
        //     if (err) throw err;
        //     console.log(`Data written to ${filePath} successfully.`);
        // })
        // fs.appendFile(`${projectName}/${filePath}`, codeResponse, (err) => {
        //     if (err) throw err;
        //     console.log(`Data written to ${filePath} successfully.`);
        // })
    }
}

console.log("start__________")
init("journalJar2", "Write a text message based journaling application using node.js. It will leverage Twilio API to send journal prompts via text messages and to append their text message responses to a journal document. The journal document then gets uploaded to google docs api. The text messages are sent out once per day at a time the user specifies in their user settings page.")


// createFile("journalTest/app.js", "<body> content </body>")

// callOpenAIAPI("the following says test 9 times")

// getOpenAIAPIKey();