<h1 align="center">
  <br>
  <a href="https://github.com/faloker/purify">
  <img src="web/src/assets/logo_trans.png" height="150" alt="purify"></a>
  <br>
  Purify
  <br>
</h1>

<h4 align="center">All-in-one tool for managing vulnerability reports</h4>

<p align="center">
  <a href="https://purify-demo.herokuapp.com/">Demo</a>
</p>

<p align="center">
  <a href="https://github.com/faloker/purify/releases">
    <img src="https://img.shields.io/github/release/faloker/purify.svg">
  </a>
  <a href="https://purify-demo.herokuapp.com">
    <img src="https://heroku-badge.herokuapp.com/?app=purify-demo&style=flat&svg=1">
  </a>
    <a href="https://github.com/faloker/purify/releases">
    <img alt="GitHub" src="https://img.shields.io/github/license/faloker/purify">
  </a>
</p>

## Why

The goal of Purify to be an easy-in-use and efficient tool to simplify a workflow of managing vulnerabilities delivered from various tools. 

Purify is designed to analyze the report of **any tool**, if the report is in JSON or XML format. This means you don't need any special plug-ins to process reports from your selection of tools.

Collect all security findings in one place, review/validate/track them, collaborate, get notifications, export them into tracking systems (e.g. Jira) and so on.

## Getting Started

At the moment, the project is under development and much can change.

To start with the tool first thing you need is a report from another tool. Let's say you have to analyze your project with [Gitleaks](https://github.com/zricethezav/gitleaks). 

Because it is first time, you need to analyze all commits and it can be thousands of them. But you got a report and it is full of findings, and a lof of them a duplicate, because one secret may appear in multiple commits. Here is where Purify can help you.


The logic hierarchy of Purify is simple:
1. Project (the root component)
1. Units (the direct child of a project)
1. Reports (belong to a unit)
1. Templates (attached to a report and used to parse issues)
1. Issues (extracted from a report and formatted based on a template)


To upload a report (assumed that you already created a project and unit) you need a token:

```
http POST https://purifyhost/api/auth/token username="user" password="pass"
```

Now you can upload a report

```
http -f POST https://purifyhost/api/reports "apikey=token" "unit=gitleaks-test" file@/path/to/gitleaks-report.json
```

If you already created a template for such tool, you need to provide it, so report content will be parsed automatically

```
http -f POST https://purifyhost/api/reports "apikey=token" "unit=gitleaks-test" "template=gitleaks" file@/path/to/gitleaks-report.json
```


## Deployment

Before deployment you may want to configure a few things in config files:

**Docker**
```
// purify/docker-compose.yml

// use local database if needed
mongo:
...
environment:
  MONGO_INITDB_ROOT_USERNAME: root
  MONGO_INITDB_ROOT_PASSWORD: example


// update local path to the .env file (see api/.env.example)
api:
...
env_file:
  - .env.custom


// update local paths to certificate and key files
// update entities in nginx config file nginx.prod.conf (server_name at least)
nginx:
...
volumes:
      - /path/to/cert:/etc/nginx/ssl/cert
      - /path/to/key:/etc/nginx/ssl/key
      - ./nginx.prod.conf:/etc/nginx/nginx.conf
```
 
To start them all

```
docker-compose up -d
```

## Built With

* [Nest](https://github.com/nestjs/nest) - The web framework used
* [Vuetify](https://github.com/vuetifyjs/vuetify) - Material Component Framework for Vue

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
