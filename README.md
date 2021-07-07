# Provocation Task
<p style="float:left">
  <img alt="Provocation Icon" src="provocation.svg" width="200" />
</p>

[![Actions Status](https://github.com/brown-ccv/task-provocation/workflows/Test%2C%20Build%2C%20and%20Package/badge.svg)](https://github.com/brown-ccv/task-provocation/actions)


This repo contains the Provocation task. It is a [jspsych](https://www.jspsych.org/) task built with React and Electron. This task uses the [Neuro Task Starter](https://www.github.com/brown-ccv/neuro-task-starter).

## Getting Started

1. Clone this repo onto your computer
```
git clone https://github.com/brown-ccv/task-provocation.git
```
2. Install the dependencies
```
npm install
```
3. Run the task in dev mode - this should launch an electron window with the task with the inspector open to the console and will hot-reload when changes are made to the app. After installing, you may need to run `npm run rebuild` to make sure the packages have the correct binaries for the electron version in use.
```
npm run dev
```
4. Check out the data - the data is saved throughout the task to the users's app directory.  This is logged at the beginning of the task wherever you ran `npm run dev`.  If on windows, this command will not work.  Instead, in two different command prompts, run `npm run start` then in the other `npm run electron-dev`.

**NOTE**: When not running on MTurk, the task will look for a folder on the desktop called `provocation-images/<patient_id>` with subfolders `neutral` and `provoking`.  If these are present, images will be loaded from there instead of the default images that are included in the app.

## Contributing

1. Clone the repo and create a new feature branch off `develop`.

```shell
git clone https://github.com/brown-ccv/task-provocation.git
git checkout -b your-feature-branch
```

2. Make your changes and commit using [commitizen](https://pypi.org/project/commitizen/)
3. Submit a [pull request](https://help.github.com/en/articles/creating-a-pull-request) to the `develop` branch. Add @mcmcgrath13 or @fernandogelin as a reviewer.

## Project Organization

This project directory is organized to be very modular and composable. In general, files and functions should be relatively small and self-contained, global scope should not be used (and definitely not mutated), and only the pieces of code needed for any given file should be imported. This keeps the code maintainable with clear lineage and purpose for each piece of code. Below are descriptions of the main files and folders.

### `package.json`

The `package.json` file contains metadata about your project and scripts to run tasks related to your task. The `name` should be updated to your task's name and `scripts` can be added as desired, but otherwise this file should not be edited manually.  To remove or add a dependency use `npm install` or `npm uninstall` with the `-D` flag if installing a dev dependency.

The `package-lock.json` contains metadata about the package installation. It should never be manually updated.

### `public/`

The `public` directory contains files that are used as assets in the built app. The `favicon.ico` is the small icon you can see in the browser tab (on Chrome) - it is set to Brown's logo in the project. The `index.html` contains the shell of your website - the name displayed on the tab can be changed here, otherwise it shouldn't need to be edited. The scripts included in the file are for `psiturk` as are the files in the `lib/` directory.

#### `electron.js`

This file contains all of the code relating to the electron app. This includes the event-marker, throwing errors via dialog windows, saving data, and reading files.

#### `config/`

The `config` directory contains the config files needed for the electron app.  This includes the event-marker details and event codes.

Note: the `comName` can be overwritten by the environment variable COMNAME

### `src/`

This folder contains the code for the app, the vast majority of changes and code should go here.

#### `App.js`

This is the starting point for the app. The `<Experiment>` component initializes a `jspsych` experiment. This is also where communication is set up with the `electron` and `psiturk` processes. The `<Login>` component handles login authentication for the various app environments (Firebase, Prolific, MTurk, or desktop).

#### `App.css`

This is where styling for the app is housed. If colors, fonts, spacing, etc. need to be set, do it here.

#### `assets/`

This folder contains any static files that are used by the app, such as images.

### `components/`

React components.

### `JsPsychExperiment.jsx`

Sets up the JsPsych timeline and specifies which functions to use to update the JsPsych data and when the experiment finishes.

### `Login.jsx`

Handles login authentication. Contains different functions for the Firebase, Prolific, MTurk, and desktop cases.

#### `config/`

In the `config/` directory, there are `.js` files which contain settings for the different parts of the task.  Every task should have a `main` config and a `trigger` config (assuming use of the event marker). The `main` config has all global settings for the task (such as whether it is in mturk mode or not), load the appropriate language file, and set up a default (or only) configuration object for the task. The `trigger` config has settings specific to the event marker and uses a slightly different style of javascript as it is imported both in the React app as well as the electron process.

Other config files can be used to add settings for specific blocks or sub-sections of the experiment.

#### `language/`

Any language that is displayed in the experiment should be stored in this folder. Usage of language json files allows for easy internationalization of the task (e.g. english and spanish) as well as allows for mturk specific language. This also makes it easy to re-use common phrases in many places in the task.

#### `lib/`

The `lib/` directory contains utility functions and markup that is used in the tasks.  This allows for functions and html to be re-used wherever needed. The `lib/utils.js` file contains functions that are generally useful across many tasks, whereas `lib/taskUtils.js` contains functions specific to this task.

#### `lib/markup`

`markup` files should contain primarily templates for HTML that is used throughout the task. Typically this will be a function that takes in some parameters and then returns a string with html.

#### `timelines`

`jspsych` uses `timelines` to control what `trials` are displayed in what order.  `timelines` can contain other `timelines`, which is why there may be several files in this directory.  The `main.js` file should have the timeline that is called by `App.js`.

#### `trials`

`jspsych` uses `trials` as its base unit of an experiment. These trials do things such as display some stimulus or request a response.

## Environment Variables

NOTE: boolean environment variables should be set as strings, e.g., `"true"` _not_ `true`. Boolean environment variables are false by default. The following are environment variables used by the app:

### Buildtime variables
These are set in `.env` files in the repo.

* `ELECTRON_START_URL` [string]: URL (e.g. `http://localhost:3000`) where the front end of the app is being hosted - also used in `electron.js` to indicate the app is running in dev mode
* `EVENT_MARKER_PRODUCT_ID` [string]: The product ID of the event marker (e.g. `0487`).  If not set, it will use the `productID` set in `public/config/trigger.js`.
* `REACT_APP_FIREBASE` [boolean]: True if Firebase is in use.
* `REACT_APP_VOLUME` [boolean]: Whether or not to ask the participant to adjust the volume before the experiment starts.
* `REACT_APP_EVENT_MARKER` [boolean]: Whether or not the EEG is in use.
* `REACT_APP_USE_PHOTODIODE` [boolean]: Whether or not the photodiode is in use.
* Firebase environment variables: If using a custom Firebase project, make sure to set environment variables accordingly.

### Runtime variables
These are set for the specific machine the task is running on.

* `REACT_APP_HIDE_FRAME_ELECTRON` [boolean]: Whether or not to hide the buttons for closing and minifying the app window.

### `env/`

Contains `.env` files that set the above environment variables for different build environments. If you want to adjust environment variable settings, create a new `.env` file and a corresponding build/dev script in `package.json`.

* `.env.clinic`: Sets environment variables for the in-clinic environment.
* `.env.firebase-build`: Sets environment variables for running with Firebase.
* `.env.home`: This file is blank, since the at-home environment has default environment variable settings.
* `.env.video`: Sets environment variables for running at home with video enabled.

## Usage with PsiTurk

While this set up is optimized for Electron, we added functionality that will make use with PsiTurk easy. The application will detect if it's being used in a Turk environment and will:  

- Save the data to the default PsiTurk SQLite database.  
- Switch the language to Turk specific, if `src/language/<locale>.mturk.json` exists.  
- Use the Turk specific timeline if different than the primary timeline.  

**Prebuilt version**
When GitHub Actions is run, a psiturk build will be created automatically, and can be downloaded from its artifacts (skip next step if using).

**Build instructions**
To set up your PsiTurk project, we provide a script that does the conversion.
PsiTurk is a Python package used to manage HITs in Mechanical Turk. Before using the provided script, install [PsiTurk](https://psiturk.org/).

You'll need to follow these steps (the path to the PsiTurk project should be a directory you wish to be created):
- Build the application: `npm run build`  
- Move to the `psiturkit` directory: `cd psiturkit`
- If it's the first time you're running the script:  
  `./psiturk-it -p <PATH_TO_NEW_PSITURK_PROJECT>`  

- To update an existing PsiTurk project (the path to the PsiTurk project should already exist from the previous steps):  
  `./psiturk-it -u -p <PATH_TO_NEW_PSITURK_PROJECT>`

**Running psiturk**
After that, just navigate to your newly created PsiTurk project directory.
```shell
shell> psiturk #start psiturk
psiturk> server on #start server
psiturk> debug #debug mode
```

## Best Practices

### Write good commit messages

[Commitizen](https://pypi.org/project/commitizen/) is a great tool for writing angular commits - this will create a standardized commit format which makes for easier change logging and more sane messages.

### Use git flow (ish)

Your `master` branch should be where official releases are made (whenever code is used in real life tasks) and `develop` should be the working copy.  Use branches for any new features or fixes and then use pull requests to merge those into `develop`. Merge `develop` into `master` when using the task and make sure to tag a release. This will ensure you can always go back to exactly the code that was working with a specific subject/session.

### Keep your code style consistent

* `let` instead of `var`
* fat arrow functions (`const myFunc = (var) => doSomething(var)`) instead of es5/6 functions (`function myFunc(var) { doSomething(var) }`)
* camel case for variable, and function names (`doSomething`) instead of snake case (`do_something`)
* but snake case inside json is fine
* a `tab` === two spaces
* file exports at the bottom of the file in one chunk instead of exporting the function declaration
* when in doubt, leave future you a comment (you'll never regret it)

## Troubleshooting

When developing electron apps there are two processes: `main`, and `renderer`.  In this case `main` corresponds to `electron-starter.js` and its console is wherever you called `npm run dev` or `electron .` from. `renderer` corresponds to the React App - this is everything else. The react app's console is in the electron/browser window and can be seen by using dev tools to inspect the window.  When running `npm run dev`, it should open by default.

### Potential Issues

#### Package not found or other error related to `npm`

Try deleting your `node_modules` folder and the `package-lock.json` then running `npm install` then `npm run rebuild`.


## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs `npm start` and `npm run electron-dev` concurrently.  This may not play nicely with windows.  If it doesn't, run `npm start` and `npm run electron-dev` from different terminal windows.

### `npm run dev:firebase`

Runs a dev version of the app with Firebase enabled.

### `npm run dev:home`

Runs a dev version for the at-home context.

### `npm run dev:home:video`

Runs an at-home version with video enabled.

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm build`

Creates a production build of the app (renderer).  This must be done before running `package:platform` or the psiturk build instructions.

### `npm run build:firebase`

Builds the project for Firebase.

### `npm run build:home`

Builds the project for an at-home context.

### `npm run build:video`

Builds the project for an at-home context with video enabled.

### `npm run build:clinic`

Builds the project for an in-clinic context.

### `npm run package:platform`

It correctly bundles creates electron packages for the given platform.  It then creates an installer for that platform.  The output can be found in `/dist`
platforms: windows, mac, linux.

### `npm run installer:mac`

For mac, must be called after `npm run package:mac` to create a `.dmg` installer.  Run `npm rebuild` before running this.


#### Prerequisites

If not running this command on a windows machine, must have `mono` and `wine` installed.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Run Electron

#### `npm run electron`

Run the built app.

#### `npm run electron-dev`

Run the current state of the code (un-built).
