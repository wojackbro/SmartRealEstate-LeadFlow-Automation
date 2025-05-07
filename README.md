# SmartRealEstate LeadFlow Automation

SmartRealEstate LeadFlow Automation is a powerful tool designed to streamline lead management and enhance customer interactions using AI-powered voice and chat assistants. This guide will help you set up the project on your local machine and configure it for use.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Environment Variables](#environment-variables)
- [Features](#features)

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/wojackbro/SmartRealEstate-LeadFlow-Automation.git
   cd SmartRealEstate-LeadFlow-Automation
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

## Running the Project

1. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. Open your browser and navigate to `http://localhost:3000` to view the application.

## Environment Variables

To use the AI-powered voice and chat assistants, you need to configure the environment variables.

1. Create a `.env` file in the `src/components/` directory if it doesn't already exist.

2. Add the following variables to the `.env` file:
   ```env
   VITE_OPENAI_API_KEY=YOUR_API_KEY_HERE
   ```
   Replace `YOUR_API_KEY_HERE` with your OpenAI API key. You can obtain an API key by signing up at [OpenAI](https://openai.com/).

3. Save the file.

## Features

- **AI Chat Assistant**: Engage with leads using an intelligent chat interface.
- **AI Voice Assistant**: Communicate with leads through a voice-enabled assistant.
- **Lead Management**: Capture, manage, and analyze leads effectively.
- **Analytics Dashboard**: Gain insights into lead performance and reports.

For more details, visit the [GitHub repository](https://github.com/wojackbro/SmartRealEstate-LeadFlow-Automation).

---

Feel free to contribute to the project by submitting issues or pull requests. Happy coding!
