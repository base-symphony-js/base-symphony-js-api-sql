# Base Symphony JS - API SQL

## Author

**[Luis Solano](https://www.linkedin.com/in/luis-fernando-solano/)**

- **Email:** luisfer.sm15@gmail.com
- **GitHub:** [XxLuisFer15xX](https://github.com/XxLuisFer15xX)

## License

This project is licensed under the [MIT License](LICENSE).

## Previous Configurations
### Essential tools
1. Install [Visual Studio Code](https://code.visualstudio.com/).
2. Install [nvm](https://github.com/nvm-sh/nvm).
3. Install [SQL Server Express Edition](https://www.microsoft.com/es-es/download/details.aspx?id=101064).
4. Install [SQL Server Management Studio](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver16).
5. Install [Postman](https://www.postman.com/).

### Essential plugins for VS Code
1. Install [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma).
2. Install [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig).
3. Install [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).
4. Install [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).
5. Install [TypeScript Importer](https://marketplace.visualstudio.com/items?itemName=pmneo.tsimporter).
6. Install [Auto Import](https://marketplace.visualstudio.com/items?itemName=steoates.autoimport).

### Recomended plugins
1. Install [Material Icon Them](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme).
2. Install [ident-rainbow](https://marketplace.visualstudio.com/items?itemName=oderwat.indent-rainbow).

### Config Prettier
1. Go to File > Preferences > Settings.
2. In the search bar at the top, type `default formatter`.
3. Search for the option **Editor: Default Formatter** and select `Prettier - Code formatter esbenp.prettier-vscode` de la lista de opciones.
4. In the same configuration window, search for `format on save`.
5. Check the box **Editor: Format On Save**.

## Steps to follow
1. Clone the project.
2. Run `nvm install $(cat .nvmrc)`.
3. Run `nvm use $(cat .nvmrc)`.
4. Run `npm install --global yarn`.
5. Run `yarn` to install dependencies.
6. Add the env folder. And add the different subfolders: local, dev, qa and prod. Each folder represents the execution environments. You only need to add the environments to which you have access.
7. Inside each subfolder you must add the .env file that contains the environment variables for the corresponding environment.
8. Run `yarn generate-credentials:local` to load the **local environment** variables.
9. Run `yarn generate-credentials:dev` to load the **development** environment variables.
10. Run `yarn generate-credentials:qa` to load the **qa environment** variables.
11. Run `yarn generate-credentials:prod` to load the **production environment** variables.
12. Run `yarn start:dev` to run the project in development mode.
13. Run `yarn test` to run the tests.
14. Run `yarn build` to compile the project.
15. Run `yarn start` to run the project in production mode.
