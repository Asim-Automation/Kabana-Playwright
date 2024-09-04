# KABANA-PLAYWRIGHT

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Running Tests](#running-tests)
6. [Configuration](#configuration)

## Overview

This project is a Playwright test automation suite built using TypeScript. It is designed to automate the testing of a Kanban board application.

## Project Structure

- **node_modules/**: Contains all the Node.js dependencies for the project.
- **tests/**: 
  - **Locators/**: Contains locator files with element selectors.
    - `Locators.ts`: Centralized locators used across test files for element identification.
  - **test/Kanban/**: 
    - `commonSteps.ts`: Includes reusable steps for Kanban board tests.
    - `suiteRunner.ts`: Configures the test runner for executing the test suite.
    - `kanban.spec.ts`: Contains specific test cases for Kanban board functionality.
  - **Utils/**:
    - `testUtils.ts`: Utility functions to assist in the execution of tests, such as data setup and cleanup functions.
- **.env**: Configuration file for environment variables.
- **.gitignore**: Lists files and directories to be ignored by Git version control.
- **package.json**: Holds the metadata for the project, including dependencies, scripts, and project information.
- **package-lock.json**: Describes the exact tree of dependencies that were installed.
- **playwright.config.ts**: The main configuration file for Playwright, setting up test parameters, browser settings, etc.

## Installation

To get started with the project, clone the repository and install the dependencies:

- git clone <repository-url>
cd KABANA-PLAYWRIGHT
- install all dependencies: `npm install`

## Usage

1. Ensure all dependencies are installed using `npm install`.
2. Configure any required environment variables in the `.env` file.

## Running Tests

1. To run all the tests in the Kanban directory in headed mode (with the browser UI visible), use the following command: `npx playwright test tests/test/Kanban --headed`
2. If you want to run the test suite multiple times to ensure stability, you can use the --repeat-each flag. For example, to run each test case 5 times, use: `npx playwright test tests/test/Kanban --headed --repeat-each 5`
3. To perform extensive testing, such as running each test case 20 times (totaling 60 test cases if there are 3 test cases), use: `npx playwright test tests/test/Kanban --headed --repeat-each 20`

## Configuration

1. Environment Variables: Create a .env file in the root directory and add the necessary environment variables.
 - BASE_URL: The base URL for the application.
2. Configuration Files: Modify playwright.config.ts to adjust test parameters, browser settings, etc.

