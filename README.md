# Provocation Task

This repo contains a the provocation task. It is a [jspsych](https://www.jspsych.org/) task built with React and Electron.

## Getting Started

1. Clone this repo onto your computer
```
git clone https://github.com/brown-ccv/neuro-task-starter.git
```
2. Change the folder name and change directory into the new folder
```
mv neuro-task-starter task-<TASK_NAME>
cd task-<TASK NAME>
```
3. Set the remote url to your tasks' repo (create a github repo if not yet created)
```
git remote set-url origin <PATH_TO_YOUR_REPO>
```
4. Install the dependencies (the -D flag installs the dev dependencies as well as the production ones)
```
npm install -D
```
5. Run the task in dev mode - this should launch an electron window with the task with the inspector open to the console and will hot-reload when changes are made to the app
```
npm run dev
```
6. Check out the data - the data is saved throughout the task to the users's app directory.  This is logged at the beginning of the task wherever you ran `npm run dev`

## Project Organization

This project directory is organized to be very modular and composable. In general, files and functions should be relatively small and self-contained, global scope should not be used (and definitely not mutated), and only the pieces of code needed for any given file should be imported. This keeps the code maintainable with clear lineage and purpose for each piece of code. Below are descriptions of the main files and folders.

### `package.json`

The `package.json` file contains metadata about your project and scripts to run tasks related to your task. The `name` should be updated to your task's name and `scripts` can be added as desired, but otherwise this file should not be edited manually.  To remove or add a dependency use `npm install` or `npm uninstall` with the `-D` flag if installing a dev dependency.

The `package-lock.json` contains metadata about the package installation. It should never be manually updated.

### `public/`

The `public` directory contains files that are used as assets in the built app. The `favicon.ico` is the small icon you can see in the browser tab (on Chrome) - it is set to Brown's logo in the project. The `index.html` contains the shell of your website - the name displayed on the tab can be changed here, otherwise it shouldn't need to be edited. The scripts included in the file are for `psiturk` as are the files in the `lib/` directory.

### `src/`

This folder contains the code for the app, the vast majority of changes and code should go here.

#### `App.js`

This is the starting point for the app. The `<Experiment>` component initializes a `jspsych` experiment. This is also where communication is set up with the `electron` and `psiturk` processes.

#### `electron-starter.js`

This file controls the main electron process. This is where any code that needs to interact with the system (ports, file system, etc.) should go. To communicate between electron and the task, use `ipc`.

#### `App.css`

This is where styling for the app is housed. If colors, fonts, spacing, etc. need to be set, do it here.

#### `assets/`

This folder contains any static files that are used by the app, such as images.

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

## Usage with PsiTurk

FERNANDO PLEASE FILL THIS IN

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

Try deleting your `node_modules` folder and the `package-lock.json` then running `npm install -D`.

#### `(node:79877) UnhandledPromiseRejectionWarning: TypeError: p.write is not a function`

If this is showing in the electron console, this means the event marker is not connected - otherwise everything will run fine.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs `npm start` and `npm run electron-dev` concurrently.  This may not play nicely with windows.  If it doesn't, run `npm start` and `npm run electron-dev` from different terminal windows.

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build:platform`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.
platform: windows, mac, linux.

#### Prerequisites:windows

If not running this command on a windows machine, must have `mono` and `wine` installed.

#### To build all:

### `npm run build`

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

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
