<h1 align="center">
  <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" />
  <br>anime-discord-bot-companion
</h1>
<h4 align="center">A Discord bot companion for anime enthusiasts, offering features like personalized recommendations, list management, and fun interactions.</h4>
<h4 align="center">Developed with the software and tools below.</h4>
<p align="center">
  <img src="https://img.shields.io/badge/Framework-NestJS-blue" alt="Framework: NestJS" />
  <img src="https://img.shields.io/badge/Frontend-React-red" alt="Frontend: React" />
  <img src="https://img.shields.io/badge/Backend-Node.js-blue" alt="Backend: Node.js" />
  <img src="https://img.shields.io/badge/LLMs-OpenAI-black" alt="LLMs: OpenAI" />
</p>
<p align="center">
  <img src="https://img.shields.io/github/last-commit/spectra-ai-codegen/anime-discord-bot-companion?style=flat-square&color=5D6D7E" alt="git-last-commit" />
  <img src="https://img.shields.io/github/commit-activity/m/spectra-ai-codegen/anime-discord-bot-companion?style=flat-square&color=5D6D7E" alt="GitHub commit activity" />
  <img src="https://img.shields.io/github/languages/top/spectra-ai-codegen/anime-discord-bot-companion?style=flat-square&color=5D6D7E" alt="GitHub top language" />
</p>

## 📑 Table of Contents
- 📍 Overview
- 📦 Features
- 📂 Structure
- 💻 Installation
- 🏗️ Usage
- 🌐 Hosting
- 📄 License
- 👏 Authors

## 📍 Overview
The repository contains a project called "anime-discord-bot-companion" that is a Discord bot designed to provide a rich and interactive experience for anime fans. The bot leverages a powerful backend built with NestJS and a user-friendly frontend crafted with React to offer a wide range of features. It aims to foster a vibrant anime community within Discord by facilitating interactions, discussions, and shared experiences among anime enthusiasts.

## 📦 Features

|    | Feature            | Description                                                                                                        |
|----|--------------------|--------------------------------------------------------------------------------------------------------------------|
| 🤖 | Anime Recommendation System   | Provides personalized anime recommendations based on user preferences, helping users discover new shows they might enjoy.             |
| 📝 | Anime List Management  | Allows users to create and manage their anime watchlists, tracking their progress, sharing lists with friends, and organizing their anime viewing experience. |
| 🎉 | Fun Anime Interactions   | Offers a variety of fun and engaging interactions related to anime, including trivia quizzes, meme generators, character generators, random fact generators, and interactive games. |
| ⚔️ | MMORPG-Like Anime Experience | Allows users to create anime-themed characters, level them up, collect virtual items, and interact with other players in a virtual world, adding a unique and engaging layer to the bot. |
| 🌐 | Advanced Features   | Incorporates AI-powered algorithms for more accurate and personalized recommendations, community features to foster interactions, gamified elements to incentivize user engagement, and visual enhancements for an engaging experience.  |

## 📂 Structure

```
├── client
│   ├── components
│   │   ├── Layout.js
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── AnimeList.js
│   │   ├── AnimeDetails.js
│   │   ├── MMORPG.js
│   │   ├── UserDashboard.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   └── Profile.js
│   ├── pages
│   │   ├── index.js
│   │   ├── anime.js
│   │   ├── list.js
│   │   ├── mmorpg.js
│   │   ├── user.js
│   │   └── auth.js
│   ├── styles
│   │   ├── globals.css
│   │   └── theme.js
│   ├── utils
│   │   ├── api.js
│   │   └── auth.js
│   └── next.config.js
├── src
│   ├── api
│   │   ├── anime
│   │   │   ├── aniList.service.ts
│   │   │   ├── myAnimeList.service.ts
│   │   │   ├── jikan.service.ts
│   │   │   └── anime.controller.ts
│   │   ├── user
│   │   │   ├── user.service.ts
│   │   │   └── user.controller.ts
│   │   ├── auth
│   │   │   ├── auth.service.ts
│   │   │   └── auth.controller.ts
│   │   └── list
│   │       ├── list.service.ts
│   │       └── list.controller.ts
│   ├── discord
│   │   ├── events
│   │   │   ├── ready.ts
│   │   │   ├── messageCreate.ts
│   │   │   ├── guildMemberAdd.ts
│   │   │   └── interactionCreate.ts
│   │   ├── commands
│   │   │   ├── anime
│   │   │   │   ├── recommend.ts
│   │   │   │   └── search.ts
│   │   │   ├── list
│   │   │   │   ├── add.ts
│   │   │   │   ├── remove.ts
│   │   │   │   ├── show.ts
│   │   │   │   └── update.ts
│   │   │   ├── fun
│   │   │   │   ├── trivia.ts
│   │   │   │   ├── meme.ts
│   │   │   │   ├── character.ts
│   │   │   │   └── random.ts
│   │   │   ├── mmorpg
│   │   │   │   ├── create.ts
│   │   │   │   ├── levelup.ts
│   │   │   │   ├── quest.ts
│   │   │   │   ├── battle.ts
│   │   │   │   ├── inventory.ts
│   │   │   │   └── shop.ts
│   │   │   └── help.ts
│   │   ├── utils
│   │   │   ├── logger.ts
│   │   │   ├── commandHandler.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── discord.service.ts
│   │   └── bot.ts
│   ├── modules
│   │   ├── database
│   │   │   ├── database.module.ts
│   │   │   └── database.provider.ts
│   │   ├── anime
│   │   │   ├── anime.module.ts
│   │   │   └── anime.service.ts
│   │   ├── user
│   │   │   ├── user.module.ts
│   │   │   └── user.service.ts
│   │   ├── auth
│   │   │   ├── auth.module.ts
│   │   │   └── auth.service.ts
│   │   ├── list
│   │   │   ├── list.module.ts
│   │   │   └── list.service.ts
│   │   ├── mmorpg
│   │   │   ├── mmorpg.module.ts
│   │   │   └── mmorpg.service.ts
│   │   └── fun
│   │       ├── fun.module.ts
│   │       └── fun.service.ts
│   ├── entities
│   │   ├── user.entity.ts
│   │   ├── list.entity.ts
│   │   ├── anime.entity.ts
│   │   └── mmorpg.entity.ts
│   ├── interfaces
│   │   ├── anime.interface.ts
│   │   ├── user.interface.ts
│   │   ├── list.interface.ts
│   │   └── mmorpg.interface.ts
│   ├── constants
│   │   ├── env.constants.ts
│   │   └── api.constants.ts
│   └── main.ts
├── .env
└── package.json
```

  ## 💻 Installation
  ### 🔧 Prerequisites
  - Node.js
  - npm
  - Docker
  - Redis
  - PostgreSQL

  ### 🚀 Setup Instructions
  1. Clone the repository:
     - `git clone https://github.com/spectra-ai-codegen/anime-discord-bot-companion.git`
  2. Navigate to the project directory:
     - `cd anime-discord-bot-companion`
  3. Install dependencies:
     - `npm install`
  4. Create a `.env` file in the root directory and add the following environment variables:
     - `DISCORD_TOKEN`: Your Discord bot token
     - `POSTGRES_HOST`: Your PostgreSQL database host
     - `POSTGRES_USER`: Your PostgreSQL database user
     - `POSTGRES_PASSWORD`: Your PostgreSQL database password
     - `POSTGRES_DATABASE`: Your PostgreSQL database name
     - `REDIS_HOST`: Your Redis server host
     - `REDIS_PORT`: Your Redis server port
     - `OPENAI_API_KEY`: Your OpenAI API key
  5. Create a `database.sql` file in the root directory and run the following SQL commands to create the necessary tables:
     ```sql
     CREATE TABLE users (
         id SERIAL PRIMARY KEY,
         username VARCHAR(255) NOT NULL,
         email VARCHAR(255) NOT NULL UNIQUE,
         password VARCHAR(255) NOT NULL,
         created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
     );

     CREATE TABLE lists (
         id SERIAL PRIMARY KEY,
         user_id INT REFERENCES users(id),
         name VARCHAR(255) NOT NULL,
         type VARCHAR(255) NOT NULL,
         anime_ids TEXT[] NOT NULL,
         created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
     );

     CREATE TABLE anime (
         id SERIAL PRIMARY KEY,
         title VARCHAR(255) NOT NULL,
         synopsis TEXT,
         genres TEXT[],
         studios TEXT[],
         rating NUMERIC,
         created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
     );

     CREATE TABLE mmorpg_characters (
         id SERIAL PRIMARY KEY,
         user_id INT REFERENCES users(id),
         name VARCHAR(255) NOT NULL,
         level INT NOT NULL DEFAULT 1,
         experience INT NOT NULL DEFAULT 0,
         inventory TEXT[] NOT NULL,
         created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
     );
     ```
  6. Run the following commands to start the bot:
     - `npm run start:dev` (for development mode)
     - `npm run start:prod` (for production mode)

  ## 🏗️ Usage
  ### 🏃‍♂️ Running the Project
  1. Start the development server:
     - `npm run start:dev`
  2. Open your browser and navigate to `http://localhost:3000`.

  ### ⚙️ Configuration
  Adjust configuration settings in `.env`.

  ### 📚 Examples
  - 📝 Anime Recommendation:
     - `/anime recommend` - To get personalized anime recommendations.
     - `/anime recommend genre:Action,Comedy` - To get recommendations based on specific genres.
  - 📝 Anime List Management:
     - `/list add <anime title>` - To add an anime to your watchlist.
     - `/list remove <anime title>` - To remove an anime from your watchlist.
     - `/list show` - To view your anime watchlist.
  - 📝 Fun Interactions:
     - `/fun trivia` - To play a trivia game about anime.
     - `/fun meme` - To generate an anime meme.
     - `/fun character` - To generate a random anime character.
     - `/fun random` - To get a random anime fact.
  - 📝 MMORPG:
     - `/mmorpg create <character name>` - To create a new character.
     - `/mmorpg levelup` - To level up your character.
     - `/mmorpg quest` - To view and accept quests.
     - `/mmorpg battle` - To battle other players or monsters.
     - `/mmorpg inventory` - To view your inventory.
     - `/mmorpg shop` - To buy and sell items.

  ## 🌐 Hosting
  ### 🚀 Deployment Instructions

  #### Heroku
  1. Install the Heroku CLI:
     - `npm install -g heroku`
  2. Login to Heroku:
     - `heroku login`
  3. Create a new Heroku app:
     - `heroku create`
  4. Deploy the code:
     - `git push heroku main`
  5. Configure the environment variables on Heroku:
     - `DISCORD_TOKEN`
     - `POSTGRES_HOST`
     - `POSTGRES_USER`
     - `POSTGRES_PASSWORD`
     - `POSTGRES_DATABASE`
     - `REDIS_URL`
     - `OPENAI_API_KEY`
  6. Add a Heroku addon for PostgreSQL and Redis:
     - `heroku addons:create heroku-postgresql`
     - `heroku addons:create heroku-redis`
  7. Configure the database connection details in your Heroku app settings.
  8. Run the following command to start the bot:
     - `heroku ps:scale worker=1`

  ## 📜 License
  This project is licensed under the [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/).
  
  ## 👥 Authors
  - Author Name - [Spectra.codes](https://spectra.codes)
  - Creator Name - [DRIX10](https://github.com/Drix10)

  <p align="center">
    <h1 align="center">🌐 Spectra.Codes</h1>
  </p>
  <p align="center">
    <em>Why only generate Code? When you can generate the whole Repository!</em>
  </p>
  <p align="center">
	<img src="https://img.shields.io/badge/Developer-Drix10-red" alt="">
	<img src="https://img.shields.io/badge/Website-Spectra.codes-blue" alt="">
	<img src="https://img.shields.io/badge/Backed_by-Google,_Microsoft_&_Amazon_for_Startups-red" alt="">
	<img src="https://img.shields.io/badge/Finalist-Backdrop_Build_v4-black" alt="">
  <p>