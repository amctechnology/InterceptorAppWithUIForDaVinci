## InterceptorAppWithUIForDaVinci
Contains a premade Angular application using the DaVinci Interceptor API. Contains a UI for dynamic control of which events are captured.
___
# Interceptor App for DaVinci
*Made with Angular*

This project contains a template for capturing, or intercepting, events that flow through DaVinci. For each event that can be captured by the Interceptor API, the data that is attached can be modified before returning to DaVinci where it is trasnmitted by any other DaVinci apps that are listening.

It also includes a UI which provides controls for dynamically choosing which events should be captured.

To begin using this application, first ensure the following tools are installed on your machine. Each item is linked to its respective installation instruction page:

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) version control tool

- [Node Package Manager (npm)](https://nodejs.org/en/download/)

clone the repo from GitHub by using the following command in a command-line tool: 

    git clone https://github.com/amctechnology/InterceptorAppWithUIForDaVinci.git

Once the repo has been cloned, navigate to the "ClientApp" subfolder using a command-line tool and type:

    npm install
Once all node packages have been installed, create a new application in DaVinci Studio. This can be done by doing the following:

1. Click on 'Edit Apps' in the menu on the left of the screen.

![Edit Apps](https://github.com/amctechnology/InterceptorAppWithUIForDaVinci/blob/master/images/editapps.PNG?raw=true)

2. Click on blue 'New App' button in the top left

![New App](https://github.com/amctechnology/InterceptorAppWithUIForDaVinci/blob/master/images/newapp.PNG?raw=true)

3. Name the app however you like, and click "Create"

4. The app you have just created should now appear in the apps menu. Click on 'Apps' in the menu on the left of the screen.

![Apps](https://github.com/amctechnology/InterceptorAppWithUIForDaVinci/blob/master/images/apps.PNG?raw=true)

5. Click on the app that you have just created, and click the green 'Add' button.

![Add](https://github.com/amctechnology/InterceptorAppWithUIForDaVinci/blob/master/images/add.PNG?raw=true)

6. Click on the app you have just created and added in the 'Configured Apps' section of the page and click the blue 'More' button.

![More](https://github.com/amctechnology/InterceptorAppWithUIForDaVinci/blob/master/images/more.PNG?raw=true)

7. Click on 'Config' in the left section of the menu, then click on the name of the app that appears beside it to the right. In this case, the app was named "test"

![Configuration](https://github.com/amctechnology/InterceptorAppWithUIForDaVinci/blob/master/images/config.PNG?raw=true)

8. Edit the 'URL' string by adding the URL you plan to serve the Interceptor app on. There are two cases which will decide which URL you use:
    - If you plan to serve this app on a particular domain, put this URL as the value of the field.
    - If you plan on running the app on localhost, put the localhost URL as the value of the field. Angular runs on port 4200 by default. If you would like to see which port Angular is serving on, navigate to the 'ClientApp' folder within the repo using a command-line tool and type `ng serve`. Once the project has begun to run, Angular will print the URL it is serving on
    ![Localhost](https://github.com/amctechnology/InterceptorAppWithUIForDaVinci/blob/master/images/localhost.PNG?raw=true)

    In this case, the project is being served on http://localhost:4200/
    ![URL](https://github.com/amctechnology/InterceptorAppWithUIForDaVinci/blob/master/images/url.PNG?raw=true)

9. Click the blue 'Save App' button in the top right.

![Save APP](https://github.com/amctechnology/InterceptorAppWithUIForDaVinci/blob/master/images/saveapp.PNG?raw=true)

10. At this point, DaVinci studio should now be configured correctly, and the Interceptor app should be running and available at the URL that was entered. Add a DaVinci Channel app and CRM app if they are not already present, and open the CRM of your choice with a softphone configured to use the DaVinci integrated experience. You should now be able to see the Interceptor UI somewhere within the interface

![Interceptor UI](https://github.com/amctechnology/InterceptorAppWithUIForDaVinci/blob/master/images/interceptor.PNG?raw=true)

To enable capturing of any particular event, navigate to that event and click the grey 'disabled' button to toggle capturing of that event.

To log all events that come through DaVinci, click the grey 'Logging: Off' button.

To begin customizing the way data attached to events is processed and modified, the 'app.component.ts' file must be edited. Open the file in the editor of your choice by navigating to: 

"ClientApp > src > app > app.component.ts"

The .ts extension if for a "TypeScript" file. TypeScript is nearly identical to JavaScript, but contains mechanisms and syntax to that allows for static typing. Information on TypeScript can be found [here](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

Each event that can be captured and modified has a related function in the app.component.ts file. If it is desired to modify "Interaction" data, for example, editing should begin in the "handleInteraction()" function. In each of these functions, the payload data attached to the event has already been placed in the `data` variable. Any of the fields within this object can be accessed, processed, and modified within the empty `if` block before the data is given back to DaVinci.

After any changes are made, rebuild the project and serve it on the same URL that was configured in DaVinci Studio. Once capturing the event is enabled within the UI, new changes should start to take effect.